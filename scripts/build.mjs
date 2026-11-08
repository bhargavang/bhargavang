#!/usr/bin/env node
/**
 * Builds the GitHub profile README for github.com/bhargavang, its animated SVG cards,
 * and copies the portfolio site into site/ for GitHub Pages.
 *
 *   node scripts/build.mjs
 *
 * To change anything (projects, links, wording), edit CONFIG below and re-run.
 * Don't edit README.md or assets/*.svg by hand; they are overwritten on every build.
 */
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const ASSETS = join(ROOT, 'assets');

// ------------------------------------------------------------------ CONFIG
const CONFIG = {
  user: 'bhargavang',
  first: 'Bhargav',
  last: 'Angadi',
  email: 'bhargav.angadi@gmail.com',
  whatsapp: '917411946909',
  phone: '+91 74119 46909',
  linkedin: 'https://www.linkedin.com/in/basavarajangadi/',
  linkedinHandle: 'basavarajangadi',
  // The portfolio page that gets published to GitHub Pages from site/
  portfolioSource: join(ROOT, '..', 'portfolio', 'index.html'),

  projects: [
    {
      slug: 'budgetx', diagram: 'micro', status: 'Core services done',
      kicker: '01 · Microservices · Fintech · 2026',
      title: 'BudgetX', subtitle: 'AI-powered personal finance manager',
      desc: "Track salary, EMIs and expenses, see what's safe to invest, and get AI guidance checked against safety rules. Spring Boot microservices behind an API gateway, plus an installable React app.",
      highlights: [['5 of 8', 'services built, behind one gateway'], ['20/s', 'per-user rate limit with Redis'], ['15 min', 'JWT access tokens, 7-day refresh']],
      stack: ['Java 17', 'Spring Boot', 'Spring Cloud', 'Kafka', 'Redis', 'MySQL', 'Docker', 'React'],
      repo: 'https://github.com/bhargavang/Budgetx', demo: '',
      fig: 'FIG. 02 · SERVICE MAP',
      screenshots: [
        ['https://raw.githubusercontent.com/bhargavang/Budgetx/main/docs/screenshots/ui-refresh/after-dark-desktop-home.png', 'BudgetX dashboard on desktop', '72%'],
        ['https://raw.githubusercontent.com/bhargavang/Budgetx/main/docs/screenshots/ui-refresh/after-dark-mobile-today.png', 'BudgetX Today screen on a phone', '22%'],
      ],
    },
    {
      slug: 'saffron-table', diagram: 'booking', status: 'In progress',
      kicker: '02 · Business website · Restaurants · 2026',
      title: 'Saffron Table', subtitle: 'restaurant website + online booking',
      desc: 'Many restaurants still take bookings by phone, and their sites are slow on mobile. A fast, mobile-first site with menu, gallery and maps, plus a booking form that emails both guest and owner.',
      highlights: [['24/7', 'online booking'], ['2×', 'confirmation emails per booking'], ['1 file', 'rebrands it for any restaurant']],
      stack: ['Next.js', 'TypeScript', 'Tailwind', 'Node.js', 'PostgreSQL'],
      repo: '', demo: '', fig: 'FIG. 03 · BOOKING FLOW',
    },
    {
      slug: 'kora-threads', diagram: 'store', status: 'In progress',
      kicker: '03 · Online store · Small brands · 2026',
      title: 'Kora Threads', subtitle: 'Shopify store for a handmade clothing brand',
      desc: 'Small brands often sell only through Instagram DMs and track every order by hand. A customised Shopify store with filters, size guide, discount codes and an "Order on WhatsApp" button.',
      highlights: [['1-tap', 'order on WhatsApp'], ['S–XXL', 'size guide pop-up'], ['Liquid', 'custom theme sections']],
      stack: ['Shopify', 'Liquid', 'JavaScript', 'CSS'],
      repo: '', demo: '', fig: 'FIG. 04 · ORDER ON WHATSAPP',
    },
    {
      slug: 'caredesk', diagram: 'slots', status: 'In progress',
      kicker: '04 · Web app + API · Clinics & salons · 2026',
      title: 'CareDesk', subtitle: 'appointment booking system',
      desc: 'Clinics and salons juggle appointments in notebooks and phone calls, which leads to double bookings. Customers book a free slot online; staff run the day from a secure dashboard on a Java REST API.',
      highlights: [['0', 'double bookings, DB-enforced'], ['24h', 'reminder before each visit'], ['JWT', 'secured staff dashboard']],
      stack: ['Java', 'Spring Boot', 'React', 'PostgreSQL', 'Docker'],
      repo: '', demo: '', fig: 'FIG. 05 · SLOT BOOKING',
    },
  ],

  earlier: [
    { name: 'Road Accident Analytics', tool: 'Tableau', repo: 'https://github.com/bhargavang/Road-Accident-Analytics' },
    { name: 'HR Analytics', tool: 'Tableau', repo: 'https://github.com/bhargavang/HR-DATA-ANALYTICS' },
  ],

  services: [
    { title: 'Business websites', lines: ['Fast, mobile-friendly sites that show up on', 'Google and turn visitors into bookings.'], forWho: 'shops, clinics, restaurants', icon: 'monitor' },
    { title: 'Online stores', lines: ['Shopify or WooCommerce stores, set up and', 'ready to take payments.'], forWho: 'Instagram & WhatsApp sellers', icon: 'bag' },
    { title: 'Web apps & APIs', lines: ['Dashboards, booking systems and portals on', 'a solid Java or Node.js backend.'], forWho: 'startups & growing teams', icon: 'db' },
    { title: 'Fixes & speed-ups', lines: ['Broken, slow or outdated site? Fixed fast,', 'then kept updated and secure.'], forWho: 'any existing website', icon: 'wrench' },
  ],

  toolkit: [
    { title: 'Backend', items: [['Java', 1], ['Spring Boot', 1], 'Spring Cloud', 'REST APIs', 'Node.js', 'Express'], why: 'Clear service boundaries, honest APIs.' },
    { title: 'Frontend', items: [['React', 1], ['Next.js', 1], 'TypeScript', 'JavaScript', 'HTML & CSS', 'Tailwind'], why: 'Interfaces that feel fast on any phone.' },
    { title: 'Data & messaging', items: [['MySQL', 1], ['Redis', 1], 'Kafka', 'PostgreSQL', 'MongoDB', 'SQL'], why: 'Model the data first; endpoints follow.' },
    { title: 'DevOps & tools', items: [['Docker', 1], ['Git & GitHub', 1], 'Maven', 'Vercel', 'Netlify'], why: 'Same on my laptop and in production.' },
    { title: 'Stores & CMS', items: [['Shopify', 1], 'WordPress', 'WooCommerce', 'Stripe'], why: 'Stores clients can run themselves.' },
    { title: 'Where I started', items: ['Python', 'Tableau', 'Power BI', 'Excel'], why: 'Turning raw data into dashboards.' },
  ],
};

