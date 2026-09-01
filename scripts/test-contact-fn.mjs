/**
 * Exercises src/pages/api/contact.ts outside a running server.
 *
 * The route only executes on a real request, so without this the server side of
 * the enquiry form ships unverified. Node 24 strips the types on import, so
 * there is no build step.
 *
 *   node scripts/test-contact-fn.mjs
 */
import { POST } from '../src/pages/api/contact.ts';

const post = async (fields, { json = true, env = {} } = {}) => {
  const body = new FormData();
  for (const [k, v] of Object.entries(fields)) body.append(k, v);
  // The route reads the webhook from the environment rather than an argument,
  // which is what every host actually gives it. Set and restore around the
  // call so cases stay independent of each other.
  const had = Object.prototype.hasOwnProperty.call(process.env, 'CONTACT_WEBHOOK_URL');
  const prev = process.env.CONTACT_WEBHOOK_URL;
  if (env.CONTACT_WEBHOOK_URL) process.env.CONTACT_WEBHOOK_URL = env.CONTACT_WEBHOOK_URL;
  else delete process.env.CONTACT_WEBHOOK_URL;
  try {
    return await POST({
      request: new Request('https://oju.studio/api/contact', {
        method: 'POST',
        body,
        headers: json ? { accept: 'application/json' } : {},
      }),
    });
  } finally {
    if (had) process.env.CONTACT_WEBHOOK_URL = prev;
    else delete process.env.CONTACT_WEBHOOK_URL;
  }
};

const valid = { name: 'Ada', email: 'ada@example.com', message: 'We need an app.' };
let failures = 0;

const check = async (label, promise, expect) => {
  const res = await promise;
  const data = res.headers.get('content-type')?.includes('json') ? await res.json() : {};
  const got = { status: res.status, code: data.code, location: res.headers.get('location') };
  const ok = Object.entries(expect).every(([k, v]) => got[k] === v);
  if (!ok) failures++;
  console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${label}`);
  if (!ok) console.log(`       expected ${JSON.stringify(expect)}\n       got      ${JSON.stringify(got)}`);
};

console.log('\ncontact function');

await check('missing env -> 503, does not pretend to send',
  post(valid), { status: 503, code: 'not_configured' });

await check('missing required fields -> 400',
  post({ name: 'Ada' }, { env: { CONTACT_WEBHOOK_URL: 'https://example.test/hook' } }),
  { status: 400, code: 'missing_fields' });

await check('malformed email -> 400',
  post({ ...valid, email: 'nope' }, { env: { CONTACT_WEBHOOK_URL: 'https://example.test/hook' } }),
  { status: 400, code: 'bad_email' });

await check('honeypot filled -> looks fine, sends nothing',
  post({ ...valid, website: 'spam' }, { env: {} }), { status: 200, code: 'ok' });

// A stub endpoint proves the happy path forwards the payload.
let received = null;
const realFetch = globalThis.fetch;
globalThis.fetch = async (url, init) => {
  received = JSON.parse(init.body);
  return new Response('{}', { status: 200 });
};
await check('configured -> 200 and forwards',
  post(valid, { env: { CONTACT_WEBHOOK_URL: 'https://example.test/hook' } }), { status: 200, code: 'ok' });
console.log(`  ${received?.email === valid.email ? 'ok  ' : 'FAIL'} payload carries the enquiry`);
if (received?.email !== valid.email) failures++;

globalThis.fetch = async () => new Response('nope', { status: 500 });
await check('upstream failure -> 502, told honestly',
  post(valid, { env: { CONTACT_WEBHOOK_URL: 'https://example.test/hook' } }), { status: 502, code: 'upstream_failed' });

globalThis.fetch = realFetch;

// No-JS path must land on a real page, not a JSON body.
await check('no-JS success -> redirects to /contact/thanks/',
  (globalThis.fetch = async () => new Response('{}', { status: 200 }),
   post(valid, { json: false, env: { CONTACT_WEBHOOK_URL: 'https://example.test/hook' } })),
  { status: 303, location: '/contact/thanks/' });
globalThis.fetch = realFetch;

await check('no-JS failure -> redirects to /contact/problem/',
  post({ name: 'Ada' }, { json: false, env: { CONTACT_WEBHOOK_URL: 'https://example.test/hook' } }),
  { status: 303, location: '/contact/problem/' });

console.log(failures ? `\n${failures} failed\n` : '\nall passed\n');
process.exitCode = failures ? 1 : 0;
