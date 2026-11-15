#!/usr/bin/env node
/**
 * Builds the GitHub profile README for github.com/bhargavang (plus its light and dark banner)
 * and copies the portfolio site into site/ for GitHub Pages.
 *
 *   node scripts/build.mjs
 *
 * To change anything (role, projects, links, wording), edit CONFIG below and re-run.
 * Don't edit README.md or assets/hero*.svg by hand; they are overwritten on every build
 * (the daily "Refresh profile stats" workflow runs this script too).
 * The README matches the portfolio: warm white, stone, charcoal and one terracotta accent.
 */
import { copyFileSync, cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const ASSETS = join(ROOT, 'assets');

// ------------------------------------------------------------------ CONFIG
const CONFIG = {
  user: 'bhargavang',
  name: 'Bhargav Angadi',
  email: 'bhargav.angadi@gmail.com',
  role: 'Associate Software Engineer',
  company: 'Torry Harris Business Solutions',
  headline: ['Software that ships,', 'and keeps working.'],
  intro: 'I build Java and Spring Boot backends and REST APIs at work, and websites, booking systems and online stores for small businesses on the side.',
  // The portfolio page that gets published to GitHub Pages from site/
  portfolioSource: join(ROOT, '..', 'portfolio', 'index.html'),

  // Images are the portfolio's own (site/img), so the README and the site always show the same thing.
  projects: [
    {
      title: 'Saffron Table', kind: 'Restaurant website',
      desc: 'Menu, gallery and online table booking. Guest and owner both get an email; staff manage bookings from an admin page.',
      stack: ['Next.js', 'TypeScript', 'Tailwind', 'PostgreSQL'],
      img: 'site/img/saffron-table-poster.webp', alt: 'Saffron Table home page',
      demo: 'https://saffron-table-one.vercel.app', repo: 'https://github.com/bhargavang/saffron-table',
    },
    {
      title: 'CareDesk', kind: 'Booking app for clinics & salons',
      desc: 'Customers book a free slot online and staff run the day from a dashboard. The database rules out double bookings.',
      stack: ['Java', 'Spring Boot', 'React', 'PostgreSQL', 'Docker'],
      img: 'site/img/caredesk-poster.webp', alt: 'CareDesk booking page',
      repo: 'https://github.com/bhargavang/caredesk',
    },
    {
      title: 'Kora Threads', kind: 'Shopify theme',
      desc: 'A custom theme for a demo clothing brand, with a size guide, fabric and care details, and an Order on WhatsApp button.',
      stack: ['Shopify', 'Liquid', 'JavaScript', 'CSS'],
      img: 'site/img/kora-threads-800.webp', alt: 'Kora Threads demo products',
      repo: 'https://github.com/bhargavang/kora-threads-theme',
    },
    {
      title: 'BudgetX', kind: 'Personal finance app',
      desc: "Track salary, EMIs and expenses and see what's safe to invest. Spring Boot microservices behind an API gateway.",
      stack: ['Java', 'Spring Cloud', 'Kafka', 'Redis', 'MySQL', 'React'],
      img: 'site/img/budgetx-800.webp', alt: 'BudgetX dashboard and phone app',
      repo: 'https://github.com/bhargavang/Budgetx',
    },
  ],

  earlier: [
    { name: 'Road Accident Analytics', repo: 'https://github.com/bhargavang/Road-Accident-Analytics' },
    { name: 'HR Analytics', repo: 'https://github.com/bhargavang/HR-DATA-ANALYTICS' },
  ],

  stack: [
    ['Backend', 'Java, Spring Boot, Spring Cloud, REST APIs, Node.js'],
    ['Frontend', 'React, Next.js, TypeScript, Tailwind CSS'],
    ['Data', 'PostgreSQL, MySQL, Redis, Kafka'],
    ['Tools', 'Docker, Git, GitHub Actions, Maven, Vercel'],
    ['Stores', 'Shopify (Liquid), WordPress, WooCommerce'],
  ],
};

const PORTFOLIO_URL = `https://${CONFIG.user}.github.io/${CONFIG.user}/`;

// ------------------------------------------------------------------ Design tokens (same as the portfolio)
const THEMES = {
  light: { bg: '#faf8f5', ink: '#2b2622', muted: '#6f6760', line: '#e4ddd3', panel: '#e9e3da', onPanel: '#2b2622', live: '#3f8f5a' },
  dark: { bg: '#1c1917', ink: '#f5f1ea', muted: '#a8a097', line: '#332d28', panel: '#2a2521', onPanel: '#f5f1ea', live: '#5fbf7f' },
};
const SERIF = `'EB Garamond','Iowan Old Style','Palatino Linotype',Palatino,'Book Antiqua',Georgia,serif`;
const SANS = `'Figtree',-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif`;

const e = (s) => String(s).replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));