const PORTFOLIO_URL = `https://${CONFIG.user}.github.io/${CONFIG.user}/`;
const WHATSAPP_URL = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent("Hi Bhargav, I saw your GitHub profile and I'd like to talk.")}`;

// ------------------------------------------------------------------ Design tokens
const P = {
  bg: '#0b0c0e', panel: '#0f1013', line: '#22252b', line2: '#2f333b',
  text: '#ece8e1', muted: '#a4a29c', dim: '#6f6f72',
  gold: '#c8a465', gold2: '#e3c78f', steel: '#8a9bb0', ok: '#5fd38d',
};
const SERIF = `'Iowan Old Style','Palatino Linotype',Palatino,'Book Antiqua',Georgia,'Times New Roman',serif`;
const SANS = `-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif`;
const MONO = `ui-monospace,SFMono-Regular,Menlo,Consolas,'Liberation Mono',monospace`;

const BASE_CSS = [
  `.serif{font-family:${SERIF}}.sans{font-family:${SANS}}.mono{font-family:${MONO}}`,
  '.in{animation:in 1s cubic-bezier(.16,1,.3,1) both}',
  [1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => `.d${i}{animation-delay:${(i * 0.12).toFixed(2)}s}`).join(''),
  '@keyframes in{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}',
  '.pulse{animation:pulse 2s ease-in-out infinite}@keyframes pulse{50%{opacity:.3}}',
  '@media (prefers-reduced-motion:reduce){*{animation:none!important}}',
].join('\n');

// ------------------------------------------------------------------ Helpers
const e = (s) => String(s).replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));

function rng(seed) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mix = (a, b, k) => '#' + rgb(a).map((v, i) => Math.round(v + (rgb(b)[i] - v) * k).toString(16).padStart(2, '0')).join('');

function t(x, y, content, o = {}) {
  const a = [`x="${x}"`, `y="${y}"`, `class="${o.cls || 'sans'}"`, `font-size="${o.size || 14}"`, `fill="${o.fill || P.text}"`];
  if (o.weight) a.push(`font-weight="${o.weight}"`);
  if (o.italic) a.push('font-style="italic"');
  if (o.anchor) a.push(`text-anchor="${o.anchor}"`);
  if (o.ls != null) a.push(`letter-spacing="${o.ls}"`);
  return `<text ${a.join(' ')}>${content}</text>`;
}

function wrap(str, max) {
  const words = str.split(' '), lines = [];
  let cur = '';
  for (const w of words) {
    if ((cur + ' ' + w).trim().length > max) { lines.push(cur.trim()); cur = w; } else cur += ' ' + w;
  }
  if (cur.trim()) lines.push(cur.trim());
  return lines;
}

function svgDoc(w, h, label, defs, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${e(label)}">
<defs>
<linearGradient id="card" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#131418"/><stop offset="1" stop-color="${P.bg}"/></linearGradient>
<pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse"><path d="M48 0H0V48" fill="none" stroke="#ffffff" stroke-opacity=".035"/></pattern>
${defs}
</defs>
<style>${BASE_CSS}</style>
${body}
</svg>
`;
}
const frame = (w, h, r = 22) =>
  `<rect x=".5" y=".5" width="${w - 1}" height="${h - 1}" rx="${r}" fill="url(#card)" stroke="${P.line}"/>` +
  `<rect x=".5" y=".5" width="${w - 1}" height="${h - 1}" rx="${r}" fill="url(#grid)"/>`;

function chipFlow(x0, y0, maxW, items, o = {}) {
  const size = o.size || 13.5, font = o.font || 'sans', h = o.h || 30, gap = o.gap || 8;
  const cw = font === 'mono' ? 0.62 : 0.56;
  let x = x0, y = y0, out = '';
  for (const it of items) {
    const [label, key] = Array.isArray(it) ? it : [it, 0];
    const w = Math.round(label.length * size * cw + 24);
    if (x + w > x0 + maxW) { x = x0; y += h + gap; }
    out += `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" fill="${key ? 'rgba(200,164,101,.08)' : 'rgba(255,255,255,.02)'}" stroke="${key ? 'rgba(200,164,101,.5)' : P.line2}"/>`;
    out += t(x + w / 2, (y + h / 2 + size * 0.36).toFixed(1), e(label), { cls: font, size, fill: key ? P.gold2 : (o.color || P.text), anchor: 'middle' });
    x += w + gap;
  }
  return out;
}

const ICONS = {
  monitor: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>',
  bag: '<path d="M6 7h12l-1 13H7L6 7z"/><path d="M9 7a3 3 0 0 1 6 0"/>',
  db: '<ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6"/><path d="M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6"/>',
  wrench: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4 2.5-2.5z"/>',
};

// ------------------------------------------------------------------ Shared art: Bhargav's avatar in an arch
// A flat, illustrated version of the Memoji-style 3D avatar on the website.
const AV = {
  skinHi: '#f8dcc6', skin: '#f0c3a0', skinLo: '#d6a07c', blush: '#f09a86',
  hair: '#1c1410', hairHi: '#4a3c33', beard: '#2a1f19',
  tee: '#f6f4f0', teeRib: '#e7e3dc', jacketHi: '#373b44', jacketLo: '#1d2025', jacketRib: '#3a3e46',
};

function figureDefs() {
  return `
<radialGradient id="skin" cx=".42" cy=".34" r=".78"><stop offset="0" stop-color="${AV.skinHi}"/><stop offset=".62" stop-color="${AV.skin}"/><stop offset="1" stop-color="${AV.skinLo}"/></radialGradient>
<linearGradient id="jacket" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${AV.jacketHi}"/><stop offset="1" stop-color="${AV.jacketLo}"/></linearGradient>
<linearGradient id="neckShade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${AV.skinLo}"/><stop offset=".55" stop-color="${AV.skin}"/></linearGradient>
<radialGradient id="hairGloss" cx=".45" cy=".2" r=".7"><stop offset="0" stop-color="${AV.hairHi}"/><stop offset=".55" stop-color="${AV.hair}"/></radialGradient>
<radialGradient id="archBg" cx="930" cy="200" r="260" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#2a2419"/><stop offset=".55" stop-color="#141416"/><stop offset="1" stop-color="#0c0d0f"/></radialGradient>
<radialGradient id="glow" cx="930" cy="250" r="300" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${P.gold}" stop-opacity=".16"/><stop offset="1" stop-color="${P.gold}" stop-opacity="0"/></radialGradient>
<clipPath id="archClip"><path d="M822 450 Q800 450 800 428 V176 A130 130 0 0 1 1060 176 V428 Q1060 450 1038 450 Z"/></clipPath>`;
}

