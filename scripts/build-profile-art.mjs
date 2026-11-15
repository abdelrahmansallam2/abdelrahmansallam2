import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

// Run with Node.js and Sharp installed, or pass a Node modules directory.
const require = createRequire(import.meta.url);
const sharp = require(process.argv[2] ? path.join(process.argv[2], 'sharp') : 'sharp');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const assets = path.join(root, 'assets');
await fs.mkdir(assets, { recursive: true });

const C = { bg: '#10151D', line: '#303E4C', paper: '#F4F1E8', muted: '#A9B6C4', lime: '#C7F279', cyan: '#8DDFF2', peach: '#FFAE95', violet: '#C8BCF6' };
const xml = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[c]);
const text = (x, y, value, size, fill = C.paper, weight = 500, extra = '') => `<text x="${x}" y="${y}" fill="${fill}" font-size="${size}" font-weight="${weight}" ${extra}>${xml(value)}</text>`;
const mono = (x, y, value, size = 14, fill = C.muted, extra = '') => text(x, y, value, size, fill, 500, `font-family="Consolas,monospace" ${extra}`);
const rect = (x, y, w, h, fill, rx = 0, stroke = '', sw = 1) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}"${stroke ? ` stroke="${stroke}" stroke-width="${sw}"` : ''}/>`;
const svg = (w, h, title, body, defs = '') => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none" role="img" aria-labelledby="title"><title id="title">${xml(title)}</title><defs>${defs}</defs><g font-family="Segoe UI,Arial,sans-serif">${body}</g></svg>`;
const tag = (x, y, w, label, color) => `${rect(x, y, w, 31, color, 15)}${mono(x + w / 2, y + 21, label, 12, C.bg, 'text-anchor="middle"')}`;
const save = (name, data) => fs.writeFile(path.join(assets, name), data);

function phoneScreen(phase) {
  const y = Math.sin(phase * Math.PI * 2) * 4;
  const panels = [
    `${rect(880, 214, 172, 72, C.bg, 14)}<path d="M895 263l24-17 22 9 24-25 20 8 24-7 25-6" stroke="${C.lime}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`,
    `${rect(880, 214, 172, 72, C.cyan, 14)}${mono(896, 243, '<Widget />', 17, C.bg)}${rect(896, 257, 121, 6, '#63AFC4', 3)}`,
    `${rect(880, 214, 172, 72, C.violet, 14)}<circle cx="911" cy="249" r="15" fill="${C.bg}"/><path d="M904 249l5 5 10-11" stroke="${C.paper}" stroke-width="2.5" stroke-linecap="round"/>${text(937, 254, 'Feels right.', 15, C.bg, 700)}`,
  ];
  return `<g transform="translate(0 ${y.toFixed(2)})">
    ${rect(852, 92, 228, 382, '#070B10', 38, '#526474', 2)}
    ${rect(863, 103, 206, 360, C.paper, 29)}
    ${rect(925, 112, 81, 17, C.bg, 9)}
    ${mono(881, 147, '9:41', 10, C.bg)}
    <path d="M1036 139h12m-12 4h8" stroke="${C.bg}" stroke-width="2" stroke-linecap="round"/>
    ${text(880, 177, 'Make it useful.', 20, C.bg, 750)}
    ${mono(880, 195, 'MAKE IT FEEL RIGHT.', 8.5, '#65717B')}
    ${panels.map((panel, index) => {
      const position = phase * 3;
      const distance = (position - index + 3) % 3;
      const opacity = distance < 0.1 ? distance / 0.1 : distance < 1 ? 1 : distance < 1.1 ? 1 - (distance - 1) / 0.1 : 0;
      return `<g opacity="${opacity.toFixed(3)}">${panel}</g>`;
    }).join('')}
    ${rect(880, 298, 80, 66, C.cyan, 12)}${rect(972, 298, 80, 66, C.violet, 12)}
    <path d="M896 317h28m-28 7h19m-19 7h23" stroke="${C.bg}" stroke-width="2.5" stroke-linecap="round"/>
    ${mono(891, 351, 'INTERFACE', 8, C.bg)}
    <path d="M995 316l-8 8 8 8m14-16l8 8-8 8" stroke="${C.bg}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    ${mono(987, 351, 'BEHAVIOR', 8, C.bg)}
    ${rect(880, 377, 172, 43, C.lime, 12)}
    ${text(897, 404, 'Build something good', 12, C.bg, 700)}
    ${rect(941, 445, 49, 4, C.bg, 2)}
  </g>`;
}

