import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'vite';
const server = await createServer({ server: { middlewareMode: true } });
after(() => server.close());
const jobs = await server.ssrLoadModule('/src/routes/jobs/+page.server.js');
const companies = await server.ssrLoadModule('/src/routes/companies/+page.server.js');
const axios = (await import('axios')).default;
const calls = [];
axios.defaults.adapter = async config => {
  calls.push(config);
  return { data: [], status: 200, statusText: 'OK', headers: {}, config };
};
const user = { isAuthenticated: true, jwt_token: 'test-token', user: { user_roles: [] } };
const admin = { ...user, user: { user_roles: ['admin'] } };
const request = fields => new Request('http://localhost/jobs', { method: 'POST', body: new URLSearchParams(fields) });
test('anonymous direct pages redirect to login', async () => {
  for (const page of [jobs, companies]) await assert.rejects(page.load({ locals: {} }), e => e.status === 303 && e.location === '/login');
});
test('normal user loads jobs without requesting companies and sends bearer token', async () => {
  calls.length = 0;
  const result = await jobs.load({ locals: user });
  assert.deepEqual(result.companies, []);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].headers.Authorization, 'Bearer test-token');
});
test('admin loads jobs and companies with bearer token', async () => {
  calls.length = 0;
  await jobs.load({ locals: admin });
  assert.equal(calls.length, 2);
  for (const call of calls) assert.equal(call.headers.Authorization, 'Bearer test-token');
});
test('direct non-admin company page and create actions are forbidden', async () => {
  calls.length = 0;
  await assert.rejects(companies.load({ locals: user }), e => e.status === 403);
  for (const action of [jobs.actions.createJob, companies.actions.createCompany]) {
    await assert.rejects(action({ locals: user, request: request({}) }), e => e.status === 403);
  }
  assert.equal(calls.length, 0);
});
test('admin create actions send bearer token and valid payload', async () => {
  calls.length = 0;
  await jobs.actions.createJob({ locals: admin, request: request({title:'Test', description:'Test', earnings:'10', jobType:'TEST', companyId:'company'}) });
  await companies.actions.createCompany({ locals: admin, request: request({name:'Test', email:'test@example.com'}) });
  assert.equal(calls.length, 2);
  for (const call of calls) assert.equal(call.headers.Authorization, 'Bearer test-token');
});
test('logout removes both cookies and redirects to Auth0', async () => {
  const logout = await server.ssrLoadModule('/src/routes/logout/+page.server.js');
  const removed = [];
  await assert.rejects(logout.actions.default({ cookies: { set: (name, value, options) => removed.push({ name, value, options }) }, url: new URL('http://localhost:5173/logout') }), e => e.status === 303 && e.location.includes('/v2/logout?'));
  assert.deepEqual(removed.map(c => c.name).sort(), ['jwt_token', 'user_info']);
  for (const cookie of removed) assert.equal(cookie.options.maxAge, 0);
});
test('invalid session cookie is cleared and remains logged out', async () => {
  const hooks = await server.ssrLoadModule('/src/hooks.server.js');
  const removed = [];
  const event = { locals: {}, cookies: { get: key => key === 'jwt_token' ? 'invalid' : '{}', delete: name => removed.push(name) } };
  await hooks.handle({ event, resolve: async () => new Response('ok') });
  assert.equal(event.locals.isAuthenticated, false);
  assert.equal(event.locals.jwt_token, undefined);
  assert.equal(removed.length, 2);
});