// Memoji-style avatar: big round head, expressive eyes that blink, glossy wavy hair,
// trimmed beard, gold glasses, white tee under a charcoal bomber jacket.
function avatarArt() {
  const G = P.gold;
  const glance = `<animateTransform attributeName="transform" type="translate" values="0 0;0 0;3 1;3 1;0 0;0 0;-3 1;-3 1;0 0" keyTimes="0;.18;.24;.36;.42;.6;.66;.78;1" dur="9s" repeatCount="indefinite"/>`;
  const eye = (cx) => {
    const a = cx - 15, b = cx + 15;
    const lidOpen = `M${a} 189 Q${cx} 174 ${b} 189 L${b} 172 L${a} 172 Z`, lidShut = `M${a} 189 Q${cx} 206 ${b} 189 L${b} 172 L${a} 172 Z`;
    const lashOpen = `M${a} 189 Q${cx} 174 ${b} 189`, lashShut = `M${a} 189 Q${cx} 206 ${b} 189`;
    const blink = (o, s) => `<animate attributeName="d" values="${o};${o};${s};${o}" keyTimes="0;.94;.97;1" dur="5s" repeatCount="indefinite"/>`;
    return `
      <ellipse cx="${cx}" cy="193" rx="14.5" ry="13.5" fill="#fbfaf8"/>
      <g>${glance}<circle cx="${cx + 1}" cy="194" r="9" fill="#5b3a22"/><circle cx="${cx + 1}" cy="194" r="4.6" fill="#0b0807"/><circle cx="${cx + 4}" cy="190" r="2.6" fill="#fff"/><circle cx="${cx - 2}" cy="198" r="1.2" fill="#fff"/></g>
      <path d="${lidOpen}" fill="${AV.skin}">${blink(lidOpen, lidShut)}</path>
      <path d="${lashOpen}" fill="none" stroke="#15100c" stroke-width="2.8" stroke-linecap="round">${blink(lashOpen, lashShut)}</path>`;
  };
  return `
  <g>
    <animateTransform attributeName="transform" type="translate" values="0 0;0 -2.5;0 0" dur="5s" repeatCount="indefinite"/>
    <!-- white tee under an open charcoal bomber jacket -->
    <path d="M884 330 L896 460 L964 460 L976 330 Q930 346 884 330 Z" fill="${AV.tee}"/>
    <rect x="910" y="268" width="40" height="52" rx="15" fill="url(#neckShade)"/>
    <path d="M904 322 Q930 338 956 322" fill="none" stroke="${AV.teeRib}" stroke-width="5" stroke-linecap="round"/>
    <path d="M818 460 L818 392 Q822 344 868 328 Q886 321 904 320 L914 332 L900 460 Z" fill="url(#jacket)"/>
    <path d="M1042 460 L1042 392 Q1038 344 992 328 Q974 321 956 320 L946 332 L960 460 Z" fill="url(#jacket)"/>
    <path d="M880 330 Q930 302 980 330" fill="none" stroke="${AV.jacketRib}" stroke-width="13" stroke-linecap="round"/>
    <g stroke="${G}" stroke-width="2" stroke-linecap="round"><path d="M914 333 L900 460"/><path d="M946 333 L960 460"/></g>
    <circle cx="1000" cy="372" r="6" fill="none" stroke="${G}" stroke-width="2"/>
    <!-- head: nods now and then -->
    <g>
      <animateTransform attributeName="transform" type="rotate" values="0 930 280;0 930 280;5 930 280;-2 930 280;0 930 280" keyTimes="0;.62;.72;.84;1" dur="7s" repeatCount="indefinite"/>
      <ellipse cx="854" cy="196" rx="10" ry="18" fill="${AV.skin}"/><ellipse cx="1006" cy="196" rx="10" ry="18" fill="${AV.skin}"/>
      <path d="M856 190 Q856 112 930 110 Q1004 112 1004 190 Q1004 246 984 268 Q962 292 930 292 Q898 292 876 268 Q856 246 856 190 Z" fill="url(#skin)"/>
      <ellipse cx="882" cy="222" rx="14" ry="8" fill="${AV.blush}" opacity=".22"/><ellipse cx="978" cy="222" rx="14" ry="8" fill="${AV.blush}" opacity=".22"/>
      <!-- trimmed beard following the jaw, and moustache -->
      <path d="M858 200 Q860 248 878 270 Q902 297 930 297 Q958 297 982 270 Q1000 248 1002 200 Q998 232 988 246 Q974 262 958 258 Q946 271 930 271 Q914 271 902 258 Q886 262 872 246 Q862 232 858 200 Z" fill="${AV.beard}" opacity=".72"/>
      <path d="M909 236 Q920 227 930 232 Q940 227 951 236 Q940 242 930 239 Q920 242 909 236 Z" fill="${AV.beard}" opacity=".92"/>
      <!-- friendly smile -->
      <path d="M908 244 Q930 268 952 244 Q930 252 908 244 Z" fill="#5a2320"/>
      <path d="M913 246.5 Q930 254 947 246.5 L944.5 251 Q930 257 915.5 251 Z" fill="#fbf8f2"/>
      <path d="M917 260 Q930 266 943 260 Q930 263 917 260 Z" fill="#d98d7f"/>
      <!-- small rounded nose -->
      <ellipse cx="930" cy="219" rx="10" ry="8" fill="${AV.skinLo}" opacity=".45"/>
      <ellipse cx="928" cy="216" rx="4" ry="3" fill="#fff" opacity=".35"/>
      ${eye(902)}${eye(958)}
      <!-- soft, thick eyebrows -->
      <path d="M884 166 Q900 157 916 162" fill="none" stroke="${AV.hair}" stroke-width="7" stroke-linecap="round"/>
      <path d="M944 162 Q960 157 976 166" fill="none" stroke="${AV.hair}" stroke-width="7" stroke-linecap="round"/>
      <!-- gold round glasses -->
      <g fill="none" stroke="${G}" stroke-width="2.6">
        <ellipse cx="902" cy="193" rx="21" ry="19.5" fill="#ffffff" fill-opacity=".06"/><ellipse cx="958" cy="193" rx="21" ry="19.5" fill="#ffffff" fill-opacity=".06"/>
        <path d="M923 190 Q930 184 937 190"/><path d="M881 190 L857 186"/><path d="M979 190 L1003 186"/>
      </g>
      <!-- glossy, sculpted wavy hair -->
      <g fill="url(#hairGloss)">
        <path d="M852 204 Q846 140 870 114 Q898 86 930 88 Q966 86 992 112 Q1014 140 1008 204 Q1000 172 992 160 Q980 140 964 140 Q950 150 932 142 Q914 152 898 142 Q880 144 868 160 Q858 176 852 204 Z"/>
        <ellipse cx="888" cy="112" rx="30" ry="22" transform="rotate(-20 888 112)"/>
        <ellipse cx="930" cy="96" rx="36" ry="22"/>
        <ellipse cx="972" cy="110" rx="30" ry="22" transform="rotate(20 972 110)"/>
        <ellipse cx="912" cy="128" rx="28" ry="14" transform="rotate(-10 912 128)"/>
        <ellipse cx="950" cy="126" rx="26" ry="13" transform="rotate(8 950 126)"/>
        <rect x="851" y="168" width="10" height="34" rx="5"/><rect x="999" y="168" width="10" height="34" rx="5"/>
      </g>
      <g fill="none" stroke="${AV.hairHi}" stroke-width="2.4" stroke-linecap="round" opacity=".8">
        <path d="M872 112 Q884 100 900 104"/><path d="M910 90 Q926 82 944 86"/><path d="M958 98 Q972 96 984 106"/><path d="M900 128 Q912 122 926 126"/>
      </g>
    </g>
  </g>`;
}

// Your real avatar image (small WebP with a transparent background), embedded in the hero
// card so it shows on GitHub. If the file is missing, the drawn avatar is used instead.
const AVATAR_PHOTO = join(ROOT, 'assets', 'avatar-photo.webp');
function avatarPhoto() {
  if (!existsSync(AVATAR_PHOTO)) return null;
  const b64 = readFileSync(AVATAR_PHOTO).toString('base64');
  return `
  <g>
    <animateTransform attributeName="transform" type="translate" values="0 0;0 -3;0 0" dur="5s" repeatCount="indefinite"/>
    <image href="data:image/webp;base64,${b64}" x="784" y="160" width="292" height="292" preserveAspectRatio="xMidYMax meet"/>
  </g>`;
}

function figureArt() {
  const photo = avatarPhoto();
  const cx = 930, cy = photo ? 262 : 200;
  const r = rng(11);
  let halo = '';
  for (let i = 0; i < 460; i++) {
    const rr = 74 + Math.pow(r(), 0.8) * 70;
    const a = ((i % 3) / 3) * Math.PI * 2 + rr / 40 + (r() - 0.5) * 0.5;
    const k = (rr - 74) / 70;
    halo += `<circle cx="${(cx + Math.cos(a) * rr).toFixed(1)}" cy="${(cy + Math.sin(a) * rr).toFixed(1)}" r="${(0.6 + r() * 1.3).toFixed(2)}" fill="${mix(P.gold2, '#5d6f86', k)}" opacity="${(0.4 + r() * 0.6).toFixed(2)}"/>`;
  }
  let dust = '';
  for (let i = 0; i < 40; i++) {
    const x = 806 + r() * 248, y = 60 + r() * 380, d = (4 + r() * 6).toFixed(1);
    dust += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(0.5 + r() * 0.9).toFixed(2)}" fill="${P.gold2}" opacity=".5"><animate attributeName="cy" values="${y.toFixed(1)};${(y - 40).toFixed(1)}" dur="${d}s" repeatCount="indefinite"/><animate attributeName="opacity" values="0;.6;0" dur="${d}s" repeatCount="indefinite"/></circle>`;
  }
  return `
<circle cx="930" cy="250" r="300" fill="url(#glow)"/>
<g fill="none">
  <circle cx="930" cy="248" r="232" stroke="${P.line}"/>
  <circle cx="930" cy="248" r="200" stroke="#1b1d22"/>
  <circle cx="930" cy="248" r="216" stroke="${P.gold}" stroke-opacity=".45" stroke-dasharray="1 9"><animateTransform attributeName="transform" type="rotate" from="0 930 248" to="360 930 248" dur="80s" repeatCount="indefinite"/></circle>
</g>
<g class="mono" font-size="10" letter-spacing="2" fill="${P.dim}"><text x="1086" y="70">UI</text><text x="1150" y="300">API</text><text x="712" y="352">DB</text><text x="728" y="96">CI</text></g>
<g clip-path="url(#archClip)">
  <rect x="800" y="40" width="260" height="420" fill="url(#archBg)"/>
  <g><animateTransform attributeName="transform" type="rotate" from="0 ${cx} ${cy}" to="-360 ${cx} ${cy}" dur="120s" repeatCount="indefinite"/>${halo}</g>
  ${dust}
  ${photo || avatarArt()}
</g>
<path d="M822 450 Q800 450 800 428 V176 A130 130 0 0 1 1060 176 V428 Q1060 450 1038 450 Z" fill="none" stroke="${P.gold}" stroke-opacity=".45"/>`;
}

