#!/usr/bin/env node
/**
 * Builds the GitHub profile README for github.com/bhargavang (plus its light and dark images)
 * and copies the portfolio site into site/ for GitHub Pages.
 *
 *   node scripts/build.mjs
 *
 * To change anything (role, wording, projects, tools), edit CONFIG below and re-run.
 * Don't edit README.md or assets/*.svg by hand; they are overwritten on every build
 * (the daily "Refresh profile stats" workflow runs this script too).
 * Colours match the portfolio: navy text, a brown accent and a latte monogram.
 */
import { copyFileSync, cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const ASSETS = join(ROOT, 'assets');
const ICONS = JSON.parse(readFileSync(join(ROOT, 'scripts', 'icons.json'), 'utf8')); // Simple Icons paths (CC0)

// ------------------------------------------------------------------ CONFIG
const CONFIG = {
  user: 'bhargavang',
  name: 'Bhargav Angadi',
  monogram: 'BA',
  email: 'bhargav.angadi@gmail.com',
  role: 'Associate Software Engineer',
  company: 'Torry Harris Business Solutions',
  tagline: 'Java & Spring Boot backends · websites for small businesses',
  // Runs round the monogram; keep the trailing separator so the ends meet.
  ring: 'SOFTWARE ENGINEER · INDIA · OPEN TO FREELANCE · ',
  // The portfolio page that gets published to GitHub Pages from site/
  portfolioSource: join(ROOT, '..', 'portfolio', 'index.html'),

  projects: [
    { title: 'Saffron Table', repo: 'https://github.com/bhargavang/saffron-table' },
    { title: 'CareDesk', repo: 'https://github.com/bhargavang/caredesk' },
    { title: 'Kora Threads', repo: 'https://github.com/bhargavang/kora-threads-theme' },
    { title: 'BudgetX', repo: 'https://github.com/bhargavang/Budgetx' },
  ],

  // Keys in scripts/icons.json, shown left to right in one row
  tools: ['openjdk', 'springboot', 'react', 'nextdotjs', 'typescript', 'postgresql', 'redis', 'apachekafka',
    'docker', 'githubactions', 'shopify', 'tailwindcss', 'mysql', 'nodedotjs', 'git', 'vercel'],

  // Pill buttons at the end. Widths fit the labels at 19px; widen them if you change a label.
  buttons: [
    { file: 'button-email', label: 'Email me  →', alt: 'Email me', width: 168, solid: true },
    { file: 'button-portfolio', label: 'See my portfolio ↗', alt: 'See my portfolio', width: 208, solid: false },
  ],
};

const PORTFOLIO_URL = `https://${CONFIG.user}.github.io/${CONFIG.user}/`;
const MAIL = `mailto:${CONFIG.email}`;
CONFIG.buttons[0].link = MAIL;
CONFIG.buttons[1].link = PORTFOLIO_URL;

// ------------------------------------------------------------------ Design tokens (same as the portfolio)
// The images sit on GitHub's own white or near-black page, so each gets a light and a dark version.
const THEMES = {
  light: { ink: '#22314f', muted: '#5f6577', accent: '#8b5e3c', line: '#dccfbd', navy: '#22314f', on: '#efe7dc', chip: '#f9f5ef' },
  dark: { ink: '#efe7dc', muted: '#a9adba', accent: '#d9a77c', line: '#3d444d', navy: '#273150', on: '#efe7dc', chip: '#161c2b' },
};
const SERIF = `'EB Garamond','Iowan Old Style','Palatino Linotype',Palatino,'Book Antiqua',Georgia,serif`;
const SANS = `'Figtree',-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif`;

const e = (s) => String(s).replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));

// Every animation stops for visitors who turn on "reduce motion"; the still frame is the finished design.
const svg = (W, H, label, body, style = '') => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${e(label)}">
<style>.serif{font-family:${SERIF}}.sans{font-family:${SANS}}
${style}
@media (prefers-reduced-motion:reduce){*{animation:none!important}}</style>
${body}
</svg>
`;

// ------------------------------------------------------------------ Header: monogram seal + name
function header(mode) {
  const c = THEMES[mode];
  const cx = 168, cy = 160, r = 116;
  const [first, ...rest] = CONFIG.name.split(' ');
  const body = `<defs><path id="ring" d="M${cx - r} ${cy} a${r} ${r} 0 1 1 ${2 * r} 0 a${r} ${r} 0 1 1 -${2 * r} 0"/></defs>
