import { randomBytes } from 'node:crypto';
import {
  DatabaseError, addCollectionItem, authenticate, createApplicant, deleteApplicant,
  deleteCollectionItem, getApplicant, getSessionUser, listApplicants, markMessageRead,
  removeUploadMetadata, reorderStages, resetPassword, saveUploadMetadata,
  updateApplicantAccount, updateApplication, updateCollectionItem,
} from './database.js';

const maxRequestBytes = 1_000_000;
const sessionLifetimeMs = 8 * 60 * 60 * 1000;
const sessions = new Map();

function sendJson(response, status, body) {
  response.statusCode = status;
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.setHeader('Cache-Control', 'no-store');
  response.end(JSON.stringify(body));
}

function readJson(request) {
  return new Promise((resolve, reject) => {
    let body = '';
    request.setEncoding('utf8');
    request.on('data', (chunk) => {
      body += chunk;
      if (body.length > maxRequestBytes) reject(new DatabaseError('Request body is too large.', 413));
    });
    request.on('end', () => {
      try { resolve(JSON.parse(body || '{}')); }
      catch { reject(new DatabaseError('Request body must be valid JSON.')); }
    });
    request.on('error', reject);
  });
}

function getCookie(request, name) {
  const cookies = String(request.headers.cookie || '').split(';');
  for (const cookie of cookies) {
    const [key, ...value] = cookie.trim().split('=');
    if (key === name) return decodeURIComponent(value.join('='));
  }
  return null;
}

function getAuthenticatedUser(request) {
  const token = getCookie(request, 'ircc_session');
  const session = token ? sessions.get(token) : null;
  if (!session || session.expiresAt <= Date.now()) {
    if (token) sessions.delete(token);
    throw new DatabaseError('Your session has expired. Sign in again.', 401);
  }
  const user = getSessionUser(session.userId);
  if (!user) {
    sessions.delete(token);
    throw new DatabaseError('Your account is unavailable.', 401);
  }
  return user;
}

function requireRole(request, role) {
  const user = getAuthenticatedUser(request);
  if (user.role !== role) throw new DatabaseError('You do not have permission to access this resource.', 403);
  return user;
}

function routeParts(path) {
  return path.split('/').filter(Boolean).map(decodeURIComponent);
}

async function handleApi(request, response, next) {
  const url = new URL(request.url || '/', 'http://local.test');
  const path = url.pathname;
  const parts = routeParts(path);

  if (request.method === 'GET' && path === '/health') return sendJson(response, 200, { ok: true });

  if (request.method === 'POST' && path === '/login') {
    const { username, password } = await readJson(request);
    if (typeof username !== 'string' || typeof password !== 'string') throw new DatabaseError('Username and password are required.');
    const user = authenticate(username, password);
    if (!user) throw new DatabaseError('The username or password is incorrect, or the account is inactive.', 401);
    const token = randomBytes(32).toString('base64url');
    sessions.set(token, { userId: user.id, expiresAt: Date.now() + sessionLifetimeMs });
    response.setHeader('Set-Cookie', `ircc_session=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${sessionLifetimeMs / 1000}`);
    return sendJson(response, 200, { user });
  }

  if (request.method === 'POST' && path === '/logout') {
    const token = getCookie(request, 'ircc_session');
    if (token) sessions.delete(token);
    response.setHeader('Set-Cookie', 'ircc_session=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0');
    return sendJson(response, 200, { ok: true });
  }

  if (request.method === 'GET' && path === '/session') {
    return sendJson(response, 200, { user: getAuthenticatedUser(request) });
  }

  if (request.method === 'GET' && path === '/me') {
    const user = requireRole(request, 'applicant');
    return sendJson(response, 200, { applicant: getApplicant(user.id) });
  }

  if (parts[0] === 'me' && parts[1] === 'messages' && parts[3] === 'read' && request.method === 'PATCH') {
    const user = requireRole(request, 'applicant');
    return sendJson(response, 200, { message: markMessageRead(user.id, parts[2]) });
  }

  if (parts[0] === 'me' && parts[1] === 'document-requests' && parts[3] === 'upload') {
    const user = requireRole(request, 'applicant');
    if (request.method === 'PUT') return sendJson(response, 200, { upload: saveUploadMetadata(user.id, parts[2], await readJson(request)) });
    if (request.method === 'DELETE') {
      removeUploadMetadata(user.id, parts[2]);
      return sendJson(response, 200, { ok: true });
    }
  }

  if (path === '/admin/users') {
    requireRole(request, 'admin');
    if (request.method === 'GET') return sendJson(response, 200, { applicants: listApplicants(url.searchParams.get('q') || '') });
    if (request.method === 'POST') return sendJson(response, 201, { applicant: createApplicant(await readJson(request)) });
  }

  if (parts[0] === 'admin' && parts[1] === 'users' && parts[2]) {
    requireRole(request, 'admin');
    const userId = parts[2];
    if (parts.length === 3) {
      if (request.method === 'GET') return sendJson(response, 200, { applicant: getApplicant(userId) });
      if (request.method === 'PATCH') return sendJson(response, 200, { applicant: updateApplicantAccount(userId, await readJson(request)) });
      if (request.method === 'DELETE') {
        deleteApplicant(userId);
        return sendJson(response, 200, { ok: true });
      }
    }
    if (parts[3] === 'password' && request.method === 'PUT') {
      const { password } = await readJson(request);
      resetPassword(userId, password);
      return sendJson(response, 200, { ok: true });
    }
    if (parts[3] === 'application' && parts.length === 4 && request.method === 'PATCH') {
      return sendJson(response, 200, { applicant: updateApplication(userId, await readJson(request)) });
    }
    if (parts[3] === 'stages' && parts[4] === 'order' && request.method === 'PUT') {
      const { ids } = await readJson(request);
      return sendJson(response, 200, { stages: reorderStages(userId, ids) });
    }
    if (parts[3] === 'collections' && parts[4]) {
      const collectionName = parts[4];
      if (parts.length === 5 && request.method === 'POST') {
        return sendJson(response, 201, { item: addCollectionItem(userId, collectionName, await readJson(request)) });
      }
      if (parts[5] && request.method === 'PATCH') {
        return sendJson(response, 200, { item: updateCollectionItem(userId, collectionName, parts[5], await readJson(request)) });
      }
      if (parts[5] && request.method === 'DELETE') {
        deleteCollectionItem(userId, collectionName, parts[5]);
        return sendJson(response, 200, { ok: true });
      }
    }
  }

  next();
}

export function localApi(request, response, next) {
  handleApi(request, response, next).catch((error) => {
    const status = error instanceof DatabaseError ? error.status : 500;
    if (status === 500) console.error(error);
    if (!response.writableEnded) sendJson(response, status, { error: status === 500 ? 'The local service encountered an error.' : error.message });
  });
}