// ------------------------------------------------------------------ Cards
function hero() {
  const W = 1200, H = 500;
  const tag = (x, y, w, label, value, dot) => `
<g class="in d6"><rect x="${x}" y="${y}" width="${w}" height="52" rx="11" fill="#141619" fill-opacity=".94" stroke="${P.line2}"/>
${t(x + 14, y + 20, e(label), { cls: 'mono', size: 9.5, fill: P.dim, ls: 2 })}
${dot ? `<circle cx="${x + 18}" cy="${y + 37}" r="3.5" fill="${P.ok}" class="pulse"/>` : ''}
${t(x + (dot ? 28 : 14), y + 41, e(value), { size: 13.5, weight: 600 })}</g>`;
  const body = `
${frame(W, H)}
${figureArt()}
${tag(726, 116, 152, 'STATUS', 'Available now', true)}
${tag(1000, 360, 164, 'REPLIES', 'Within 24 hours', false)}
${t(930, 478, 'FIG. 01 · SOFTWARE DEVELOPER · INDIA', { cls: 'mono', size: 10, fill: P.dim, ls: 2, anchor: 'middle' })}
<g class="in">
  <rect x="56" y="48" width="378" height="34" rx="17" fill="#ffffff" fill-opacity=".02" stroke="${P.line2}"/>
  <circle cx="77" cy="65" r="4" fill="${P.ok}" class="pulse"/>
  ${t(91, 70, 'Open to full-time roles &amp; freelance projects', { size: 13.5, fill: P.muted })}
</g>
<g class="in d1">
  <line x1="56" y1="118" x2="100" y2="118" stroke="${P.gold}" stroke-opacity=".8"/>
  ${t(114, 122, 'SOFTWARE DEVELOPER · JAVA · REACT', { cls: 'mono', size: 11.5, fill: P.dim, ls: 3.2 })}
</g>
<g class="in d2">${t(48, 238, e(CONFIG.first), { cls: 'serif', size: 116, ls: -2 })}</g>
<g class="in d3">${t(52, 344, e(CONFIG.last + '.'), { cls: 'serif', size: 116, italic: true, fill: P.gold2, ls: -2 })}</g>
<g class="in d4">
  ${t(56, 398, `I build <tspan class="serif" font-style="italic" font-size="21" fill="${P.gold2}">reliable Java backends</tspan>, web apps and APIs,`, { size: 18, fill: P.muted })}
  ${t(56, 425, 'and the websites small businesses run on.', { size: 18, fill: P.muted })}
</g>
<g class="in d5">${t(56, 470, 'NOW BUILDING → BUDGETX · SAFFRON TABLE · CAREDESK', { cls: 'mono', size: 10.5, fill: P.dim, ls: 2 })}</g>`;
  return svgDoc(W, H, `${CONFIG.first} ${CONFIG.last}, software developer in India. Builds reliable Java backends, web apps and APIs. Open to full-time roles and freelance projects.`, figureDefs(), body);
}

function ticker() {
  const W = 1200, H = 84;
  const items = [['Java · Spring Boot', 'backend stack'], ['5 of 8', 'BudgetX services built'], ['JWT · Redis · Kafka', 'auth, rate limits, events'], ['React', 'web apps & PWAs'], ['3', 'more builds in progress'], ['<24h', 'reply time']];
  let x = 0, row = '';
  for (const [v, l] of items) {
    const vw = v.length * 30 * 0.5, lw = l.length * 13 * 0.53;
    row += t(x, 47, '◆', { size: 9, fill: P.gold });
    row += t(x + 22, 53, e(v), { cls: 'serif', size: 30 });
    row += t(x + 22 + vw + 12, 51, e(l), { size: 13, fill: P.muted });
    x += 22 + vw + 12 + lw + 56;
  }
  const TW = Math.round(x);
  const body = `
${frame(W, H, 18)}
<clipPath id="tclip"><rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="18"/></clipPath>
<g clip-path="url(#tclip)"><g transform="translate(40 0)"><g>
  <animateTransform attributeName="transform" type="translate" from="0 0" to="-${TW} 0" dur="${Math.round(TW / 38)}s" repeatCount="indefinite"/>
  <g>${row}</g><g transform="translate(${TW} 0)">${row}</g>
</g></g></g>
<rect x="1" y="1" width="90" height="${H - 2}" rx="18" fill="url(#fadeL)"/>
<rect x="${W - 91}" y="1" width="90" height="${H - 2}" rx="18" fill="url(#fadeR)"/>`;
  const defs = `<linearGradient id="fadeL"><stop offset="0" stop-color="${P.bg}"/><stop offset="1" stop-color="${P.bg}" stop-opacity="0"/></linearGradient>
<linearGradient id="fadeR"><stop offset="0" stop-color="${P.bg}" stop-opacity="0"/><stop offset="1" stop-color="${P.bg}"/></linearGradient>`;
  return svgDoc(W, H, 'Java and Spring Boot backend stack. 5 of 8 BudgetX services built. JWT, Redis, Kafka. React web apps and PWAs. 3 more builds in progress. Replies within 24 hours.', defs, body);
}

function title(num, label, pre, em, post, right) {
  const W = 1200, H = 120;
  const body = `
${frame(W, H, 18)}
<g class="in">${t(40, 44, `<tspan fill="${P.gold}">${num}</tspan><tspan fill="${P.dim}">  ·  ${e(label.toUpperCase())}</tspan>`, { cls: 'mono', size: 12, ls: 2.5 })}</g>
<g class="in d1">${t(38, 96, `${e(pre)}<tspan font-style="italic" fill="${P.gold2}">${e(em)}</tspan>${e(post)}`, { cls: 'serif', size: 48 })}</g>
${t(1160, 44, e(right), { cls: 'mono', size: 11, fill: P.dim, ls: 2, anchor: 'end' })}
<line x1="780" y1="84" x2="1160" y2="84" stroke="url(#tl)"/>
<circle cx="780" cy="84" r="3" fill="${P.gold2}"><animate attributeName="cx" values="780;1160" dur="5s" repeatCount="indefinite"/><animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.1;.85;1" dur="5s" repeatCount="indefinite"/></circle>`;
  const defs = `<linearGradient id="tl" gradientUnits="userSpaceOnUse" x1="780" y1="0" x2="1160" y2="0"><stop offset="0" stop-color="${P.gold}" stop-opacity="0"/><stop offset="1" stop-color="${P.gold}" stop-opacity=".7"/></linearGradient>`;
  return svgDoc(W, H, `${num} ${label}: ${pre}${em}${post}`, defs, body);
}

