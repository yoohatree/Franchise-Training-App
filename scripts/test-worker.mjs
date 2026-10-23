import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const source = await readFile(join(root, 'dist', 'server', 'index.js'), 'utf8');
const { default: worker } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);

class Bucket {
  data = new Map();
  async get(key) {
    const value = this.data.get(key);
    return value === undefined ? null : { json: async () => JSON.parse(value) };
  }
  async put(key, value) { this.data.set(key, value); }
  async list({ prefix }) {
    return { objects: [...this.data.keys()].filter(key => key.startsWith(prefix)).map(key => ({ key })), truncated: false };
  }
}

const env = { BUCKET: new Bucket() };
const owner = { 'oai-authenticated-user-id': 'site-owner-1', 'oai-authenticated-user-email': 'yoohatree@gmail.com' };
const staff = { 'oai-authenticated-user-id': 'site-staff-1', 'oai-authenticated-user-email': 'employee@example.com' };
const origin = 'https://training.example.test';
const send = (path, { method = 'GET', headers = {}, body } = {}) => worker.fetch(new Request(`${origin}${path}`, { method, headers, body }), env);

let result = await send('/');
assert.match(await result.text(), /로그인하고 승인 요청하기/);
assert.equal((await send('/lesson-content.js')).status, 403);
assert.equal((await send('/admin', { headers: staff })).status, 403);

result = await send('/api/request', { method: 'POST', headers: { ...staff, origin: 'https://other.example.test' } });
assert.equal(result.status, 403);
assert.equal(env.BUCKET.data.size, 0);

result = await send('/api/request', { method: 'POST', headers: { ...staff, origin } });
assert.equal(result.status, 303);
assert.equal((await send('/lesson-content.js', { headers: staff })).status, 403);
assert.match(await (await send('/', { headers: staff })).text(), /승인 대기 중/);
assert.match(await (await send('/admin', { headers: owner })).text(), /employee@example.com/);

const approval = new URLSearchParams({ id: 'site-staff-1', status: 'approved' });
result = await send('/api/admin/status', { method: 'POST', headers: { ...staff, origin }, body: approval });
assert.equal(result.status, 403);
result = await send('/api/admin/status', { method: 'POST', headers: { ...owner, origin }, body: approval });
assert.equal(result.status, 303);
assert.match(await (await send('/', { headers: staff })).text(), /Yoohastree Franchise Training/);
assert.equal((await send('/lesson-content.js', { headers: staff })).status, 200);

result = await send('/api/admin/status', { method: 'POST', headers: { ...owner, origin }, body: new URLSearchParams({ id: 'site-staff-1', status: 'rejected' }) });
assert.equal(result.status, 303);
assert.equal((await send('/lesson-content.js', { headers: staff })).status, 403);
assert.equal((await send('/styles.css', { headers: owner })).status, 200);
console.log('Approval request, owner approval, asset protection, and revocation: OK');

const clerkBucket = new Bucket();
await clerkBucket.put('requests/legacy-staff.json', JSON.stringify({ id: 'legacy-staff', email: 'employee@example.com', status: 'approved', requestedAt: '2026-10-22T00:00:00.000Z' }));
const clerkClient = {
  async authenticateRequest(request) {
    const id = request.headers.get('x-test-clerk-id');
    return { isAuthenticated: Boolean(id), headers: new Headers(), toAuth: () => ({ userId: id }) };
  },
  users: {
    async getUser(id) {
      const email = id === 'owner' ? 'yoohatree@gmail.com' : 'employee@example.com';
      return { primaryEmailAddressId: 'email-1', emailAddresses: [{ id: 'email-1', emailAddress: email, verification: { status: id === 'unverified' ? 'unverified' : 'verified' } }] };
    }
  }
};
const clerkEnv = { BUCKET: clerkBucket, AUTH_PROVIDER: 'clerk', CLERK_PUBLISHABLE_KEY: 'pk_test_YWJjJA', CLERK_SECRET_KEY: 'sk_test_example', __clerkClient: clerkClient };
const sendClerk = (path, { method = 'GET', headers = {}, body } = {}) => worker.fetch(new Request(`${origin}${path}`, { method, headers, body }), clerkEnv);
assert.match(await (await sendClerk('/')).text(), /clerk-sign-in/);
assert.equal((await sendClerk('/lesson-content.js', { headers: staff })).status, 403);
assert.equal((await sendClerk('/lesson-content.js', { headers: { 'x-test-clerk-id': 'unverified' } })).status, 403);
assert.equal((await sendClerk('/lesson-content.js', { headers: { 'x-test-clerk-id': 'staff' } })).status, 200);
assert.equal((await sendClerk('/admin', { headers: { 'x-test-clerk-id': 'staff' } })).status, 403);
assert.match(await (await sendClerk('/admin', { headers: { 'x-test-clerk-id': 'owner' } })).text(), /employee@example.com/);
await sendClerk('/api/admin/status', { method: 'POST', headers: { origin, 'x-test-clerk-id': 'owner' }, body: new URLSearchParams({ id: 'legacy-staff', status: 'rejected' }) });
assert.equal((await sendClerk('/lesson-content.js', { headers: { 'x-test-clerk-id': 'staff' } })).status, 403);
console.log('Clerk verified identity, legacy approval lookup, owner access, and revocation: OK');
