/**
 * Contact form handler — Cloudflare Pages Function.
 *
 * Deployed automatically alongside the static build; nothing to configure in
 * Astro. Lives outside src/ because Pages Functions are routed by file path
 * from the project root.
 *
 * REQUIRED before this works in production:
 *   Set CONTACT_WEBHOOK_URL in the Pages project's environment variables.
 *   Point it at whatever you want to receive enquiries — a Resend/Postmark
 *   endpoint, a Slack incoming webhook, a Zapier catch hook, anything that
 *   accepts a JSON POST.
 *
 * If that variable is missing, this returns 503 and the form says so. It does
 * NOT pretend to succeed. A contact form that silently swallows enquiries is
 * worse than no contact form, because you never find out.
 */

interface Env {
  CONTACT_WEBHOOK_URL?: string;
}

type Ctx = { request: Request; env: Env };

const MAX = { name: 120, email: 200, company: 160, budget: 60, message: 5000 };

const clean = (v: FormDataEntryValue | null, cap: number) =>
  typeof v === 'string' ? v.trim().slice(0, cap) : '';

/** Deliberately loose. Rejecting valid addresses costs more than a bad one. */
const looksLikeEmail = (v: string) => /^[^@\s]+@[^@\s.]+\.[^@\s]+$/.test(v);

const wantsJson = (req: Request) => (req.headers.get('accept') ?? '').includes('application/json');

function reply(ctx: Ctx, status: number, code: string, message: string) {
  if (wantsJson(ctx.request)) {
    return new Response(JSON.stringify({ ok: status < 400, code, message }), {
      status,
      headers: { 'content-type': 'application/json' },
    });
  }
  // No-JS path: land on a real page rather than a bare JSON body.
  const to = status < 400 ? '/contact/thanks/' : '/contact/problem/';
  return new Response(null, { status: 303, headers: { location: to } });
}

export const onRequestPost = async (ctx: Ctx): Promise<Response> => {
  let form: FormData;
  try {
    form = await ctx.request.formData();
  } catch {
    return reply(ctx, 400, 'bad_request', 'That submission could not be read.');
  }

  // Honeypot: a real person never fills a hidden field.
  if (clean(form.get('website'), 200)) {
    // Look successful to the bot; send nothing on.
    return reply(ctx, 200, 'ok', 'Thanks — we will be in touch.');
  }

  const name = clean(form.get('name'), MAX.name);
  const email = clean(form.get('email'), MAX.email);
  const company = clean(form.get('company'), MAX.company);
  const budget = clean(form.get('budget'), MAX.budget);
  const message = clean(form.get('message'), MAX.message);

  if (!name || !email || !message) {
    return reply(ctx, 400, 'missing_fields', 'Name, email and a description are all required.');
  }
  if (!looksLikeEmail(email)) {
    return reply(ctx, 400, 'bad_email', 'That email address does not look right.');
  }

  const endpoint = ctx.env.CONTACT_WEBHOOK_URL;
  if (!endpoint) {
    // Loud failure by design — see the note at the top of this file.
    return reply(
      ctx,
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
        source: 'oju.studio/contact',
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
    return reply(ctx, 502, 'upstream_failed', 'We could not send that. Please email us directly.');
  }

  return reply(ctx, 200, 'ok', 'Thanks — we will come back to you within two working days.');
};

/**
 * Everything that is not POST. Cloudflare gives method-specific handlers
 * precedence, so onRequestPost above already owns POST and this never sees it.
 */
export const onRequest = async (): Promise<Response> =>
  new Response('Method not allowed', { status: 405, headers: { allow: 'POST' } });