<circle cx="${cx}" cy="${cy}" r="146" fill="none" stroke="${c.line}" stroke-width="1.5"/>
<g class="rot"><text class="sans" font-size="16.5" font-weight="600" letter-spacing="2.6" fill="${c.muted}"><textPath href="#ring" textLength="${Math.round(2 * Math.PI * r - 6)}" lengthAdjust="spacing">${e(CONFIG.ring)}</textPath></text></g>
<circle cx="${cx}" cy="${cy}" r="88" fill="${c.navy}"/>
<text x="${cx}" y="${cy + 26}" class="serif" font-size="74" font-style="italic" fill="${c.on}" text-anchor="middle">${e(CONFIG.monogram)}</text>
<text x="356" y="164" class="serif" font-size="90" letter-spacing="-2" fill="${c.ink}">${e(first)} <tspan font-style="italic" fill="${c.accent}">${e(rest.join(' '))}</tspan></text>
<text x="360" y="220" class="sans" font-size="24" fill="${c.muted}">${e(CONFIG.tagline)}</text>`;
  const style = `.rot{transform-box:view-box;transform-origin:${cx}px ${cy}px;animation:rot 48s linear infinite}@keyframes rot{to{transform:rotate(360deg)}}`;
  return svg(1200, 320, `${CONFIG.name}. Software engineer in India, open to freelance projects. ${CONFIG.tagline.replace('&', 'and')}.`, body, style);
}

// ------------------------------------------------------------------ Tools: one small image per logo
// Separate images so each one can carry its own name, which browsers show on hover.
// The 24×24 logo sits in a 38×24 box; the side padding is the gap between logos.
function tool(key, mode) {
  return svg(38, 24, ICONS[key].title, `<path transform="translate(7 0)" d="${ICONS[key].d}" fill="${THEMES[mode].ink}"/>`);
}

// ------------------------------------------------------------------ Buttons
function button(b, mode) {
  const c = THEMES[mode], H = 50;
  const [fill, ink, stroke] = b.solid ? [c.navy, c.on, c.navy] : [c.chip, c.ink, c.line];
  return svg(b.width, H, b.alt, `<rect x="1" y="1" width="${b.width - 2}" height="${H - 2}" rx="25" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/>
<text x="26" y="32" class="sans" font-size="19" font-weight="600" fill="${ink}">${e(b.label)}</text>`);
}

// ------------------------------------------------------------------ README
const picture = (base, alt, width = '100%') =>
  `<picture><source media="(prefers-color-scheme: dark)" srcset="assets/${base}-dark.svg"><img src="assets/${base}.svg"${width ? ` width="${width}"` : ''} alt="${e(alt)}"></picture>`;
const toolIcon = (k) =>
  `<picture><source media="(prefers-color-scheme: dark)" srcset="assets/tool-${k}-dark.svg"><img src="assets/tool-${k}.svg" height="22" alt="${e(ICONS[k].title)}" title="${e(ICONS[k].title)}"></picture>`;
const buttonLink = (b) =>
  `<a href="${b.link}"><picture><source media="(prefers-color-scheme: dark)" srcset="assets/${b.file}-dark.svg"><img src="assets/${b.file}.svg" height="44" alt="${e(b.alt)}"></picture></a>`;

function readme() {
  const lately = CONFIG.projects.map((p) => `<a href="${e(p.repo)}">${e(p.title)}</a>`).join(' · ');
  return `<!-- Generated by scripts/build.mjs. Edit CONFIG there and re-run instead of editing this file. -->

${picture('header', `${CONFIG.name}. Software engineer in India, open to freelance projects.`)}

- I’m an **${e(CONFIG.role)}** at ${e(CONFIG.company)}, building Java and Spring Boot backends and REST APIs.
- On the side I build **websites, booking systems and online stores** for small businesses.
- Lately: ${lately}.

<p>${CONFIG.tools.map(toolIcon).join('')}</p>

<br>

<p align="center"><b>Have a project in mind?</b></p>
<p align="center">${CONFIG.buttons.map(buttonLink).join('&nbsp;&nbsp;')}</p>
`;
}

// A rough local preview in your system theme (not committed). For the exact look, push and check GitHub.
function preview(md) {
  const inline = (s) => s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  const html = md
    .replace(/<!--[\s\S]*?-->/g, '')
    .split(/\n{2,}/).map((b) => b.trim()).filter(Boolean)
    .map((b) => (/^- /.test(b) ? `<ul>${b.split('\n').map((l) => `<li>${inline(l.slice(2))}</li>`).join('')}</ul>` : /^</.test(b) ? b : `<p>${inline(b)}</p>`))
    .join('\n');
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Profile README preview</title>
<style>:root{color-scheme:light dark;--bg:#fff;--fg:#1f2328;--line:#d1d9e0;--link:#0969da}
@media (prefers-color-scheme:dark){:root{--bg:#0d1117;--fg:#e6edf3;--line:#30363d;--link:#4493f8}}
body{margin:0;background:var(--bg);color:var(--fg);font:16px/1.5 -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif}
article{max-width:838px;margin:24px auto 64px;padding:24px;border:1px solid var(--line);border-radius:6px;box-sizing:border-box}
article img{max-width:100%;vertical-align:middle}p{margin:0 0 16px}ul{margin:0 0 16px;padding-left:2em}a{color:var(--link);text-decoration:none}</style></head>
<body><article>${html}</article></body></html>`;
}

// ------------------------------------------------------------------ Build
mkdirSync(ASSETS, { recursive: true });
for (const mode of ['light', 'dark']) {
  const suffix = mode === 'dark' ? '-dark' : '';
  writeFileSync(join(ASSETS, `header${suffix}.svg`), header(mode));
  for (const k of CONFIG.tools) writeFileSync(join(ASSETS, `tool-${k}${suffix}.svg`), tool(k, mode));
  for (const b of CONFIG.buttons) writeFileSync(join(ASSETS, `${b.file}${suffix}.svg`), button(b, mode));
}
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

console.log('Built README.md, preview.html, assets/*.svg and site/.');