function about() {
  const W = 1200, H = 420;
  const para = [
    'My main project, BudgetX, is a personal-finance app built as',
    'Spring Boot microservices behind an API gateway, with Kafka events,',
    'Redis rate limiting, JWT auth and a React web app.',
  ];
  const para2 = [
    'I started out building Tableau and Power BI dashboards, so I care',
    'about clean data as much as clean code. I also take freelance work:',
    'websites, online stores and custom tools for small businesses.',
  ];
  const principles = [
    ['I.', 'Secure by default', 'Tokens checked at the gateway, secrets never committed.'],
    ['II.', 'Fast on every screen', 'Mobile-first, tuned for budget phones and slow networks.'],
    ['III.', 'Built to hand over', 'Clean code and a one-command Docker setup.'],
  ];
  const facts = [['ROLE', 'Software developer'], ['CORE STACK', 'Java · Spring Boot · React'], ['BASED IN', 'India'], ['OPEN TO', 'Full-time & freelance']];
  let body = frame(W, H);
  body += `<g class="in">${t(48, 76, "I'm Bhargav, a software developer from India", { cls: 'serif', size: 27 })}${t(48, 112, `who builds <tspan font-style="italic" fill="${P.gold2}">Java backends, web apps and APIs.</tspan>`, { cls: 'serif', size: 27 })}</g>`;
  body += `<g class="in d1">${para.map((l, i) => t(48, 160 + i * 24, e(l), { size: 15, fill: P.muted })).join('')}</g>`;
  body += `<g class="in d2">${para2.map((l, i) => t(48, 246 + i * 24, e(l), { size: 15, fill: P.muted })).join('')}</g>`;
  principles.forEach(([n, h, p], i) => {
    const y = 40 + i * 82;
    body += `<g class="in d${i + 2}"><line x1="660" y1="${y}" x2="1152" y2="${y}" stroke="${P.line}"/>`;
    body += t(660, y + 38, e(n), { cls: 'serif', size: 18, italic: true, fill: P.gold });
    body += t(704, y + 38, e(h), { cls: 'serif', size: 27 });
    body += t(704, y + 63, e(p), { size: 14, fill: P.muted }) + '</g>';
  });
  body += `<line x1="660" y1="286" x2="1152" y2="286" stroke="${P.line}"/>`;
  body += `<g class="in d6"><rect x="48" y="318" width="1104" height="76" rx="14" fill="${P.panel}" stroke="${P.line}"/>`;
  facts.forEach(([l, v], i) => {
    const x = 48 + i * 276;
    if (i) body += `<line x1="${x}" y1="318" x2="${x}" y2="394" stroke="${P.line}"/>`;
    body += t(x + 22, 346, e(l), { cls: 'mono', size: 10, fill: P.dim, ls: 2 });
    body += t(x + 22, 377, e(v), { cls: 'serif', size: 21 });
  });
  body += '</g>';
  return svgDoc(W, H, "About: Bhargav Angadi, software developer from India. Builds Java backends, web apps and APIs. Main project BudgetX: Spring Boot microservices behind an API gateway with Kafka, Redis, JWT and a React web app. Started with Tableau and Power BI dashboards. Takes freelance work. Principles: secure by default, fast on every screen, built to hand over.", '', body);
}

// ---------- project diagrams (480 x 380 coordinate space)
function box(x, y, w, h, label, o = {}) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="${o.gold ? '#1e1b14' : '#16181c'}" stroke="${o.gold ? P.gold : P.line2}"${o.gold ? ' stroke-opacity=".7"' : ''}${o.dashed ? ' stroke-dasharray="4 4"' : ''}/>` +
    t(x + w / 2, y + h / 2 + 4.5, e(label), { size: 13, fill: o.dashed ? P.dim : P.text, anchor: 'middle' });
}

function diagram(kind) {
  if (kind === 'micro') {
    const row1 = ['User', 'EMI', 'Expense', 'Budget'], row2 = ['AI agent', 'Market', 'Invest', 'Notify'];
    const xs = [16, 132, 248, 364];
    let s = box(150, 8, 180, 38, 'React web app · PWA') + box(110, 84, 260, 44, 'API Gateway · JWT · Redis', { gold: true });
    s += `<g fill="none" stroke="#3d424b" stroke-width="1.4"><path d="M240 46V84"/>${xs.map((x) => `<path d="M240 128C240 152 ${x + 50} 152 ${x + 50} 176"/>`).join('')}</g>`;
    s += row1.map((n, i) => box(xs[i], 176, 100, 38, n)).join('');
    s += row2.map((n, i) => box(xs[i], 228, 100, 38, n, { dashed: i > 0 })).join('');
    s += `<rect x="16" y="290" width="448" height="32" rx="16" fill="${P.gold}" fill-opacity=".08" stroke="${P.gold}" stroke-opacity=".45"/>`;
    s += t(240, 310, 'KAFKA · ASYNC EVENTS', { cls: 'mono', size: 11, fill: P.gold2, ls: 2, anchor: 'middle' });
    s += `<circle r="4" fill="${P.gold2}"><animateMotion dur="3s" repeatCount="indefinite" path="M240 27V128C240 152 414 152 414 176"/></circle>`;
    s += `<circle r="3.5" fill="${P.gold}"><animateMotion dur="4s" repeatCount="indefinite" path="M40 306H440"/></circle>`;
    s += t(240, 352, 'EUREKA DISCOVERY · CONFIG SERVER · MYSQL PER SERVICE', { cls: 'mono', size: 9.5, fill: P.dim, ls: 1.2, anchor: 'middle' });
    s += `<rect x="150" y="364" width="14" height="9" rx="2" fill="#16181c" stroke="${P.line2}"/>${t(170, 372, 'BUILT', { cls: 'mono', size: 9, fill: P.dim, ls: 1.5 })}`;
    s += `<rect x="236" y="364" width="14" height="9" rx="2" fill="none" stroke="${P.line2}" stroke-dasharray="3 2"/>${t(256, 372, 'NEXT PHASE', { cls: 'mono', size: 9, fill: P.dim, ls: 1.5 })}`;
    return s;
  }
  if (kind === 'booking') {
    let s = `<defs><marker id="ar" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4 0 8z" fill="#3d424b"/></marker></defs>`;
    s += box(40, 50, 180, 46, 'Guest picks a time') + box(40, 150, 180, 46, 'Booking form') + box(40, 250, 180, 46, 'API + Postgres', { gold: true });
    s += box(282, 150, 168, 46, 'Email → guest') + box(282, 250, 168, 46, 'Email → owner');
    s += `<g fill="none" stroke="#3d424b" stroke-width="1.5" marker-end="url(#ar)"><path d="M130 96V148"/><path d="M130 196V248"/><path d="M220 273H280"/><path d="M220 273C252 273 250 173 280 173"/></g>`;
    s += `<circle r="4" fill="${P.gold2}"><animateMotion dur="3.6s" repeatCount="indefinite" path="M130 73V273H282"/></circle>`;
    s += `<circle r="4" fill="${P.gold}"><animateMotion dur="3.6s" begin="1.8s" repeatCount="indefinite" path="M130 73V273H220C252 273 250 173 282 173"/></circle>`;
    return s;
  }
  if (kind === 'store') {
    return `<defs><linearGradient id="kimg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3a3226"/><stop offset="1" stop-color="${P.gold}"/></linearGradient></defs>
<rect x="60" y="24" width="172" height="316" rx="28" fill="${P.panel}" stroke="${P.line2}"/>
<rect x="121" y="36" width="50" height="6" rx="3" fill="${P.line2}"/>
<rect x="76" y="56" width="140" height="118" rx="14" fill="url(#kimg)"/>
${t(146, 122, 'KORA', { cls: 'mono', size: 12, fill: P.bg, ls: 3, anchor: 'middle' })}
${t(76, 198, 'Handloom Kurta', { size: 13 })}${t(76, 217, '₹1,299', { size: 13, fill: P.gold2 })}
${['S', 'M', 'L', 'XL'].map((s, i) => `<rect x="${76 + i * 34}" y="230" width="${s === 'XL' ? 32 : 28}" height="22" rx="6" fill="${s === 'M' ? P.gold : 'none'}" stroke="${s === 'M' ? P.gold : P.line2}"/>${t(76 + i * 34 + (s === 'XL' ? 16 : 14), 245, s, { size: 11, fill: s === 'M' ? '#17130b' : P.muted, anchor: 'middle' })}`).join('')}
<rect x="76" y="270" width="140" height="38" rx="19" fill="#25d366"/>
${t(146, 294, 'Order on WhatsApp', { size: 12, weight: 600, fill: '#06301a', anchor: 'middle' })}
<g opacity="0"><rect x="258" y="92" width="190" height="58" rx="16" fill="#123726"/>${t(274, 117, 'Hi! Is this kurta', { size: 13, fill: '#e8f5ee' })}${t(274, 136, 'available in M?', { size: 13, fill: '#e8f5ee' })}
<animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.12;.85;1" dur="6s" repeatCount="indefinite"/></g>
<g opacity="0"><rect x="278" y="166" width="172" height="58" rx="16" fill="#1a1c21" stroke="${P.line2}"/>${t(294, 191, 'Yes! Sending you', { size: 13 })}${t(294, 210, 'the payment link.', { size: 13 })}
<animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;.3;.42;.85;1" dur="6s" repeatCount="indefinite"/></g>
${t(262, 270, 'ORDERS ARRIVE ON WHATSAPP', { cls: 'mono', size: 10, fill: P.dim, ls: 1.5 })}
${t(262, 288, 'STOCK &amp; PAYMENTS IN SHOPIFY', { cls: 'mono', size: 10, fill: P.dim, ls: 1.5 })}`;
  }
  // slots
  const times = ['09:00', '10:00', '11:00', '12:00', '14:00'];
  const booked = new Set(['0,1', '0,3', '1,0', '1,2', '2,4', '3,0', '3,3', '4,1', '4,4']);
  let s = ['MON', 'TUE', 'WED', 'THU', 'FRI'].map((d, i) => t(72 + i * 84, 34, d, { cls: 'mono', size: 10, fill: P.dim, ls: 1.5, anchor: 'middle' })).join('');
  for (let c = 0; c < 5; c++) for (let r = 0; r < 5; r++) {
    if (c === 2 && r === 2) continue;
    const x = 34 + c * 84, y = 50 + r * 48, b = booked.has(`${c},${r}`);
    s += `<rect x="${x}" y="${y}" width="76" height="40" rx="9" fill="${b ? 'rgba(200,164,101,.1)' : 'none'}" stroke="${b ? 'rgba(200,164,101,.45)' : '#262a31'}"/>`;
    s += t(x + 38, y + 24, b ? 'booked' : times[r], { cls: 'mono', size: 11, fill: b ? P.gold : '#55565b', anchor: 'middle' });
  }
  s += `<rect x="202" y="146" width="76" height="40" rx="9" fill="${P.gold}" fill-opacity="0" stroke="#30343c">
<animate attributeName="fill-opacity" values="0;0;.16;.16;0" keyTimes="0;.35;.45;.9;1" dur="5s" repeatCount="indefinite"/>
<animate attributeName="stroke" values="#30343c;#30343c;${P.gold};${P.gold};#30343c" keyTimes="0;.35;.45;.9;1" dur="5s" repeatCount="indefinite"/></rect>`;
  s += `<text x="240" y="170" class="mono" font-size="11" fill="#6f6f72" text-anchor="middle">11:00<animate attributeName="opacity" values="1;1;0;0;1" keyTimes="0;.35;.45;.9;1" dur="5s" repeatCount="indefinite"/></text>`;
  s += `<text x="240" y="170" class="mono" font-size="11" fill="${P.gold2}" text-anchor="middle" opacity="0">locked ✓<animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;.35;.45;.9;1" dur="5s" repeatCount="indefinite"/></text>`;
  s += t(240, 316, 'SLOT LOCKED IN A DB TRANSACTION → NO DOUBLE BOOKINGS', { cls: 'mono', size: 10, fill: P.dim, ls: 1.2, anchor: 'middle' });
  return s;
}

