import { randomBytes, randomUUID, scryptSync, timingSafeEqual } from 'node:crypto';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { LowSync } from 'lowdb';
import { JSONFileSync } from 'lowdb/node';

const databasePath = process.env.IRCC_DATABASE_PATH
  ? resolve(process.env.IRCC_DATABASE_PATH)
  : fileURLToPath(new URL('../data/ircc.json', import.meta.url));
mkdirSync(dirname(databasePath), { recursive: true });

const database = new LowSync(new JSONFileSync(databasePath), { users: [] });
database.read();
database.data ||= { users: [] };
database.data.users ||= [];

const now = () => new Date().toISOString();
const today = () => new Date().toISOString().slice(0, 10);
const normalizeUsername = (username) => String(username || '').trim().toLowerCase();

function hashPassword(password, salt = randomBytes(16)) {
  return {
    passwordSalt: salt.toString('base64'),
    passwordHash: scryptSync(password, salt, 64).toString('base64'),
  };
}

function publicUser(user) {
  return { id: user.id, username: user.username, name: user.profile?.fullName || user.username, role: user.role, active: user.active };
}

function publicApplicant(user) {
  const { passwordHash: _hash, passwordSalt: _salt, ...safe } = user;
  return structuredClone(safe);
}

function write() {
  database.write();
}

function seedAdmin() {
  if (database.data.users.some((user) => user.role === 'admin')) return;
  const username = normalizeUsername(process.env.ADMIN_USERNAME || 'admin');
  const password = process.env.ADMIN_PASSWORD || 'Admin2026!';
  const createdAt = now();
  database.data.users.push({
    id: randomUUID(), role: 'admin', username, ...hashPassword(password), active: true,
    createdAt, updatedAt: createdAt, profile: { fullName: 'Portal administrator' },
  });
  write();
}

seedAdmin();

export class DatabaseError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}

function requireApplicant(id) {
  const user = database.data.users.find((item) => item.id === id && item.role === 'applicant');
  if (!user) throw new DatabaseError('Applicant not found.', 404);
  return user;
}

function validateUsername(username, exceptId) {
  const normalized = normalizeUsername(username);
  if (!/^[a-z0-9._-]{3,64}$/.test(normalized)) {
    throw new DatabaseError('Username must be 3 to 64 characters and use only letters, numbers, dots, underscores, or hyphens.');
  }
  if (database.data.users.some((user) => user.id !== exceptId && user.username.toLowerCase() === normalized)) {
    throw new DatabaseError('That username is already in use.', 409);
  }
  return normalized;
}

function validatePassword(password) {
  if (typeof password !== 'string' || password.length < 8) throw new DatabaseError('Password must be at least 8 characters.');
}

function required(value, label) {
  const result = String(value || '').trim();
  if (!result) throw new DatabaseError(`${label} is required.`);
  return result;
}

function optionalDate(value, label) {
  if (!value) return '';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || Number.isNaN(Date.parse(`${value}T00:00:00Z`))) {
    throw new DatabaseError(`${label} must be a valid date.`);
  }
  return value;
}

function cleanProfile(input = {}) {
  const email = String(input.email || '').trim();
  if (email && !/^\S+@\S+\.\S+$/.test(email)) throw new DatabaseError('Enter a valid email address.');
  return {
    fullName: required(input.fullName, 'Full name'),
    dateOfBirth: optionalDate(input.dateOfBirth, 'Date of birth'),
    email,
    preferredLanguage: String(input.preferredLanguage || 'English').trim(),
    countryOfResidence: String(input.countryOfResidence || '').trim(),
    passportLastFour: String(input.passportLastFour || '').replace(/\D/g, '').slice(-4),
  };
}