function hero(phase = 0) {
  const drift = Math.sin(phase * Math.PI * 2) * 5;
  const dot = 0.55 + 0.45 * Math.sin(phase * Math.PI * 2) ** 2;
  const phaseLabel = ['01 / IMAGINE', '02 / BUILD', '03 / REFINE'][Math.min(2, Math.floor(phase * 3))];
  const dots = Array.from({ length: 18 }, (_, i) => `<circle cx="${770 + (i % 6) * 57}" cy="${117 + Math.floor(i / 6) * 130}" r="1.6" fill="#3B4A59"/>`).join('');
  return svg(1200, 560, 'Abdelrahman Sallam - Flutter Developer - The Flutter Lab', `
    ${rect(1, 1, 1198, 558, C.bg, 24, C.line)}
    <path d="M742 1v558M1 64h1198M1 502h1198" stroke="${C.line}"/>
    ${rect(28, 20, 27, 26, C.lime, 7)}${text(41.5, 38, 'AS', 11, C.bg, 800, 'text-anchor="middle"')}
    ${mono(69, 38, 'THE FLUTTER LAB', 13, C.paper, 'letter-spacing="2"')}
    <circle cx="1056" cy="33" r="4" fill="${C.lime}" opacity="${dot.toFixed(2)}"/>
    ${mono(1166, 38, 'CAIRO, EG', 12, C.muted, 'text-anchor="end"')}
    ${tag(43, 94, 185, 'FLUTTER DEVELOPER', C.lime)}
    ${text(36, 226, 'ABDELRAHMAN', 87, C.paper, 850, 'letter-spacing="-4"')}
    ${text(36, 329, 'SALLAM', 119, C.paper, 850, 'letter-spacing="-5"')}
    <path d="M46 350q144-15 282-2" stroke="${C.lime}" stroke-width="5" stroke-linecap="round"/>
    ${text(44, 397, 'Small screens.', 27, C.muted, 450)}
    ${text(44, 432, 'Big possibilities.', 27, C.paper, 700)}
    ${mono(44, 476, 'MOBILE APPS  /  AI WORKFLOWS  /  SMART HOMES', 13, C.muted)}
    ${dots}
    <ellipse cx="963" cy="281" rx="204" ry="103" transform="rotate(-42 963 281)" stroke="#455664" stroke-dasharray="5 9" stroke-width="1.5"/>
    <ellipse cx="963" cy="281" rx="199" ry="151" transform="rotate(26 963 281)" stroke="#283746"/>
    ${phoneScreen(phase)}
    <g transform="translate(0 ${drift.toFixed(2)}) rotate(-7 822 195)">
      ${rect(774, 165, 108, 59, C.cyan, 12, '#070B10', 2)}
      ${mono(789, 189, 'UI + UX', 15, C.bg)}${mono(789, 208, 'the details', 10, '#3B5360')}
    </g>
    <g transform="translate(0 ${(-drift).toFixed(2)}) rotate(7 1090 368)">
      ${rect(1036, 335, 125, 65, C.peach, 12, '#070B10', 2)}
      <path d="M1051 362l13-11 13 11v18h-26zM1060 380v-11h9v11" stroke="${C.bg}" stroke-width="2"/>
      ${mono(1085, 363, 'SMART', 11, C.bg)}${mono(1085, 378, 'HOME', 11, C.bg)}
    </g>
    ${tag(875, 479, 186, phaseLabel, C.violet)}
    ${mono(43, 537, '> flutter run', 16, C.lime)}
    ${rect(185, 524, 8, 17, C.lime, 1)}
    ${mono(1157, 537, 'IDEA -> INTERFACE -> EXPERIENCE', 12, C.muted, 'text-anchor="end"')}
  `);
}

await save('profile-banner.svg', hero(0.1));
const frames = [];
const frameCount = 60;
for (let i = 0; i < frameCount; i++) {
  frames.push(await sharp(Buffer.from(hero(i / frameCount))).ensureAlpha().raw().toBuffer());
}
// Sharp treats the vertical RGBA strip as animation frames via pageHeight.
await sharp(Buffer.concat(frames), { raw: { width: 1200, height: 560 * frameCount, channels: 4, pageHeight: 560 } })
  .gif({ loop: 0, delay: 100, colours: 128, effort: 7, dither: 0 })
  .toFile(path.join(assets, 'flutter-lab.gif'));