function projectCard(p) {
  const W = 1200, H = 472;
  const allLines = wrap(p.desc, 70);
  if (allLines.length > 3) console.warn(`! ${p.title}: description is ${allLines.length} lines; only 3 fit. Shorten it in CONFIG.`);
  const lines = allLines.slice(0, 3);
  const pillW = Math.round(p.status.length * 7.4 + 44);
  let body = frame(W, H);
  body += `<g class="in">${t(48, 60, e(p.kicker.toUpperCase()), { cls: 'mono', size: 11.5, fill: P.dim, ls: 2.2 })}`;
  body += `<rect x="48" y="78" width="${pillW}" height="26" rx="13" fill="${P.gold}" fill-opacity=".12" stroke="${P.gold}" stroke-opacity=".35"/>`;
  body += `<circle cx="63" cy="91" r="3.5" fill="${P.gold}" class="pulse"/>${t(74, 95, e(p.status.toUpperCase()), { cls: 'mono', size: 10.5, fill: P.gold2, ls: 1.6 })}</g>`;
  body += `<g class="in d1">${t(44, 172, e(p.title), { cls: 'serif', size: 62 })}${t(48, 206, e(p.subtitle), { cls: 'serif', size: 22, italic: true, fill: P.gold2 })}</g>`;
  body += `<g class="in d2">${lines.map((l, i) => t(48, 244 + i * 24, e(l), { size: 15, fill: P.muted })).join('')}</g>`;
  body += `<line x1="48" y1="322" x2="650" y2="322" stroke="${P.line}"/>`;
  body += `<g class="in d3">${p.highlights.map(([big, label], i) => {
    const x = 48 + i * 204;
    return t(x, 366, e(big), { cls: 'serif', size: 38 }) + wrap(label, 26).slice(0, 2).map((l, j) => t(x, 390 + j * 17, e(l), { size: 13, fill: P.muted })).join('');
  }).join('')}</g>`;
  body += `<g class="in d4">${chipFlow(48, 426, 636, p.stack, { font: 'mono', size: 11, h: 26, gap: 6, color: P.muted })}</g>`;
  body += `<rect x="690" y="24" width="486" height="424" rx="18" fill="${P.panel}" stroke="${P.line}"/>`;
  body += t(712, 52, e(p.fig), { cls: 'mono', size: 10, fill: P.dim, ls: 2 });
  body += `<g transform="translate(693 66)">${diagram(p.diagram)}</g>`;
  return svgDoc(W, H, `${p.title}: ${p.subtitle}. ${p.desc} Stack: ${p.stack.join(', ')}. Status: ${p.status}.`, '', body);
}

function services() {
  const W = 1200, H = 404, tw = 544, th = 170;
  let body = frame(W, H);
  CONFIG.services.forEach((s, i) => {
    const x = 48 + (i % 2) * (tw + 16), y = 24 + Math.floor(i / 2) * (th + 16);
    body += `<g class="in d${i + 1}"><rect x="${x}" y="${y}" width="${tw}" height="${th}" rx="16" fill="${P.panel}" stroke="${P.line}"/>`;
    body += t(x + 26, y + 36, String(i + 1).padStart(2, '0'), { cls: 'mono', size: 11, fill: P.gold, ls: 2 });
    body += `<rect x="${x + tw - 66}" y="${y + 18}" width="40" height="40" rx="11" fill="none" stroke="${P.line2}"/>`;
    body += `<g transform="translate(${x + tw - 58} ${y + 26})" fill="none" stroke="${P.gold}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${ICONS[s.icon]}</g>`;
    body += t(x + 26, y + 80, e(s.title), { cls: 'serif', size: 31 });
    body += s.lines.map((l, j) => t(x + 26, y + 108 + j * 22, e(l), { size: 14.5, fill: P.muted })).join('');
    body += t(x + 26, y + 152, 'GREAT FOR', { cls: 'mono', size: 10, fill: P.gold, ls: 1.5 }) + t(x + 112, y + 152, e(s.forWho), { size: 13 });
    body += '</g>';
  });
  return svgDoc(W, H, 'Freelance services: ' + CONFIG.services.map((s) => `${s.title} (great for ${s.forWho})`).join('; ') + '.', '', body);
}