// ------------------------------------------------------------------ Banner (one SVG per GitHub theme)
function banner(mode) {
  const c = THEMES[mode];
  const W = 1200, H = 400, R = 24, band = 72;
  const label = `${CONFIG.name}, software developer in India. ${CONFIG.headline.join(' ')} ${CONFIG.role} at ${CONFIG.company}. Open to freelance projects.`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${e(label)}">
<defs><clipPath id="card"><rect width="${W}" height="${H}" rx="${R}"/></clipPath></defs>
<style>
  .serif{font-family:${SERIF}}.sans{font-family:${SANS}}
  .in{animation:in 1s cubic-bezier(.2,.7,.2,1) both}.d1{animation-delay:.08s}.d2{animation-delay:.16s}.d3{animation-delay:.26s}
  @keyframes in{from{opacity:0;transform:translateY(8px)}}
  @media (prefers-reduced-motion:reduce){*{animation:none!important}}
</style>
<g clip-path="url(#card)">
  <rect width="${W}" height="${H}" fill="${c.bg}"/>
  <text x="64" y="74" class="sans" font-size="20" font-weight="600" fill="${c.ink}">${e(CONFIG.name)}</text>
  <text x="${W - 64}" y="74" class="sans" font-size="16" fill="${c.muted}" text-anchor="end">${e(PORTFOLIO_URL.replace(/^https:\/\//, '').replace(/\/$/, ''))}</text>
  <text x="${W / 2}" y="142" class="sans in" font-size="13" font-weight="500" letter-spacing="2.6" fill="${c.muted}" text-anchor="middle">SOFTWARE DEVELOPER · INDIA</text>
  <text x="${W / 2}" y="214" class="serif in d1" font-size="70" letter-spacing="-1.6" fill="${c.ink}" text-anchor="middle">${e(CONFIG.headline[0])}</text>
  <text x="${W / 2}" y="286" class="serif in d2" font-size="70" font-style="italic" letter-spacing="-1.6" fill="${c.ink}" text-anchor="middle">${e(CONFIG.headline[1])}</text>
  <path class="in d3" d="M0 ${H - band + R}a${R} ${R} 0 0 1 ${R} -${R}h${W - 2 * R}a${R} ${R} 0 0 1 ${R} ${R}V${H}H0z" fill="${c.panel}"/>
  <g class="in d3">
    <text x="${W / 2}" y="${H - band / 2 + 6}" class="sans" font-size="17" fill="${c.onPanel}" text-anchor="middle">${e(CONFIG.role)} at ${e(CONFIG.company)}<tspan fill="${c.muted}">  ·  </tspan><tspan fill="${c.live}">●</tspan> Open to freelance projects</text>
  </g>
</g>
<rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="${R}" fill="none" stroke="${c.line}"/>
</svg>
`;
}

// ------------------------------------------------------------------ README
function projectCell(p) {
  const main = p.demo || p.repo;
  const links = [];
  if (p.demo) links.push(`<a href="${e(p.demo)}">Live site ↗</a>`);
  if (p.repo) links.push(`<a href="${e(p.repo)}">Code ↗</a>`);
  return `<td width="50%" valign="top">
<a href="${e(main)}"><img src="${e(p.img)}" alt="${e(p.alt)}" width="100%"></a>
<h3>${e(p.title)}</h3>
<sub>${e(p.kind.toUpperCase())}</sub>
<p>${e(p.desc)}</p>
<p><sub>${e(p.stack.join(' · '))}</sub></p>
<p>${links.join(' · ')}</p>
</td>`;
}

function readme() {
  const out = [];
  const rows = [];
  for (let i = 0; i < CONFIG.projects.length; i += 2) {
    rows.push(`<tr>\n${CONFIG.projects.slice(i, i + 2).map(projectCell).join('\n')}\n</tr>`);
  }
  out.push('<!-- Generated by scripts/build.mjs. Edit CONFIG there and re-run instead of editing this file. -->');
  out.push(`<a href="${PORTFOLIO_URL}">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="assets/hero-dark.svg">
    <img src="assets/hero.svg" width="100%" alt="${e(`${CONFIG.name}: ${CONFIG.headline.join(' ')} ${CONFIG.role} at ${CONFIG.company}. Open to freelance projects.`)}">
  </picture>
</a>`);
  out.push(`**${e(CONFIG.role)} at ${e(CONFIG.company)}.** ${e(CONFIG.intro)}`);
  out.push(`[Portfolio](${PORTFOLIO_URL}) · [Email](mailto:${CONFIG.email}) · Open to freelance projects`);
  out.push(`## Selected work\n\nWorking demos for the kinds of businesses I build for, plus my own finance app. [Watch them run on my portfolio →](${PORTFOLIO_URL}#work)`);
  out.push(`<table>\n${rows.join('\n')}\n</table>`);
  out.push(`<sub>Earlier work, data analytics in Tableau: ${CONFIG.earlier.map((x) => `[${x.name}](${x.repo})`).join(' · ')}</sub>`);
  out.push(`## Stack\n\n${CONFIG.stack.map(([k, v]) => `**${k}:** ${v}`).join('  \n')}`);
  out.push(`## Contributions

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/${CONFIG.user}/${CONFIG.user}/output/github-contribution-grid-snake-dark.svg">
  <img src="https://raw.githubusercontent.com/${CONFIG.user}/${CONFIG.user}/output/github-contribution-grid-snake.svg" width="100%" alt="A snake eating my GitHub contributions from the past year, redrawn every 12 hours.">
</picture>`);
  out.push(`<sub>Have a project in mind? [Email me](mailto:${CONFIG.email}). I reply within 24 hours.</sub>`);
  return out.join('\n\n') + '\n';
}

// A local preview that mimics GitHub's profile page in your system theme (not committed)
function preview(md) {
  const html = md
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/^## (.*)$/gm, '<h2>$1</h2>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/ {2}\n/g, '<br>\n')
    .split(/\n{2,}/).map((b) => (/^\s*</.test(b) ? b : `<p>${b}</p>`)).join('\n');
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Profile README preview</title>
<style>:root{color-scheme:light dark;--bg:#fff;--fg:#1f2328;--muted:#59636e;--line:#d1d9e0;--link:#0969da}
@media (prefers-color-scheme:dark){:root{--bg:#0d1117;--fg:#e6edf3;--muted:#9198a1;--line:#30363d;--link:#4493f8}}
body{margin:0;background:var(--bg);color:var(--fg);font:16px/1.5 -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif}
article{max-width:838px;margin:24px auto 64px;padding:24px;border:1px solid var(--line);border-radius:6px;box-sizing:border-box}
article img{max-width:100%}h2{font-size:1.5em;border-bottom:1px solid var(--line);padding-bottom:.3em;margin:24px 0 16px}
h3{margin:12px 0 0}p{margin:0 0 16px}table{border-collapse:collapse;width:100%;margin-bottom:16px}td{border:1px solid var(--line);padding:6px 13px}
sub{color:var(--muted)}a{color:var(--link);text-decoration:none}</style></head>
<body><article>${html}</article></body></html>`;
}

// ------------------------------------------------------------------ Build
mkdirSync(ASSETS, { recursive: true });
writeFileSync(join(ASSETS, 'hero.svg'), banner('light'));
writeFileSync(join(ASSETS, 'hero-dark.svg'), banner('dark'));
const md = readme();
writeFileSync(join(ROOT, 'README.md'), md);
writeFileSync(join(ROOT, 'preview.html'), preview(md));

// Publish the portfolio page to site/ for GitHub Pages (skipped in CI, where ../portfolio doesn't exist)
mkdirSync(join(ROOT, 'site'), { recursive: true });
writeFileSync(join(ROOT, 'site', '.nojekyll'), '');
if (existsSync(CONFIG.portfolioSource)) {
  const from = dirname(CONFIG.portfolioSource);
  copyFileSync(CONFIG.portfolioSource, join(ROOT, 'site', 'index.html'));
  for (const f of ['main.js', 'og.jpg']) { // the page's script and its link-preview image
    if (existsSync(join(from, f))) copyFileSync(join(from, f), join(ROOT, 'site', f));
  }
  for (const dir of ['img', 'video']) { // project screenshots and screen recordings; each replaced as a whole
    if (!existsSync(join(from, dir))) continue;
    rmSync(join(ROOT, 'site', dir), { recursive: true, force: true });
    cpSync(join(from, dir), join(ROOT, 'site', dir), { recursive: true });
  }
} else console.warn(`! Portfolio not found at ${CONFIG.portfolioSource}; site/ left as is.`);

console.log('Built README.md, preview.html, assets/hero.svg, assets/hero-dark.svg and site/.');