const paperGrid = '<pattern id="grid" width="28" height="28" patternUnits="userSpaceOnUse"><path d="M28 0H0V28" stroke="#DED8C6" stroke-width="1"/></pattern>';
await save('seniors-project.svg', svg(1200, 398, 'Seniors 2027 - Explore the Flutter yearbook project', `
  ${rect(0, 0, 1200, 398, '#F5F0DD', 20)}
  ${rect(1, 1, 1198, 396, 'url(#grid)', 20, '#D4CDBA')}
  ${rect(35, 32, 251, 31, C.bg, 4)}${mono(49, 53, '01 / FEATURED PROJECT', 13, C.paper)}
  ${text(32, 155, 'SENIORS', 91, C.bg, 850, 'letter-spacing="-4"')}
  ${text(32, 250, '2027', 116, C.bg, 850, 'letter-spacing="-5"')}
  ${text(39, 296, 'A yearbook. A community.', 23, '#42494B', 600)}
  ${mono(40, 326, 'FLUTTER / DART / REST / SECURE AUTH', 13, '#586261')}
  ${rect(38, 350, 224, 29, C.bg, 14)}${mono(58, 370, 'EXPLORE THE SOURCE  ->', 13, C.paper)}
  <g transform="rotate(-7 767 169)">
    ${rect(626, 72, 304, 188, C.bg, 4)}${rect(619, 65, 304, 188, '#FFFDF6', 4, C.bg, 3)}
    ${rect(621, 67, 300, 39, '#D6F6FF', 3)}<path d="M620 106h303" stroke="${C.bg}" stroke-width="3"/>
    ${mono(637, 92, 'CLASS OF 2027', 17, C.bg)}
    ${text(637, 147, 'OUR LITTLE UNIVERSE.', 20, C.bg, 800)}
    ${rect(637, 165, 262, 7, '#ACA99C', 2)}${rect(637, 182, 208, 6, '#C3BFB1', 2)}
    ${rect(637, 208, 119, 27, '#DFFFDC', 2, C.bg, 2)}${mono(649, 226, 'OPEN BOOK', 13, C.bg)}
  </g>
  <g transform="rotate(8 1035 220)">
    ${rect(933, 113, 197, 231, C.bg, 3)}${rect(926, 106, 197, 231, '#FFFDF6', 3, C.bg, 3)}
    ${rect(941, 121, 167, 166, '#F5D5DE', 0, C.bg, 2)}
    <path d="M958 236l34-38 25 28 23-21 48 48h-130z" stroke="#9D6C82" stroke-width="2"/>
    <circle cx="1068" cy="160" r="14" stroke="#9D6C82" stroke-width="2"/>
    ${mono(1024, 316, 'MEMORIES LIVE HERE', 12, C.bg, 'text-anchor="middle"')}
    ${rect(986, 94, 74, 23, '#FF86B6', 2, C.bg, 2)}
  </g>
  <g transform="rotate(-4 821 319)">
    ${rect(658, 304, 292, 45, C.bg, 3)}${rect(652, 298, 292, 45, '#F8FF74', 3, C.bg, 3)}
    ${mono(674, 327, 'ONE YEAR. ALL THE STORIES.', 16, C.bg)}
  </g>
`, paperGrid));

await save('todo-project.svg', svg(1200, 238, 'Todo App - Firebase-powered Flutter task management', `
  ${rect(1, 1, 1198, 236, C.cyan, 18, '#68AFC3')}
  ${mono(34, 37, '02 / LESS CHAOS, MORE CHECKMARKS', 13, '#2B5261')}
  ${text(28, 130, 'TODO APP', 80, C.bg, 850, 'letter-spacing="-3"')}
  ${mono(34, 174, 'FLUTTER / FIREBASE / PROVIDER', 15, '#2B5261')}
  ${mono(34, 213, 'EXPLORE THE SOURCE ->', 13, C.bg)}
  <g transform="rotate(-6 892 122)">
    ${rect(738, 40, 313, 158, '#6FBACB', 15)}${rect(730, 32, 313, 158, '#F7FCFD', 15, C.bg, 2)}
    ${rect(749, 53, 25, 25, C.lime, 7, C.bg, 2)}
    <path d="M756 65l5 5 8-10" stroke="${C.bg}" stroke-width="2.5" stroke-linecap="round"/>
    ${text(787, 71, 'Turn an idea into a task', 16, C.bg, 650)}
    ${rect(749, 98, 25, 25, C.lime, 7, C.bg, 2)}
    <path d="M756 110l5 5 8-10" stroke="${C.bg}" stroke-width="2.5" stroke-linecap="round"/>
    ${text(787, 116, 'Make room for the next one', 16, C.bg, 650)}
    ${rect(749, 143, 25, 25, '#FFFFFF', 7, C.bg, 2)}
    ${rect(787, 153, 165, 6, '#D3E0E5', 3)}
  </g>
`));

