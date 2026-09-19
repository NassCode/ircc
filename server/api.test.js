import assert from 'node:assert/strict';
import { createServer as createHttpServer } from 'node:http';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, before, test } from 'node:test';
import { createServer as createViteServer } from 'vite';

let baseUrl;
let httpServer;
let vite;
let tempDirectory;

function client() {
  let cookie = '';
  return async (path, options = {}) => {
    const response = await fetch(`${baseUrl}/api${path}`, {
      ...options,
      headers: { ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...(cookie ? { Cookie: cookie } : {}), ...options.headers },
    });
    const setCookie = response.headers.get('set-cookie');
    if (setCookie) cookie = setCookie.split(';')[0];
    return { response, body: await response.json() };
  };
}

before(async () => {
  tempDirectory = await mkdtemp(join(tmpdir(), 'ircc-test-'));
  process.env.IRCC_DATABASE_PATH = join(tempDirectory, 'ircc.json');
  process.env.ADMIN_USERNAME = 'test.admin';
  process.env.ADMIN_PASSWORD = 'TestAdmin2026!';
  vite = await createViteServer({ server: { middlewareMode: true }, appType: 'custom' });
  httpServer = createHttpServer(vite.middlewares);
  await new Promise((resolveListen) => httpServer.listen(0, '127.0.0.1', resolveListen));
  baseUrl = `http://127.0.0.1:${httpServer.address().port}`;
});

after(async () => {
  await new Promise((resolveClose) => httpServer.close(resolveClose));
  await vite.close();
  await rm(tempDirectory, { recursive: true });
});

test('admin and applicant lifecycle is persisted and role protected', async () => {
  const admin = client();
  let result = await admin('/login', { method: 'POST', body: JSON.stringify({ username: 'test.admin', password: 'TestAdmin2026!' }) });
  assert.equal(result.response.status, 200);
  assert.equal(result.body.user.role, 'admin');

  const applicantPayload = {
    username: 'test.applicant', password: 'Applicant2026!',
    profile: { fullName: 'Test Applicant', email: 'test@example.com', preferredLanguage: 'English' },
    application: { type: 'Invitation', number: 'I-100', purpose: 'Family visit', status: 'Received', submittedAt: '2026-09-01',
      details: { personFullName: 'Invited Person', relationship: 'Sibling', dateOfBirth: '1992-05-06', citizenship: 'French',
        countryOfResidence: 'France', passportNumber: 'FR123456', passportExpiry: '2030-01-01',
        invitationPurpose: 'Attend a family event.', plannedArrival: '2026-12-01', plannedDeparture: '2026-12-20' } },
  };
  const invalidInvitation = structuredClone(applicantPayload);
  invalidInvitation.application.details = {};
  result = await admin('/admin/users', { method: 'POST', body: JSON.stringify(invalidInvitation) });
  assert.equal(result.response.status, 400);
  assert.match(result.body.error, /Full name is required/);
  result = await admin('/admin/users', { method: 'POST', body: JSON.stringify(applicantPayload) });
  assert.equal(result.response.status, 201);
  const applicantId = result.body.applicant.id;
  assert.equal(result.body.applicant.application.details.personFullName, 'Invited Person');

  const duplicate = await admin('/admin/users', { method: 'POST', body: JSON.stringify(applicantPayload) });
  assert.equal(duplicate.response.status, 409);

  const message = await admin(`/admin/users/${applicantId}/collections/messages`, { method: 'POST', body: JSON.stringify({ title: 'Welcome', type: 'Confirmation', body: 'Your record is ready.', action: 'status' }) });
  const request = await admin(`/admin/users/${applicantId}/collections/document-requests`, { method: 'POST', body: JSON.stringify({ title: 'Passport', maxSizeMb: 4 }) });
  assert.equal(message.response.status, 201);
  assert.equal(request.response.status, 201);

  const applicant = client();
  result = await applicant('/login', { method: 'POST', body: JSON.stringify({ username: 'test.applicant', password: 'Applicant2026!' }) });
  assert.equal(result.body.user.role, 'applicant');
  const forbidden = await applicant('/admin/users');
  assert.equal(forbidden.response.status, 403);

  await applicant(`/me/messages/${message.body.item.id}/read`, { method: 'PATCH' });
  await applicant(`/me/document-requests/${request.body.item.id}/upload`, { method: 'PUT', body: JSON.stringify({ name: 'passport.pdf', type: 'application/pdf', size: 1024 }) });
  result = await admin(`/admin/users/${applicantId}`);
  assert.ok(result.body.applicant.application.messages[0].readAt);
  assert.equal(result.body.applicant.application.documentRequests[0].upload.name, 'passport.pdf');

  await admin(`/admin/users/${applicantId}`, { method: 'PATCH', body: JSON.stringify({ active: false }) });
  assert.equal((await applicant('/me')).response.status, 401);
  await admin(`/admin/users/${applicantId}`, { method: 'PATCH', body: JSON.stringify({ active: true }) });
  await admin(`/admin/users/${applicantId}/password`, { method: 'PUT', body: JSON.stringify({ password: 'Changed2026!' }) });
  assert.equal((await client()('/login', { method: 'POST', body: JSON.stringify({ username: 'test.applicant', password: 'Applicant2026!' }) })).response.status, 401);
  assert.equal((await client()('/login', { method: 'POST', body: JSON.stringify({ username: 'test.applicant', password: 'Changed2026!' }) })).response.status, 200);

  assert.equal((await admin(`/admin/users/${applicantId}`, { method: 'DELETE' })).response.status, 200);
  assert.equal((await admin(`/admin/users/${applicantId}`)).response.status, 404);
});
