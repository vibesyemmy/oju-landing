/**
 * Contact form handler — an Astro API route.
 *
 * This was a Cloudflare Pages Function at functions/api/contact.ts. The site
 * deploys to Vercel, which never reads a root functions/ directory and does not
 * include it in the build, so that file was dead code in production: POST
 * /api/contact returned 404, and the no-JS path landed on a 404 page rather
 * than /contact/problem/. None of the careful failure handling below ever ran.
 *
 * Written against Astro's own endpoint contract rather than any host's, so it
 * follows whichever adapter is configured. Moving off Vercel later means
 * swapping the adapter, not rewriting this.
 *
 * The rest of the site stays static. Only this route opts out, so a form post
 * is the one request that touches a server.
 *
 * REQUIRED before this works in production:
 *   Set CONTACT_WEBHOOK_URL in the Vercel project's environment variables.
 *   Point it at whatever should receive enquiries — a Resend/Postmark endpoint,
 *   a Slack incoming webhook, a Zapier catch hook, anything taking a JSON POST.
 *
 * Without it this returns 503 and the form says so. It does NOT pretend to
 * succeed. A contact form that silently swallows enquiries is worse than no
 * contact form, because you never find out.
 */
import type { APIRoute } from 'astro';

export const prerender = false;

const MAX = { name: 120, email: 200, company: 160, budget: 60, message: 5000 };

const clean = (v: FormDataEntryValue | null, cap: number) =>
  typeof v === 'string' ? v.trim().slice(0, cap) : '';

/** Deliberately loose. Rejecting valid addresses costs more than a bad one. */
const looksLikeEmail = (v: string) => /^[^@\s]+@[^@\s.]+\.[^@\s]+$/.test(v);

const wantsJson = (req: Request) => (req.headers.get('accept') ?? '').includes('application/json');

function reply(request: Request, status: number, code: string, message: string) {
  if (wantsJson(request)) {
    return new Response(JSON.stringify({ ok: status < 400, code, message }), {
      status,
      headers: { 'content-type': 'application/json' },
    });
  }
  // No-JS path: land on a real page rather than a bare JSON body.
  const to = status < 400 ? '/contact/thanks/' : '/contact/problem/';
  return new Response(null, { status: 303, headers: { location: to } });
}

export const POST: APIRoute = async ({ request }) => {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return reply(request, 400, 'bad_request', 'That submission could not be read.');
  }

  // Honeypot: a real person never fills a hidden field.
  if (clean(form.get('website'), 200)) {
    // Look successful to the bot; send nothing on.
    return reply(request, 200, 'ok', 'Thanks. We will be in touch.');
  }

  const name = clean(form.get('name'), MAX.name);
  const email = clean(form.get('email'), MAX.email);
  const company = clean(form.get('company'), MAX.company);
  const budget = clean(form.get('budget'), MAX.budget);
  const message = clean(form.get('message'), MAX.message);

  if (!name || !email || !message) {
    return reply(request, 400, 'missing_fields', 'Name, email and a description are all required.');
  }
  if (!looksLikeEmail(email)) {
    return reply(request, 400, 'bad_email', 'That email address does not look right.');
  }

  // Read at call time, not module scope: on a serverless host the variable can
  // be present at runtime while absent when the module was bundled.
  // Optional-chained: `import.meta.env` exists under Vite and Astro but not
  // under plain Node, where the test harness imports this module directly.
  const endpoint = import.meta.env?.CONTACT_WEBHOOK_URL ?? process.env.CONTACT_WEBHOOK_URL;
  if (!endpoint) {
    // Loud failure by design — see the note at the top of this file.
    return reply(
      request,
      503,
      'not_configured',
      'The contact form is not connected yet. Please email us directly.',
    );
  }

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        source: 'ojustudio.com/contact',
        receivedAt: new Date().toISOString(),
        name,
        email,
        company: company || null,
        budget: budget || null,
        message,
      }),
    });
    if (!res.ok) throw new Error(`upstream ${res.status}`);
  } catch {
    return reply(request, 502, 'upstream_failed', 'We could not send that. Please email us directly.');
  }

  return reply(request, 200, 'ok', 'Thanks. We will come back to you within two working days.');
};

/** Everything that is not POST. Astro routes by exported method name. */
export const ALL: APIRoute = async () =>
  new Response('Method not allowed', { status: 405, headers: { allow: 'POST' } });
