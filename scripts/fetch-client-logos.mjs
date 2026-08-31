#!/usr/bin/env node
/**
 * Fetches client logos from Wikimedia Commons.
 *
 * Commons is the least-bad public source: real SVGs, and every file carries a
 * licence and provenance trail, which the logo-aggregator sites do not. It only
 * covers companies notable enough to have an article, so smaller clients will
 * come back empty — that is expected, not a failure.
 *
 * Nothing here decides what is correct. It downloads candidates for a human to
 * look at, because the top search hit for a bank is as likely to be a
 * superseded mark as the current one.
 *
 *   node scripts/fetch-client-logos.mjs <outdir>
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const OUT = process.argv[2] || 'logo-candidates';

/** search: what to ask Commons. name: what we call the client. */
const WANTED = [
  { name: 'GTBank', search: 'GTBank logo' },
  { name: 'MTN', search: 'MTN Group logo' },
  { name: 'Union Bank', search: 'Union Bank of Nigeria logo' },
  { name: 'Sterling Bank', search: 'Sterling Bank Nigeria logo' },
  { name: 'VFD Microfinance Bank', search: 'VFD Group logo' },
  { name: 'Consolidated Hallmark Insurance', search: 'Consolidated Hallmark Insurance logo' },
  { name: 'Kairos Capital', search: 'Kairos Capital logo' },
];

const API = 'https://commons.wikimedia.org/w/api.php';
const UA = 'oju-studio-site/1.0 (client logo sourcing; contact via github.com/vibesyemmy/oju-landing)';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Commons rate-limits, and rightly so — this is a free service. One request per
 * second, backing off on 429 rather than retrying straight into the same wall.
 */
const api = async (params, attempt = 0) => {
  const url = `${API}?${new URLSearchParams({ format: 'json', origin: '*', ...params })}`;
  const res = await fetch(url, { headers: { 'user-agent': UA } });

  if (res.status === 429 && attempt < 4) {
    const wait = 2000 * (attempt + 1);
    await sleep(wait);
    return api(params, attempt + 1);
  }
  if (!res.ok) throw new Error(`API ${res.status}`);
  await sleep(1000);
  return res.json();
};

/** File pages whose title looks like a logo, vector first. */
const findFiles = async (term) => {
  const data = await api({
    action: 'query',
    list: 'search',
    srsearch: `${term} filetype:bitmap|drawing`,
    srnamespace: '6',
    srlimit: '8',
  });
  const titles = (data?.query?.search ?? []).map((s) => s.title);
  return titles.sort((a, b) => Number(b.endsWith('.svg')) - Number(a.endsWith('.svg')));
};

const fileUrl = async (title) => {
  const data = await api({ action: 'query', titles: title, prop: 'imageinfo', iiprop: 'url|size|extmetadata' });
  const page = Object.values(data?.query?.pages ?? {})[0];
  const info = page?.imageinfo?.[0];
  if (!info) return null;
  return {
    url: info.url,
    width: info.width,
    height: info.height,
    licence: info.extmetadata?.LicenseShortName?.value ?? 'unknown',
    descriptionUrl: info.descriptionurl,
  };
};

await mkdir(OUT, { recursive: true });
const report = [];

for (const { name, search } of WANTED) {
  process.stdout.write(`${name.padEnd(32)} `);
  try {
    const titles = await findFiles(search);
    if (titles.length === 0) {
      console.log('no result');
      report.push({ name, status: 'none' });
      continue;
    }

    const title = titles[0];
    const info = await fileUrl(title);
    if (!info) {
      console.log('no file info');
      report.push({ name, status: 'none' });
      continue;
    }

    // Extension from the path only — Commons URLs carry query params, and
    // splitting the whole URL grabs those instead.
    const ext = (new URL(info.url).pathname.split('.').pop() || 'png').toLowerCase();
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const dest = join(OUT, `${slug}.${ext}`);
    const bin = Buffer.from(await (await fetch(info.url, { headers: { 'user-agent': UA } })).arrayBuffer());
    await writeFile(dest, bin);

    console.log(`${ext.toUpperCase()} ${info.width}x${info.height}  ${(bin.length / 1024).toFixed(0)}KB  ${info.licence}`);
    report.push({ name, status: 'ok', file: dest, title, licence: info.licence, page: info.descriptionUrl });
  } catch (err) {
    console.log(`failed: ${err.message}`);
    report.push({ name, status: 'error', error: err.message });
  }
}

await writeFile(join(OUT, '_provenance.json'), JSON.stringify(report, null, 2));
const ok = report.filter((r) => r.status === 'ok').length;
console.log(`\n${ok} of ${WANTED.length} downloaded. Provenance in ${OUT}/_provenance.json`);
console.log('Every one needs eyes on it before use — a top hit can be a superseded mark.');