function toolkit() {
  const W = 1200, H = 540, cw = 356, ch = 236;
  let body = frame(W, H);
  CONFIG.toolkit.forEach((g, i) => {
    const x = 48 + (i % 3) * (cw + 18), y = 24 + Math.floor(i / 3) * (ch + 18);
    body += `<g class="in d${i + 1}"><rect x="${x}" y="${y}" width="${cw}" height="${ch}" rx="16" fill="${P.panel}" stroke="${P.line}"/>`;
    body += t(x + 24, y + 36, String(i + 1).padStart(2, '0'), { cls: 'mono', size: 11, fill: P.dim, ls: 2 });
    body += t(x + 24, y + 74, e(g.title), { cls: 'serif', size: 29 });
    body += chipFlow(x + 24, y + 96, cw - 48, g.items, { size: 13.5 });
    body += t(x + 24, y + ch - 24, e(g.why), { cls: 'serif', size: 16.5, italic: true, fill: P.muted });
    body += '</g>';
  });
  return svgDoc(W, H, 'Toolkit. ' + CONFIG.toolkit.map((g) => `${g.title}: ${g.items.map((it) => (Array.isArray(it) ? it[0] : it)).join(', ')}`).join('. ') + '.', '', body);
}

function footer() {
  const W = 1200, H = 250;
  const body = `
${frame(W, H)}
<g class="in">${t(56, 58, '// END OF FILE', { cls: 'mono', size: 11, fill: P.dim, ls: 2.5 })}</g>
<g class="in d1">${t(52, 128, "Let's build something", { cls: 'serif', size: 56 })}</g>
<g class="in d2">${t(52, 188, 'worth launching.', { cls: 'serif', size: 56, italic: true, fill: P.gold2 })}</g>
<g class="in d3">${t(56, 224, `${e(CONFIG.email.toUpperCase())}  ·  ${e(CONFIG.phone)}  ·  REPLIES &lt; 24H`, { cls: 'mono', size: 11, fill: P.dim, ls: 1.8 })}</g>
<circle cx="980" cy="125" r="104" fill="none" stroke="${P.line}"/>
<circle cx="980" cy="125" r="92" fill="none" stroke="${P.gold}" stroke-opacity=".45" stroke-dasharray="1 8"><animateTransform attributeName="transform" type="rotate" from="0 980 125" to="360 980 125" dur="60s" repeatCount="indefinite"/></circle>
<path d="M928 210 Q918 210 918 200 V118 A62 62 0 0 1 1042 118 V200 Q1042 210 1032 210 Z" fill="#141416" stroke="${P.gold}" stroke-opacity=".5"/>
${t(980, 160, 'BA', { cls: 'serif', size: 56, italic: true, fill: P.gold2, anchor: 'middle' })}`;
  return svgDoc(W, H, `Let's build something worth launching. ${CONFIG.email}, ${CONFIG.phone}, replies within 24 hours.`, '', body);
}

// ---------- "GitHub at a glance" from the public GitHub API (no third-party stats service)
async function fetchGlance() {
  const headers = { 'User-Agent': 'profile-readme-build', Accept: 'application/vnd.github+json' };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const get = async (url) => {
    const r = await fetch(url, { headers });
    if (!r.ok) throw new Error(`${r.status} for ${url}`);
    return r.json();
  };
  const user = await get(`https://api.github.com/users/${CONFIG.user}`);
  const repos = (await get(`https://api.github.com/users/${CONFIG.user}/repos?per_page=100`)).filter((r) => !r.fork);
  const langs = {};
  for (const r of repos) {
    for (const [k, v] of Object.entries(await get(r.languages_url))) langs[k] = (langs[k] || 0) + v;
  }
  return {
    repos: user.public_repos,
    stars: repos.reduce((s, r) => s + r.stargazers_count, 0),
    followers: user.followers,
    since: user.created_at.slice(0, 4),
    langs,
  };
}

function glanceCard(g) {
  const W = 1200, H = 250;
  const total = Object.values(g.langs).reduce((a, b) => a + b, 0);
  const sorted = Object.entries(g.langs).sort((a, b) => b[1] - a[1]);
  const shown = sorted.slice(0, 5);
  const other = sorted.slice(5).reduce((s, [, v]) => s + v, 0);
  if (other) shown.push(['Other', other]);
  const colors = [P.gold2, P.gold, P.steel, '#7a6540', '#5a606b', '#3a3f48'];
  const pct = (v) => ((v / total) * 100).toFixed(1) + '%';
  let body = frame(W, H);
  body += t(48, 52, 'GITHUB AT A GLANCE', { cls: 'mono', size: 11, fill: P.gold, ls: 2.5 });
  const [topLang, topBytes] = sorted[0] || ['code', 0];
  const tiles = [
    [g.repos, 'public repositories'],
    [total ? Math.round((topBytes / total) * 100) + '%' : '–', `of my code is ${topLang}`],
    [sorted.length, 'languages across repos'],
    [g.since, 'on GitHub since'],
  ];
  tiles.forEach(([v, l], i) => {
    const x = 48 + i * 150;
    body += `<g class="in d${i + 1}">${t(x, 132, e(v), { cls: 'serif', size: 52 })}${t(x, 160, e(l), { size: 13, fill: P.muted })}</g>`;
  });
  body += t(680, 52, 'LANGUAGES · BY CODE SIZE', { cls: 'mono', size: 11, fill: P.dim, ls: 2.5 });
  if (total > 0) {
    let x = 680;
    body += `<clipPath id="bar"><rect x="680" y="80" width="472" height="12" rx="6"/></clipPath><g clip-path="url(#bar)">`;
    shown.forEach(([, v], i) => { const w = (v / total) * 472; body += `<rect x="${x.toFixed(1)}" y="80" width="${(w + 0.5).toFixed(1)}" height="12" fill="${colors[i]}"/>`; x += w; });
    body += '</g>';
    shown.forEach(([n, v], i) => {
      const lx = 680 + (i % 2) * 240, ly = 130 + Math.floor(i / 2) * 30;
      body += `<circle cx="${lx + 5}" cy="${ly - 4}" r="5" fill="${colors[i]}"/>${t(lx + 18, ly, e(n), { size: 14 })}${t(lx + 214, ly, pct(v), { cls: 'mono', size: 12, fill: P.muted, anchor: 'end' })}`;
    });
  }
  body += t(48, 222, `UPDATED ${new Date().toISOString().slice(0, 10)} · PUBLIC GITHUB DATA`, { cls: 'mono', size: 10, fill: P.dim, ls: 2 });
  const langText = total ? ' Languages: ' + shown.map(([n, v]) => `${n} ${pct(v)}`).join(', ') + '.' : '';
  return svgDoc(W, H, `GitHub at a glance: ${g.repos} public repositories, ${sorted.length} languages, on GitHub since ${g.since}.${langText}`, '', body);
}

// ------------------------------------------------------------------ README
const enc =(s) => encodeURIComponent(String(s).replace(/-/g, '--').replace(/_/g, '__').replace(/ /g, '_'));
const LINKEDIN_LOGO = 'data:image/svg+xml;base64,' + Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#e3c78f" d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"/></svg>').toString('base64');

function badge(label, msg, href, alt, o = {}) {
  const color = o.color || 'c8a465';
  const logo = o.logo ? `&logo=${encodeURIComponent(o.logo)}&logoColor=e3c78f` : '';
  return `  <a href="${e(href)}"><img src="https://img.shields.io/badge/${enc(label)}-${enc(msg)}-${color}?style=for-the-badge&labelColor=0b0c0e${logo}" alt="${e(alt)}"></a>`;
}

function contactBadges() {
  return [
    badge('Portfolio', `${CONFIG.user}.github.io`, PORTFOLIO_URL, 'Portfolio website', { logo: 'githubpages' }),
    badge('LinkedIn', CONFIG.linkedinHandle, CONFIG.linkedin, 'LinkedIn profile', { logo: LINKEDIN_LOGO }),
    badge('Email', CONFIG.email, `mailto:${CONFIG.email}`, `Email ${CONFIG.email}`, { logo: 'gmail' }),
    badge('WhatsApp', CONFIG.phone, WHATSAPP_URL, `WhatsApp ${CONFIG.phone}`, { logo: 'whatsapp' }),
  ].join('\n');
}