function cleanApplication(input = {}, existing = {}) {
  return {
    ...existing,
    type: required(input.type, 'Application type'), number: required(input.number, 'Application number'),
    uci: String(input.uci || '').trim(), purpose: String(input.purpose || '').trim(),
    submittedAt: optionalDate(input.submittedAt, 'Submission date'), status: required(input.status, 'Application status'),
    lastUpdatedAt: today(), stages: existing.stages || [], documentRequests: existing.documentRequests || [],
    providedDocuments: existing.providedDocuments || [], messages: existing.messages || [],
  };
}

export function authenticate(username, password) {
  const normalized = normalizeUsername(username);
  const user = database.data.users.find((item) => item.username.toLowerCase() === normalized);
  if (!user || !user.active || typeof password !== 'string') return null;
  const suppliedHash = scryptSync(password, Buffer.from(user.passwordSalt, 'base64'), 64);
  const storedHash = Buffer.from(user.passwordHash, 'base64');
  if (storedHash.length !== suppliedHash.length || !timingSafeEqual(suppliedHash, storedHash)) return null;
  return publicUser(user);
}

export function getSessionUser(id) {
  const user = database.data.users.find((item) => item.id === id && item.active);
  return user ? publicUser(user) : null;
}

export function listApplicants(search = '') {
  const needle = String(search).trim().toLowerCase();
  return database.data.users.filter((user) => user.role === 'applicant')
    .filter((user) => !needle || [user.username, user.profile.fullName, user.application.number]
      .some((value) => String(value).toLowerCase().includes(needle)))
    .map((user) => ({ id: user.id, username: user.username, name: user.profile.fullName, active: user.active,
      applicationType: user.application.type, applicationNumber: user.application.number,
      applicationStatus: user.application.status, lastUpdatedAt: user.application.lastUpdatedAt }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function getApplicant(id) {
  return publicApplicant(requireApplicant(id));
}

export function createApplicant(input = {}) {
  const username = validateUsername(input.username);
  validatePassword(input.password);
  const createdAt = now();
  const user = { id: randomUUID(), role: 'applicant', username, ...hashPassword(input.password), active: true,
    createdAt, updatedAt: createdAt, profile: cleanProfile(input.profile), application: cleanApplication(input.application) };
  database.data.users.push(user);
  write();
  return publicApplicant(user);
}

export function updateApplicantAccount(id, input = {}) {
  const user = requireApplicant(id);
  if (input.username !== undefined) user.username = validateUsername(input.username, id);
  if (input.active !== undefined) user.active = Boolean(input.active);
  if (input.profile) user.profile = cleanProfile(input.profile);
  user.updatedAt = now();
  write();
  return publicApplicant(user);
}

export function updateApplication(id, input = {}) {
  const user = requireApplicant(id);
  user.application = cleanApplication(input, user.application);
  user.updatedAt = now();
  write();
  return publicApplicant(user);
}

export function resetPassword(id, password) {
  validatePassword(password);
  const user = requireApplicant(id);
  Object.assign(user, hashPassword(password), { updatedAt: now() });
  write();
}

export function deleteApplicant(id) {
  const index = database.data.users.findIndex((item) => item.id === id && item.role === 'applicant');
  if (index < 0) throw new DatabaseError('Applicant not found.', 404);
  database.data.users.splice(index, 1);
  write();
}

const collectionConfig = {
  stages: { clean: (input) => ({ label: required(input.label, 'Stage label'),
    state: ['complete', 'current', 'waiting'].includes(input.state) ? input.state : 'waiting',
    date: String(input.date || '').trim(), detail: String(input.detail || '').trim() }) },
  'document-requests': { field: 'documentRequests', clean: (input) => ({ title: required(input.title, 'Document request title'),
    description: String(input.description || '').trim(), requestedAt: optionalDate(input.requestedAt, 'Requested date'),
    dueAt: optionalDate(input.dueAt, 'Due date'), acceptedFormats: String(input.acceptedFormats || 'PDF, JPG or PNG').trim(),
    maxSizeMb: Math.max(1, Math.min(100, Number(input.maxSizeMb) || 4)) }) },
  'provided-documents': { field: 'providedDocuments', clean: (input) => ({ title: required(input.title, 'Document title'),
    description: String(input.description || '').trim(), providedAt: optionalDate(input.providedAt, 'Provided date'),
    status: String(input.status || 'Received').trim() }) },
  messages: { clean: (input) => ({ title: required(input.title, 'Message title'), type: required(input.type, 'Message type'),
    sentAt: optionalDate(input.sentAt, 'Message date') || today(), body: required(input.body, 'Message body'),
    action: ['none', 'status', 'documents'].includes(input.action) ? input.action : 'none' }) },
};

function getCollection(user, name) {
  const config = collectionConfig[name];
  if (!config) throw new DatabaseError('Unknown collection.', 404);
  return { config, items: user.application[config.field || name] };
}

export function addCollectionItem(userId, collectionName, input = {}) {
  const user = requireApplicant(userId);
  const { config, items } = getCollection(user, collectionName);
  const item = { id: randomUUID(), ...config.clean(input) };
  if (collectionName === 'messages') item.readAt = null;
  if (collectionName === 'document-requests') item.upload = null;
  items.push(item);
  user.application.lastUpdatedAt = today(); user.updatedAt = now(); write();
  return item;
}

export function updateCollectionItem(userId, collectionName, itemId, input = {}) {
  const user = requireApplicant(userId);
  const { config, items } = getCollection(user, collectionName);
  const item = items.find((entry) => entry.id === itemId);
  if (!item) throw new DatabaseError('Item not found.', 404);
  const preserved = collectionName === 'messages' ? { readAt: item.readAt }
    : collectionName === 'document-requests' ? { upload: item.upload } : {};
  Object.assign(item, config.clean(input), preserved);
  user.application.lastUpdatedAt = today(); user.updatedAt = now(); write();
  return item;
}

export function deleteCollectionItem(userId, collectionName, itemId) {
  const user = requireApplicant(userId);
  const { items } = getCollection(user, collectionName);
  const index = items.findIndex((entry) => entry.id === itemId);
  if (index < 0) throw new DatabaseError('Item not found.', 404);
  items.splice(index, 1);
  user.application.lastUpdatedAt = today(); user.updatedAt = now(); write();
}

export function reorderStages(userId, orderedIds = []) {
  const user = requireApplicant(userId);
  const stages = user.application.stages;
  if (orderedIds.length !== stages.length || new Set(orderedIds).size !== stages.length || orderedIds.some((id) => !stages.some((stage) => stage.id === id))) {
    throw new DatabaseError('Stage order must contain every stage exactly once.');
  }
  user.application.stages = orderedIds.map((id) => stages.find((stage) => stage.id === id));
  user.application.lastUpdatedAt = today(); write();
  return user.application.stages;
}

export function markMessageRead(userId, messageId) {
  const user = requireApplicant(userId);
  const message = user.application.messages.find((item) => item.id === messageId);
  if (!message) throw new DatabaseError('Message not found.', 404);
  message.readAt ||= now(); write(); return message;
}

export function saveUploadMetadata(userId, requestId, input = {}) {
  const user = requireApplicant(userId);
  const request = user.application.documentRequests.find((item) => item.id === requestId);
  if (!request) throw new DatabaseError('Document request not found.', 404);
  const name = required(input.name, 'File name');
  const size = Number(input.size);
  if (!Number.isFinite(size) || size < 0) throw new DatabaseError('Valid file metadata is required.');
  if (size > request.maxSizeMb * 1024 * 1024) throw new DatabaseError(`File must be no larger than ${request.maxSizeMb} MB.`);
  request.upload = { name: name.slice(0, 255), type: String(input.type || 'application/octet-stream').slice(0, 100), size, uploadedAt: now() };
  write(); return request.upload;
}

export function removeUploadMetadata(userId, requestId) {
  const user = requireApplicant(userId);
  const request = user.application.documentRequests.find((item) => item.id === requestId);
  if (!request) throw new DatabaseError('Document request not found.', 404);
  request.upload = null; write();
}
