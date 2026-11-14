import fs from 'node:fs/promises';
import path from 'node:path';

const token = process.env.GITHUB_TOKEN;
const owner = process.env.GITHUB_REPOSITORY_OWNER || 'abdelrahmansallam2';
if (!token) throw new Error('GITHUB_TOKEN is required to read contribution data.');

const response = await fetch('https://api.github.com/graphql', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'Content-Type': 'application/json',
    'User-Agent': 'GitHub-Profile-Contribution-Chart',
  },
  body: JSON.stringify({
    query: `query Contributions($login: String!) {
      user(login: $login) {
        contributionsCollection {
          contributionCalendar {
            weeks { contributionDays { date contributionCount } }
          }
        }
      }
    }`,
    variables: { login: owner },
  }),
});
if (!response.ok) throw new Error(`Contribution API returned HTTP ${response.status}.`);
const result = await response.json();
if (result.errors?.length) {
  throw new Error('GitHub rejected the contribution query; no chart was generated.');
}
const weeks = result.data?.user?.contributionsCollection?.contributionCalendar?.weeks;
if (!Array.isArray(weeks)) throw new Error('GitHub did not return contribution data.');
const days = weeks.flatMap(week => week.contributionDays).slice(-30);
if (!days.length) throw new Error('No contribution dates were returned.');

const total = days.reduce((sum, day) => sum + day.contributionCount, 0);
const max = Math.max(1, ...days.map(day => day.contributionCount));
const points = days.map((day, index) => ({
  x: 65 + (index / Math.max(1, days.length - 1)) * 1070,
  y: 181 - (day.contributionCount / max) * 94,
}));
const line = points.map((point, index) => `${index ? 'L' : 'M'}${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(' ');
const area = `${line} L1135 190 L65 190 Z`;
const xml = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[char]);
const dateLabel = value => new Date(`${value}T00:00:00Z`).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', timeZone: 'UTC' });
const circles = points.map(point => `<circle cx="${point.x.toFixed(1)}" cy="${point.y.toFixed(1)}" r="3" fill="#6D8270"/>`).join('');
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="260" viewBox="0 0 1200 260" role="img" aria-labelledby="title description">
  <title id="title">${xml(owner)} - GitHub activity</title>
  <desc id="description">${total} contributions from ${xml(days[0].date)} to ${xml(days.at(-1).date)}, using GitHub contribution data.</desc>
  <defs><linearGradient id="area" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#C96942" stop-opacity="0.20"/><stop offset="1" stop-color="#C96942" stop-opacity="0.01"/></linearGradient></defs>
  <rect x="0.5" y="0.5" width="1199" height="259" rx="16" fill="#F6F2EB" stroke="#D7CEC0"/>
  <g font-family="Segoe UI, Arial, sans-serif">
    <text x="38" y="41" fill="#29343B" font-size="17" font-weight="650">Contribution Activity</text>
    <text x="38" y="63" fill="#79736B" font-size="12">LAST 30 DAYS / PUBLIC GITHUB ACTIVITY</text>
    <text x="1160" y="44" fill="#A8502F" font-size="16" font-weight="600" text-anchor="end">${total} contributions</text>
    <path d="M65 90H1135M65 135H1135M65 190H1135" stroke="#D7CEC0" stroke-dasharray="3 7"/>
    <path d="${area}" fill="url(#area)"/>
    <path d="${line}" fill="none" stroke="#C96942" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    ${circles}
    <text x="65" y="224" fill="#79736B" font-size="12">${xml(dateLabel(days[0].date))}</text>
    <text x="1135" y="224" fill="#79736B" font-size="12" text-anchor="end">${xml(dateLabel(days.at(-1).date))}</text>
    <text x="600" y="241" fill="#79736B" font-size="11" text-anchor="middle">${xml(owner)} / refreshed automatically</text>
  </g>
</svg>`;
const output = path.resolve('assets/contribution-activity.svg');
await fs.mkdir(path.dirname(output), { recursive: true });
await fs.writeFile(output, svg, 'utf8');
console.log(JSON.stringify({ owner, days: days.length, total, output }));