await save('islami-project.svg', svg(1200, 238, 'Islami App - Quran, Hadith, Sebha and radio with Flutter', `
  ${rect(1, 1, 1198, 236, C.violet, 18, '#A69AD4')}
  ${mono(34, 37, '03 / AN EVERYDAY COMPANION', 13, '#504774')}
  ${text(28, 130, 'ISLAMI APP', 80, C.bg, 850, 'letter-spacing="-3"')}
  ${mono(34, 174, 'FLUTTER / LOCALIZATION / THEMES', 15, '#504774')}
  ${mono(34, 213, 'EXPLORE THE SOURCE ->', 13, C.bg)}
  <circle cx="906" cy="119" r="93" fill="#B5A8E7"/>
  <circle cx="906" cy="119" r="76" stroke="#8A7EB6" stroke-dasharray="2 10"/>
  <path d="M876 62a49 49 0 1 0 66 66 46 46 0 0 1-66-66z" fill="${C.paper}" stroke="${C.bg}" stroke-width="2"/>
  <path d="M950 68l5 12 13 2-10 9 3 13-11-7-12 7 3-13-10-9 14-2z" fill="${C.lime}" stroke="${C.bg}" stroke-width="2"/>
  ${tag(1010, 101, 136, 'AR / EN', C.paper)}
`));

await save('beyond-the-screen.svg', svg(1200, 230, 'AI-assisted development and smart-home automation', `
  ${rect(1, 1, 1198, 228, C.bg, 18, C.line)}
  <path d="M600 25v180" stroke="${C.line}"/>
  ${rect(32, 31, 53, 53, C.lime, 14)}
  <path d="M48 48l-8 10 8 10m21-20l8 10-8 10m-10-23l-4 26" stroke="${C.bg}" stroke-width="2.5" stroke-linecap="round"/>
  ${mono(104, 62, 'PROMPT / BUILD / VERIFY', 14, C.lime)}
  ${text(32, 137, 'AI, with intention.', 37, C.paper, 750, 'letter-spacing="-1"')}
  ${text(34, 176, 'A collaborator. Not a substitute for judgment.', 18, C.muted)}
  ${rect(632, 31, 53, 53, C.peach, 14)}
  <path d="M644 58l14-12 15 12v17h-29zM654 75v-12h9v12" stroke="${C.bg}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  ${mono(704, 62, 'CONNECT / AUTOMATE / SIMPLIFY', 13, C.peach)}
  ${text(632, 137, 'Beyond the pixels.', 37, C.paper, 750, 'letter-spacing="-1"')}
  ${text(634, 176, 'Making connected spaces work together.', 18, C.muted)}
`));

for (const [name, label, accent, icon] of [
  ['email', 'SAY HELLO', C.lime, '<rect x="18" y="18" width="23" height="17" rx="3"/><path d="M19 20l10.5 8L40 20"/>'],
  ['linkedin', 'LINKEDIN', C.cyan, '<path d="M20 25v11m0-18v1m8 17V25m0 5c0-6 10-7 10 0v6" stroke-width="3"/>'],
]) {
  await save(`contact-${name}.svg`, svg(204, 55, label, `${rect(1, 1, 202, 53, accent, 12, C.bg, 2)}<g stroke="${C.bg}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${icon}</g>${text(55, 33, label, 15, C.bg, 800)}${mono(184, 33, '>', 18, C.bg, 'text-anchor="end"')}`));
}

await save('lab-footer.svg', svg(1200, 106, 'Built with curiosity. Refined with care. Abdelrahman Sallam, Cairo, Egypt.', `
  <path d="M0 1h1200" stroke="${C.line}"/>
  ${rect(0, 24, 36, 36, C.lime, 10)}${text(18, 48, 'AS', 14, C.bg, 800, 'text-anchor="middle"')}
  ${mono(52, 46, 'BUILT WITH CURIOSITY. REFINED WITH CARE.', 15, '#91A0B2')}
  ${mono(1200, 46, 'CAIRO, EGYPT / FLUTTER LAB', 13, '#91A0B2', 'text-anchor="end"')}
  ${mono(52, 78, 'ABDELRAHMAN SALLAM', 12, '#8493A3')}
`));

const gifInfo = await sharp(path.join(assets, 'flutter-lab.gif'), { animated: true }).metadata();
console.log(JSON.stringify({ assets, animation: { width: gifInfo.width, height: gifInfo.pageHeight, frames: gifInfo.pages, delay: gifInfo.delay?.[0], bytes: (await fs.stat(path.join(assets, 'flutter-lab.gif'))).size } }, null, 2));
