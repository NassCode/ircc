import { authenticate } from './database.js';

const maxRequestBytes = 10_000;

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
      if (body.length > maxRequestBytes) {
        reject(new Error('Request body is too large.'));
        request.destroy();
      }
    });
    request.on('end', () => {
      try {
        resolve(JSON.parse(body || '{}'));
      } catch {
        reject(new Error('Request body must be valid JSON.'));
      }
    });
    request.on('error', reject);
  });
}

export function localApi(request, response, next) {
  const path = request.url?.split('?')[0];

  if (request.method === 'GET' && path === '/health') {
    sendJson(response, 200, { ok: true });
    return;
  }

  if (request.method === 'POST' && path === '/login') {
    readJson(request)
      .then(({ username, password }) => {
        if (typeof username !== 'string' || typeof password !== 'string') {
          sendJson(response, 400, { error: 'Username and password are required.' });
          return;
        }

        const user = authenticate(username.trim(), password);
        if (!user) {
          sendJson(response, 401, { error: 'The username or password is incorrect.' });
          return;
        }

        sendJson(response, 200, { user });
      })
      .catch((error) => sendJson(response, 400, { error: error.message }));
    return;
  }

  next();
}