function readme(hasGlance) {
  const img = (src, alt, width = '100%') => `<img src="${src}" width="${width}" alt="${e(alt)}">`;
  const out = [];
  out.push('<!-- Generated by scripts/build.mjs. Edit CONFIG there and re-run instead of editing this file. -->');
  out.push(`<a href="${PORTFOLIO_URL}">\n  ${img('assets/hero.svg', `${CONFIG.first} ${CONFIG.last}: software developer in India. Builds reliable Java backends, web apps and APIs. Open to full-time roles and freelance projects.`)}\n</a>`);
  out.push(`<p align="center">\n${contactBadges()}\n</p>`);
  out.push(img('assets/ticker.svg', 'Java and Spring Boot backend stack. 5 of 8 BudgetX services built. JWT, Redis and Kafka. React web apps. Replies within 24 hours.'));
  out.push(img('assets/title-about.svg', "01 About: Hello, I'm Bhargav.") + '\n' + img('assets/about.svg', 'About: software developer from India building Java backends, web apps and APIs. Principles: secure by default, fast on every screen, built to hand over.'));
  out.push(img('assets/title-work.svg', '02 Selected work: Real builds, real problems.'));
  for (const p of CONFIG.projects) {
    const link = p.repo || p.demo || `${PORTFOLIO_URL}#work`;
    out.push(`<a href="${link}">${img(`assets/project-${p.slug}.svg`, `${p.title}: ${p.subtitle}. ${p.desc} Stack: ${p.stack.join(', ')}. Status: ${p.status}.`)}</a>`);
    const badges = [];
    if (p.demo) badges.push(badge('Live demo', p.demo.replace(/^https?:\/\//, ''), p.demo, `${p.title} live demo`, { logo: 'vercel' }));
    if (p.repo) badges.push(badge('Repository', p.repo.split('/').pop(), p.repo, `${p.title} repository`, { logo: 'github' }));
    if (!p.repo && !p.demo) badges.push(badge('Code', 'coming soon', `https://github.com/${CONFIG.user}?tab=repositories`, `${p.title} code coming soon`, { logo: 'github', color: '1a1c21' }));
    out.push(`<p align="center">\n${badges.join('\n')}\n</p>`);
    if (p.screenshots) out.push(`<p align="center">\n${p.screenshots.map(([src, alt, w]) => '  ' + img(src, alt, w)).join('\n')}\n</p>`);
  }
  out.push(`<p align="center"><sub>EARLIER WORK · DATA ANALYTICS</sub><br>\n${CONFIG.earlier.map((x) => badge(x.tool, x.name, x.repo, `${x.name} (${x.tool})`, { logo: 'tableau', color: '1a1c21' })).join('\n')}\n</p>`);
  out.push(img('assets/title-services.svg', '03 Services: What I build for clients.') + '\n' + img('assets/services.svg', 'Freelance services: business websites, online stores, web apps and APIs, fixes and speed-ups.'));
  out.push(img('assets/title-toolkit.svg', '04 Toolkit: Tools I reach for.') + '\n' + img('assets/toolkit.svg', 'Toolkit: Java, Spring Boot, Spring Cloud, React, Next.js, MySQL, Redis, Kafka, Docker, Shopify and more.'));
  out.push(img('assets/title-activity.svg', '05 Commit log: Building in public.'));
  out.push(img(`https://raw.githubusercontent.com/${CONFIG.user}/${CONFIG.user}/output/github-contribution-grid-snake-gold.svg`, 'Animated snake eating my GitHub contributions from the past year. Re-rendered every 12 hours.'));
  if (hasGlance) out.push(img('assets/github-glance.svg', `GitHub at a glance for ${CONFIG.user}: repositories, stars, followers and languages, refreshed daily from the public GitHub API.`));
  out.push(img('assets/title-connect.svg', "06 Connect: Let's build together."));
  out.push(`<p align="center">\n${contactBadges()}\n</p>`);
  out.push(`<a href="${PORTFOLIO_URL}">${img('assets/footer.svg', "Let's build something worth launching.")}</a>`);
  return out.join('\n\n') + '\n';
}

// A local preview that mimics GitHub's dark profile page (not committed)
function preview(md) {
  const html = md
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(`/output/github-contribution-grid-snake-gold.svg`, `/output/github-contribution-grid-snake-dark.svg`);
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Profile README preview</title>
<style>body{margin:0;background:#0d1117;color:#e6edf3;font:14px/1.5 -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif}
.note{max-width:838px;margin:16px auto 0;padding:10px 14px;border:1px solid #30363d;border-radius:8px;color:#9198a1;font-size:13px}
article{max-width:838px;margin:16px auto 64px;padding:24px;border:1px solid #30363d;border-radius:8px;box-sizing:border-box}
article img{max-width:100%;box-sizing:content-box}article p{margin:0 0 16px}article sub{color:#9198a1;letter-spacing:.12em}a{color:#4493f8}</style></head>
<body><p class="note">Local preview of how the README renders on github.com/${CONFIG.user}. The gold commit snake appears after the Snake workflow runs; this preview shows your current dark one.</p>
<article>${html}</article></body></html>`;
}

// ------------------------------------------------------------------ Build
mkdirSync(ASSETS, { recursive: true });
const files = {
  'hero.svg': hero(),
  'ticker.svg': ticker(),
  'title-about.svg': title('01', 'About', "Hello, I'm ", 'Bhargav', '.', 'WHOAMI'),
  'about.svg': about(),
  'title-work.svg': title('02', 'Selected work', 'Real builds, ', 'real', ' problems.', 'SHIPPED + IN PROGRESS'),
  'title-services.svg': title('03', 'Services', 'What I build ', 'for clients', '.', 'FREELANCE'),
  'services.svg': services(),
  'title-toolkit.svg': title('04', 'Toolkit', 'Tools I ', 'reach for', '.', 'JAVA · REACT · DOCKER'),
  'toolkit.svg': toolkit(),
  'title-activity.svg': title('05', 'Commit log', 'Building in ', 'public', '.', 'UPDATED EVERY 12H'),
  'title-connect.svg': title('06', 'Connect', "Let's build ", 'together', '.', 'REPLIES < 24H'),
  'footer.svg': footer(),
};
for (const p of CONFIG.projects) files[`project-${p.slug}.svg`] = projectCard(p);
let glance = null;
try {
  glance = await fetchGlance();
  files['github-glance.svg'] = glanceCard(glance);
} catch (err) {
  console.warn(`! Couldn't fetch GitHub stats (${err.message}); keeping the previous card if there is one.`);
}
for (const [name, svg] of Object.entries(files)) writeFileSync(join(ASSETS, name), svg);

const md = readme(Boolean(glance) || existsSync(join(ASSETS, 'github-glance.svg')));
writeFileSync(join(ROOT, 'README.md'), md);
writeFileSync(join(ROOT, 'preview.html'), preview(md));

// Publish the portfolio page to site/ for GitHub Pages
mkdirSync(join(ROOT, 'site'), { recursive: true });
writeFileSync(join(ROOT, 'site', '.nojekyll'), '');
if (existsSync(CONFIG.portfolioSource)) {
  copyFileSync(CONFIG.portfolioSource, join(ROOT, 'site', 'index.html'));
  for (const f of ['avatar.webp', 'avatar.png']) { // the hero avatar image, if you have one
    const src = join(dirname(CONFIG.portfolioSource), f);
    if (existsSync(src)) copyFileSync(src, join(ROOT, 'site', f));
  }
} else console.warn(`! Portfolio not found at ${CONFIG.portfolioSource}; site/ left as is.`);

console.log(`Built README.md, preview.html, site/ and ${Object.keys(files).length} SVG cards.`);
