// The Time Machine · interactive app prototype (vanilla JS)
'use strict';

// ---------- data ----------
const pic = f => '../Pic/' + encodeURIComponent(f);
const P = {
  eiffel: pic('Eiffel Tower opening day, Paris 1889-1.png'), florence: pic('Florence 1504_ Marble Sculptors at Work-11.png'),
  tokyo: pic('Tokyo’s Warm Future Food Market-3.png'), rome: pic('Morning at Rome’s Newly Built Colosseum-4.png'),
  coat: pic('1880s Dark Brown Wool Overcoat-7.png'), skirt: pic('Late 1880s navy bustle ensemble-8.png'),
  suit: pic('1880s Charcoal Tweed Suit Ensemble-6.png'), boots: pic('1880s brown leather lace-up boots-5.png'),
  paris: pic('Golden Paris Along the Seine-10.png'), champ: pic('Champ de Mars in Golden Light-9.png'),
};
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const PLACES = ['Paris, France', 'Florence, Italy', 'Rome, Italy', 'Tokyo, Japan', 'London, United Kingdom', 'Cairo, Egypt', 'Kyoto, Japan', 'Bangkok, Thailand'];
const TRIPS = {
  eiffel: { title: 'Eiffel Tower opening', meta: 'Paris, France · 31 Mar 1889', short: 'Paris · 1889', why: 'Be one of the first to climb it', img: P.eiffel, set: { era: 'AD', year: 1889, month: 3, day: 31, time: '10:00', place: 'Paris, France' }, past: true, tags: ['Art', 'Science'] },
  florence: { title: 'Florence art studios', meta: 'Florence, Italy · 1504', short: 'Florence · 1504', why: 'Watch famous artists at work', img: P.florence, set: { era: 'AD', year: 1504, month: 5, day: 12, time: '10:00', place: 'Florence, Italy' }, past: true, tags: ['Art'] },
  tokyo: { title: 'Future food market', meta: 'Tokyo, Japan · 2150', short: 'Tokyo · 2150', why: 'Taste food from the future', img: P.tokyo, set: { era: 'AD', year: 2150, month: 4, day: 3, time: '18:00', place: 'Tokyo, Japan' }, past: false, tags: ['Food', 'Science', 'Festivals'] },
};
const NOW_YEAR = 2026;

// ---------- state ----------
const S = {
  era: 'AD', year: 1889, month: 3, day: 31, time: '10:00', place: 'Paris, France',
  unit: 'Hours', amount: 3, when: 'Past', interests: new Set(['Art', 'Food']),
  riskOk: false, slotDay: 0, slotTime: 1, optIn: false, checklist: [false, false, false],
  booking: null, trip: null, rating: 0,
};
const stack = []; let cur = null, timers = [];

// ---------- helpers ----------
const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const ICON = {
  back: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>',
  close: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  chev: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6B5A48" stroke-width="2" stroke-linecap="round"><path d="M6 9l6 6 6-6"/></svg>',
  search: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6B5A48" stroke-width="2" stroke-linecap="round"><circle cx="10" cy="10" r="6"/><path d="M14.5 14.5L20 20"/></svg>',
  minus: '<svg width="12" height="12" viewBox="0 0 12 12" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M2 6h8"/></svg>',
  plus: '<svg width="12" height="12" viewBox="0 0 12 12" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M2 6h8M6 2v8"/></svg>',
  check: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FFF8EC" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-10"/></svg>',
  home: '<path d="M3 13L12 4l9 9M5.5 10.5V21h13V10.5"/>', plan: '<path d="M5 3h14M5 21h14M7 3c0 6 10 12 10 18M17 3c0 6-10 12-10 18"/>',
  trips: '<path d="M2 6h20v4a2 2 0 000 4v4H2v-4a2 2 0 000-4z M15 6v12"/>', profile: '<circle cx="12" cy="8" r="3.8"/><path d="M4.5 21c0-6.5 15-6.5 15 0"/>',
  warn: '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#A3201B" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"><path d="M12 3l10 17H2z M12 9v4 M12 16.5v.5"/></svg>',
  star: (on) => `<svg width="28" height="28" viewBox="0 0 24 24" fill="${on ? '#9C5B1F' : 'none'}" stroke="${on ? '#9C5B1F' : '#9A8A76'}" stroke-width="1.5" stroke-linejoin="round"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/></svg>`,
};
const svgIcon = d => `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
const badge = lv => `<span class="badge ${lv}"><i class="ic"></i>${lv}</span>`;
const status = (t = '9:41') => `<div class="status"><span>${t}</span><i></i></div>`;
const topbar = t => `<div class="topbar"><button class="icon-btn" data-act="back" aria-label="Back">${ICON.back}</button><h1>${esc(t)}</h1></div>`;
const btn = (cls, label, act, extra = '') => `<button class="btn ${cls}" data-act="${act}" ${extra}><span class="label">${esc(label)}</span></button>`;
const check = (on, label, act) => `<button class="check ${on ? 'on' : ''}" data-act="${act}" role="checkbox" aria-checked="${on}"><span class="box">${ICON.check}</span><span>${esc(label)}</span></button>`;
function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('show'), 1800); }
function later(fn, ms) { const id = setTimeout(fn, ms); timers.push(id); return id; }
function every(fn, ms) { const id = setInterval(fn, ms); timers.push(id); return id; }
function clearTimers() { timers.forEach(id => { clearTimeout(id); clearInterval(id); }); timers = []; }
const pad = n => String(n).padStart(2, '0');
function hms(sec) { sec = Math.max(0, Math.floor(sec)); return `${pad(Math.floor(sec / 3600))}:${pad(Math.floor(sec / 60) % 60)}:${pad(sec % 60)}`; }
const daysIn = (y, m) => [31, ((y % 4 === 0 && y % 100 !== 0) || y % 400 === 0) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m - 1];

// ---------- domain ----------
const stayText = () => S.unit === 'Open-ended' ? 'Open-ended stay' : `Stay ${S.amount} ${S.unit === 'Hours' ? 'h' : (S.amount > 1 ? 'days' : 'day')}`;
const dateText = () => `${S.day} ${MONTHS[S.month - 1]} ${S.year}${S.era === 'BC' ? ' BC' : ''}`;
const summary = () => `${dateText()} · ${S.time} local · ${stayText()}`;
function yearsAgo() { const y = S.era === 'BC' ? -S.year + 1 : S.year; const d = NOW_YEAR - y; return `${S.era === 'BC' ? 'BC' : 'AD (CE)'} · Gregorian calendar · ${d > 0 ? d + ' years ago' : d < 0 ? 'in ' + (-d) + ' years' : 'this year'}`; }
function validate() { const e = {}; if (!(S.year >= 1 && S.year <= 9999)) e.year = 'Enter a year from 1 to 9999'; const max = daysIn(S.year || 2000, S.month); if (!(S.day >= 1 && S.day <= max)) e.day = `1 to ${max}`; if (!PLACES.includes(S.place)) e.place = 'Choose a place from the list'; return e; }
function safety() {
  const city = S.place.split(',')[0]; const hour = parseInt(S.time, 10);
  if (city === 'Paris' && S.era === 'AD' && S.year === 1789 && S.month === 7 && S.day >= 12 && S.day <= 16)
    return { level: 'Blocked', title: "You can't travel to this time", body: 'Violent unrest in this area (Storming of the Bastille)', alts: [
      { t: '14 Jul 1790 · 10:00', s: 'Fête de la Fédération celebration', lv: 'Safe', set: { year: 1790, month: 7, day: 14, time: '10:00' } },
      { t: '20 Jul 1789 · 10:00', s: 'Calmer, but still tense', lv: 'Caution', set: { year: 1789, month: 7, day: 20, time: '10:00' } }] };
  if (city === 'Rome' && S.era === 'AD' && S.year === 64 && S.month === 7)
    return { level: 'Blocked', title: "You can't travel to this time", body: 'The Great Fire of Rome', alts: [{ t: '1 Jun 80 · 09:00', s: 'Colosseum opening games', lv: 'Caution', set: { year: 80, month: 6, day: 1, time: '09:00' } }] };
  if (S.era === 'BC') return { level: 'Caution', title: 'Very little reliable data for this time', body: 'We can only check safety for a short window around your arrival', alts: [] };
  if (S.era === 'AD' && S.year > NOW_YEAR) return { level: 'Caution', title: 'The future is a forecast', body: 'Safety and weather may change before you arrive', alts: [] };
  if (city === 'Paris' && S.year === 1889 && hour >= 13) return { level: 'Caution', title: 'Heavy rain and strong wind expected', body: 'From 16:00, during your stay', alts: [
    { t: 'Same day · 09:00', s: 'Back before the rain', lv: 'Safe', set: { time: '09:00' } }, { t: '1 Apr 1889 · 10:00', s: 'Dry, 14°C', lv: 'Safe', set: { month: 4, day: 1, time: '10:00' } }] };
  if (S.unit === 'Open-ended') return { level: 'Caution', title: 'Open-ended stay', body: 'Safety is only checked for the first 48 h', alts: [] };
  return { level: 'Safe', body: 'No dangerous events or severe weather within 48 h of your arrival' };
}
function weather() { const m = S.month, city = S.place.split(',')[0];
  const warm = { Bangkok: 1, Cairo: 1 }[city] || (m >= 6 && m <= 8);
  return warm ? { t: '27°C', a: 'Sunny · light wind', b: 'Rain chance 10%' } : (m >= 11 || m <= 2) ? { t: '4°C', a: 'Cold · grey sky', b: 'Snow chance 30%' } : { t: '12°C', a: 'Cloudy · light wind', b: 'Rain chance 20%' }; }
function wear() { const y = S.era === 'BC' ? -S.year : S.year; const w = weather();
  const cold = parseInt(w.t, 10) < 15;
  if (y < 1500) return { list: ['Long linen or wool tunic', 'Simple cloak or wrap', 'Leather sandals or soft shoes'], dont: ['Anything with zips, plastic or logos'], era: 'early era' };
  if (y < 1800) return { list: [cold ? 'Wool cloak or long coat' : 'Light linen shirt', 'Long skirt or breeches', 'Leather shoes with buckles'], dont: ['Visible phone or modern logos'], era: 'early modern era' };
  if (y <= 1920) return { list: [cold ? 'Warm coat or jacket' : 'Light cotton jacket', `Long skirt or suit trousers (${Math.floor(y / 10) * 10}s style)`, 'Closed leather shoes'], dont: ['Visible phone or modern logos'], era: `${Math.floor(y / 10) * 10}s` };
  if (y <= NOW_YEAR) return { list: [cold ? 'Warm jacket' : 'Light jacket', 'Comfortable trousers', 'Walking shoes'], dont: ['Devices that look too new'], era: 'modern era' };
  return { list: ['Light layers you can take off', 'Comfortable trousers', 'Soft walking shoes'], dont: ['Nothing special, the future is relaxed'], era: 'future' }; }
function slotDays() { const out = []; const d = new Date(); for (let i = 7; i < 11; i++) { const x = new Date(d.getFullYear(), d.getMonth(), d.getDate() + i); out.push({ dow: x.toLocaleDateString('en-GB', { weekday: 'short' }), d: `${x.getDate()} ${MONTHS[x.getMonth()]}`, date: x }); } return out; }
const SLOT_TIMES = ['09:00', '10:30', '13:00', '15:30'];
function price() { if (S.unit === 'Open-ended') return 45000; return S.unit === 'Hours' ? 30000 + S.amount * 5000 : 45000 + (S.amount - 1) * 8000; }
function qrSvg(size) { let s = 7; const r = () => (s = (s * 9301 + 49297) % 233280) / 233280; const n = 21, c = size / n; let o = '';
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { const f = (i < 8 && j < 8) || (i > 12 && j < 8) || (i < 8 && j > 12); if (!f && r() > .55) o += `<rect x="${i * c}" y="${j * c}" width="${c}" height="${c}"/>`; }
  for (const [x, y] of [[0, 0], [14, 0], [0, 14]]) o += `<rect x="${x * c}" y="${y * c}" width="${7 * c}" height="${7 * c}"/><rect x="${(x + 1) * c}" y="${(y + 1) * c}" width="${5 * c}" height="${5 * c}" fill="#fff"/><rect x="${(x + 2) * c}" y="${(y + 2) * c}" width="${3 * c}" height="${3 * c}"/>`;
  return `<svg viewBox="0 0 ${size} ${size}" width="100%" height="100%" fill="#2B1E14">${o}</svg>`; }

// ---------- screens ----------
const SCREENS = {
  home() {
    const feat = ['eiffel', 'florence', 'tokyo'].map(k => { const t = TRIPS[k]; return `<button class="feat" data-act="feat" data-k="${k}"><div class="img" style="background-image:url('${t.img}')"><span class="tag">Featured</span></div><div class="body"><b>${t.title}</b><span class="small">${t.meta}</span><div style="display:flex;gap:8px;align-items:center;margin-top:4px">${badge(k === 'tokyo' ? 'Caution' : 'Safe')}<span class="perk">${k === 'tokyo' ? 'Perk: tasting menu' : 'Perk: free local guide'}</span></div></div></button>`; }).join('');
    const trip = S.booking ? `<button class="option" data-act="go" data-to="ticket"><span class="t"><b>Your next trip</b><span>${esc(S.booking.place)} · ${esc(S.booking.date)}</span></span>${badge('Safe')}</button>` : '';
    return `${status()}<div class="content" style="padding-bottom:120px">
      <div><h1 class="display">Where to next?</h1><p class="sub">Book a trip to any moment in time</p></div>${trip}
      <div style="display:flex;justify-content:space-between;align-items:center"><h2 class="h3" style="font-size:17px">Featured trips</h2><button class="link" data-act="toast" data-msg="More trips coming soon">See all</button></div>
      <div class="carousel">${feat}</div>
      <div class="assist-card"><b style="font-size:16px">Not sure where to go?</b><p class="small">Answer 2 quick questions and we'll suggest safe, fun trips</p>${btn('accent small', 'Help me choose', 'go', 'data-to="assist"')}</div>
      ${btn('primary', 'Plan my own trip', 'plan')}</div>
      <nav class="menu">${[['home', 'Home'], ['plan', 'Plan'], ['trips', 'Trips'], ['profile', 'Profile']].map(([k, l]) => `<button class="${k === 'home' ? 'on' : ''}" data-act="menu" data-k="${k}">${svgIcon(ICON[k])}${l}</button>`).join('')}</nav>`;
  },
  assist() {
    const list = Object.entries(TRIPS).filter(([, t]) => (S.when === 'Either' || (S.when === 'Past') === t.past) && (S.interests.size === 0 || t.tags.some(x => S.interests.has(x))));
    return `${status()}${topbar('Help me choose')}<div class="content">
      <h2 class="h3">Past or future?</h2><div class="chips">${['Past', 'Future', 'Either'].map(w => `<button class="chip ${S.when === w ? 'on' : ''}" data-act="when" data-v="${w}">${w}</button>`).join('')}</div>
      <h2 class="h3">What do you enjoy?</h2><div class="chips">${['Art', 'Sport', 'Food', 'Nature', 'Science', 'Festivals'].map(w => `<button class="chip ${S.interests.has(w) ? 'on' : ''}" data-act="interest" data-v="${w}">${w}</button>`).join('')}</div>
      <h2 class="h3" style="font-size:17px">Suggestions for you</h2>
      ${list.length ? list.map(([k, t]) => `<button class="trip" data-act="suggest" data-k="${k}"><img src="${t.img}" alt=""><span class="t"><b>${t.title}</b><span>${t.short}</span><i>${t.why}</i></span>${badge(k === 'tokyo' ? 'Caution' : 'Safe')}</button>`).join('') : '<p class="small">No safe trips match yet. Try another interest.</p>'}
      <p class="small muted">Dangerous times are never suggested</p></div>`;
  },
  pick() {
    const e = validate(); const amtMax = S.unit === 'Hours' ? 12 : 14;
    return `${status()}${topbar('Plan your trip')}<div class="content" style="gap:10px">
      <h2 class="h3">When</h2>
      <div class="seg">${['BC', 'AD'].map(v => `<button class="${S.era === v ? 'on' : ''}" data-act="era" data-v="${v}">${v}</button>`).join('')}</div>
      <div class="row">
        <div class="field ${e.year ? 'err' : ''}" style="flex:1.3"><label for="f-year">Year (${S.era})</label><input id="f-year" inputmode="numeric" value="${S.year}" data-in="year"></div>
        <div class="field"><label for="f-month">Month</label><div class="select-wrap"><select id="f-month" data-in="month">${MONTHS.map((m, i) => `<option value="${i + 1}" ${S.month === i + 1 ? 'selected' : ''}>${m}</option>`).join('')}</select>${ICON.chev}</div></div>
        <div class="field ${e.day ? 'err' : ''}" style="flex:.85"><label for="f-day">Day</label><input id="f-day" inputmode="numeric" value="${S.day}" data-in="day"></div>
      </div>
      <p class="tiny" id="years-ago">${e.year || e.day ? `<span class="err-text">${esc(e.year || 'Day must be ' + e.day)}</span>` : yearsAgo()}</p>
      <div class="time-row"><div class="field"><label for="f-time">Time</label><input id="f-time" type="time" value="${S.time}" data-in="time"></div><p class="tiny">Local time at the destination</p></div>
      <h2 class="h3">Where</h2>
      <div class="field ${e.place ? 'err' : ''}"><div class="search">${ICON.search}<input id="f-place" value="${esc(S.place)}" data-in="place" autocomplete="off" aria-label="Destination"></div></div>
      <div id="suggest"></div>
      <div class="map plain" aria-hidden="true"></div>
      <h2 class="h3">How long</h2>
      <div class="seg">${['Hours', 'Days', 'Open-ended'].map(v => `<button class="${S.unit === v ? 'on' : ''}" data-act="unit" data-v="${v}">${v}</button>`).join('')}</div>
      ${S.unit === 'Open-ended' ? '<p class="small">No set return time. Extra cost applies.</p>' : `<div class="stepper"><button data-act="amt" data-d="-1" aria-label="Less" ${S.amount <= 1 ? 'disabled' : ''}>${ICON.minus}</button><b>${S.amount} ${S.unit === 'Hours' ? 'h' : S.amount > 1 ? 'days' : 'day'}</b><button data-act="amt" data-d="1" aria-label="More" ${S.amount >= amtMax ? 'disabled' : ''}>${ICON.plus}</button></div>`}
      <div class="summary hero"><span class="tiny">You'll arrive in</span><span class="place" id="sum-place">${esc(S.place)}</span><span class="small" id="sum-detail">${esc(summary())}</span></div>
    </div><div class="actions">${btn('primary', 'Check destination', 'check', Object.keys(e).length ? 'disabled' : '')}</div>`;
  },
  report() {
    const sf = safety(); const w = weather(), wr = wear(); const lv = sf.level; S.lastLevel = lv;
    let mid = '';
    if (lv === 'Safe') mid = `<h2 class="h3">Safety</h2>${badge('Safe')}<p class="small">${sf.body}</p><div class="divider"></div>`;
    else mid = `<div class="alert ${lv}">${badge(lv)}<b>${esc(sf.title)}</b><p>${esc(sf.body)}</p></div>` +
      (sf.alts.length ? `<h2 class="h3">${lv === 'Blocked' ? 'Try these instead' : 'Safer times nearby'}</h2>` + sf.alts.map((a, i) => `<button class="option" data-act="alt" data-i="${i}"><span class="t"><b>${a.t}</b><span>${a.s}</span></span>${badge(a.lv)}</button>`).join('') : '') +
      (lv === 'Caution' ? check(S.riskOk, 'I understand the risk and want to keep this time', 'risk') : `<p class="small muted">Blocked trips can't be booked</p>`);
    const info = lv === 'Blocked' ? '' : `<h2 class="h3">Weather</h2><div class="weather"><span class="temp">${w.t}</span><div><div class="small" style="color:var(--text)">${w.a}</div><div class="small">${w.b}</div></div></div>
      <h2 class="h3">What to wear</h2><ul class="bullets">${wr.list.map(x => `<li>${esc(x)}</li>`).join('')}</ul><div>${btn('accent small', 'View more ›', 'wear')}</div>
      <h2 class="h3">Don't bring</h2><ul class="bullets">${wr.dont.map(x => `<li>${esc(x)}</li>`).join('')}</ul>`;
    const actions = lv === 'Blocked' ? btn('secondary', 'Change destination', 'back')
      : `<button class="link" data-act="back">Change destination</button>${btn('primary', 'Continue', 'go', `data-to="review" ${lv === 'Caution' && !S.riskOk ? 'disabled' : ''}`)}`;
    return `${status()}${topbar('Destination report')}<div class="content"><div class="summary"><span class="place">${esc(S.place)}</span><span class="small">${esc(summary())}</span></div>${mid}${info}</div><div class="actions">${actions}</div>`;
  },
  review() {
    const days = slotDays();
    return `${status()}${topbar('Review & book')}<div class="content">
      <div class="summary"><div class="top"><span class="place">${esc(S.place)}</span><button class="link" data-act="edit">Edit</button></div><span class="small">${esc(summary())}</span></div>
      <div><div class="detail"><span>Safety</span>${badge(S.lastLevel || 'Safe')}</div><div class="detail"><span>Weather</span>${weather().t} · ${weather().a.split(' · ')[0]}</div>
      <div class="detail"><span>What to wear</span><button class="link" data-act="wear" style="padding:0">See guide ›</button></div><div class="detail"><span>Total</span><b style="font-size:17px">฿${price().toLocaleString('en-US')}</b></div></div>
      <h2 class="h3">Choose your office slot</h2>
      <div class="tiles">${days.map((d, i) => `<button class="tile ${S.slotDay === i ? 'on' : ''}" data-act="day" data-i="${i}">${d.dow}<b>${d.d}</b></button>`).join('')}</div>
      <div class="times">${SLOT_TIMES.map((t, i) => `<button class="chip ${S.slotTime === i ? 'on' : ''}" data-act="time" data-i="${i}">${t}</button>`).join('')}</div>
      <p class="small">Time Machine office · arrive 15 min early</p>
      <div class="optin">${check(S.optIn, 'Share my trip with partner agencies to get offers (optional)', 'optin')}<p class="tiny" style="padding-left:30px">We share your name, destination and time. You can turn this off anytime.</p></div>
      <p class="tiny muted">You can book without sharing</p></div>
      <div class="actions"><p class="tiny">Press and hold for 1 second</p><button class="btn primary" id="hold"><span class="progress"></span><span class="label">Hold to confirm booking</span></button></div>`;
  },
  ticket() {
    const b = S.booking;
    return `${status()}<div class="content"><h1 class="h1">Your ticket</h1>
      <div class="ticket">${b ? `<div class="qr">${qrSvg(144)}</div><span class="small">Booking ${b.id}</span><div class="dash"></div>
        <div class="grid2"><div class="kv"><span>Check-in in</span><b class="big" id="checkin">…</b></div><div class="kv"><span>Office slot</span><b>${esc(b.slot)}</b></div></div>
        <div class="kv" style="width:100%"><span>Destination</span><b>${esc(b.place)} · ${esc(b.date)}</b></div>` : '<p class="small">No trips booked yet</p>'}</div>
      ${b ? `<h2 class="h3">Before you go</h2>${['Wear what the guide suggests', 'Arrive 15 min early', 'Bring your ID'].map((l, i) => check(S.checklist[i], l, 'cl" data-i="' + i)).join('')}` : ''}
    </div><div class="actions">${b ? `${btn('secondary', 'Directions to office', 'toast', 'data-msg="Opening maps…"')}<button class="link" data-act="start">Check in at the office (demo)</button>` : btn('primary', 'Plan a trip', 'plan')}</div>`;
  },
  trip() {
    const t = S.trip;
    return `${status('10:45')}<div class="content"><div><h1 class="h1">In-trip</h1><p class="sub">${esc(S.place)} · ${esc(dateText())}</p></div>
      <div class="count"><span class="small">Time left</span><span class="time" id="left">${t.total ? hms(t.left) : 'Open-ended'}</span><div class="bar"><i id="bar" style="width:${t.total ? (1 - t.left / t.total) * 100 : 0}%"></i></div><span class="tiny">${t.total ? 'Auto-return when the timer ends' : 'Return whenever you are ready'}</span></div>
      <div style="display:flex;justify-content:space-between;align-items:center"><div><h2 class="h3" style="margin:0">Safety now</h2><p class="small" id="safety-now">${t.alert ? 'Storm nearby, stay close to the pick-up point' : 'No alerts near you'}</p></div><span id="badge-now">${badge(t.alert ? 'Caution' : 'Safe')}</span></div>
      <h2 class="h3">Pick-up point</h2><div class="map" style="background-image:url('${P.champ}')"></div>
      <div><b style="font-size:14px">Champ de Mars · 120 m</b><p class="small">Be here 5 min before return</p></div></div>
      <div class="actions">${btn('danger', 'Return now', 'return')}</div>`;
  },
  returned() {
    return `${status('13:42')}<div class="content" style="align-items:center;text-align:center">
      <div class="success"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#2F6B45" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-10"/></svg></div>
      <h1 class="display" style="margin:0">Back in ${NOW_YEAR}</h1><p class="sub">Returned safely from ${esc(S.place.split(',')[0])}, ${S.year}${S.era === 'BC' ? ' BC' : ''}</p>
      <div class="summary" style="width:100%;text-align:left"><span class="tiny">Your trip</span><span class="place">${esc(S.place)} · ${esc(dateText())}</span><span class="small">${esc(stayText())} · Back on time</span></div>
      <h2 class="h3" style="margin-top:12px">Rate your trip</h2><div class="stars">${[1, 2, 3, 4, 5].map(i => `<button data-act="rate" data-i="${i}" aria-label="${i} stars">${ICON.star(i <= S.rating)}</button>`).join('')}</div>
      ${S.rating ? '<p class="small">Thanks for your feedback</p>' : ''}</div>
      <div class="actions">${btn('primary', 'Back to home', 'home')}</div>`;
  },
};

// ---------- sheets ----------
function sheet(html, onClose) {
  closeSheet(); const scr = $('.screen.active'); if (!scr) return;
  const sc = document.createElement('div'); sc.className = 'scrim'; const sh = document.createElement('div'); sh.className = 'sheet';
  sh.innerHTML = `<span class="handle"></span>${html}`; sc.onclick = () => { closeSheet(); onClose && onClose(); };
  scr.append(sc, sh);
}
function closeSheet() { document.querySelectorAll('.scrim,.sheet').forEach(n => n.remove()); }
function openEndedSheet() {
  let ok = false;
  const draw = () => sheet(`${badge('Caution')}<h2 class="h2">Open-ended stay</h2><p class="sub">No set return time. Please read before you continue.</p>
    <ul class="bullets"><li>No automatic return. You ask for return from the app or watch</li><li>Higher risk: safety is checked only for the first 48 h</li><li style="color:var(--copper);font-weight:600">Extra cost: +฿8,000 per extra day (charged after you return)</li></ul>
    ${check(ok, 'I accept the higher risk and extra cost', 'oe-ok')}${btn('primary', 'Accept & continue', 'oe-accept', ok ? '' : 'disabled')}${btn('secondary', 'Choose a fixed time', 'oe-cancel')}`, () => {});
  draw(); ACT['oe-ok'] = () => { ok = !ok; draw(); }; ACT['oe-accept'] = () => { S.unit = 'Open-ended'; closeSheet(); rerender(); }; ACT['oe-cancel'] = () => closeSheet();
}
function wearSheet() { const wr = wear(), w = weather(); const imgs = [[P.coat, 'Wool coat'], [P.skirt, 'Long skirt'], [P.suit, 'Suit & waistcoat'], [P.boots, 'Leather boots']];
  sheet(`<div style="display:flex;justify-content:space-between;align-items:center"><h2 class="h2">What to wear</h2><button class="icon-btn" data-act="close" aria-label="Close">${ICON.close}</button></div>
    <p class="small">${esc(S.place.split(',')[0])} · ${esc(dateText())} · ${w.t}, ${w.a.split(' · ')[0].toLowerCase()}</p>
    <div class="outfits">${imgs.map(([s, n]) => `<div class="outfit"><img src="${s}" alt="${n}"><b>${n}</b></div>`).join('')}</div>
    <h2 class="h3">Blend in</h2><ul class="bullets"><li>Hats are common for men and women</li><li>Neutral colours: black, brown, navy</li></ul>
    <h2 class="h3">Don't bring</h2><ul class="bullets"><li>Visible phone, keep it in an inner pocket</li>${wr.dont.map(x => `<li>${esc(x)}</li>`).join('')}</ul>${btn('primary', 'Got it', 'close')}`); }
function dangerSheet() { S.trip.alert = true; refreshTrip();
  sheet(`${ICON.warn}<h2 class="h2">Storm approaching</h2><p>Strong wind and heavy rain expected near you in about 40 min</p><p class="small">Time left on your trip: ${S.trip.total ? hms(S.trip.left).slice(0, 5) : 'open-ended'}</p>
    ${btn('danger-fill', 'Return now', 'return-now')}${btn('secondary', 'Move to safe point', 'safe-point')}`); }
function confirmReturn() { sheet(`<h2 class="h2">Return to ${NOW_YEAR} now?</h2><p class="sub">Your trip will end and you'll go back to the office.</p>${btn('danger-fill', 'Return now', 'return-now')}${btn('secondary', 'Stay a bit longer', 'close')}`); }
function notify(title, body) { document.querySelectorAll('.notif').forEach(n => n.remove()); const n = document.createElement('button'); n.className = 'notif';
  n.innerHTML = `<span class="meta"><i></i>TIME MACHINE · now</span><b>${esc(title)}</b><span class="small" style="color:var(--text)">${esc(body)}</span>`; n.onclick = () => n.remove();
  $('.screen.active').appendChild(n); later(() => n.remove(), 6000); }

// ---------- router ----------
function render(name, dir) {
  clearTimers(); closeSheet();
  const app = $('#app'), old = $('.screen.active');
  const el = document.createElement('section'); el.className = 'screen active'; el.dataset.name = name; el.innerHTML = SCREENS[name]();
  if (old) old.classList.remove('active');
  if (old && dir) { app.appendChild(el); el.classList.add(dir === 'back' ? 'in-back' : 'in-fwd'); old.classList.add(dir === 'back' ? 'out-back' : 'out-fwd'); setTimeout(() => old.remove(), 330); }
  else { if (old) old.remove(); app.appendChild(el); }
  cur = name; mount(name, el);
}
function go(name) { stack.push(cur); render(name, 'fwd'); }
function back() { if (stack.length) render(stack.pop(), 'back'); }
function rerender() { const el = $('.screen.active'); const y = el && $('.content', el) ? $('.content', el).scrollTop : 0; el.innerHTML = SCREENS[cur](); clearTimers(); mount(cur, el); if ($('.content', el)) $('.content', el).scrollTop = y; }
function mount(name, el) {
  if (name === 'pick') { drawSuggest(); }
  if (name === 'review') holdButton($('#hold', el));
  if (name === 'ticket' && S.booking) { const tick = () => { const ms = S.booking.at - Date.now(); const d = Math.floor(ms / 864e5), h = Math.floor(ms / 36e5) % 24, m = Math.floor(ms / 6e4) % 60; const n = $('#checkin'); if (n) n.textContent = ms > 0 ? `${d}d ${pad(h)}h ${pad(m)}m` : 'Now'; }; tick(); every(tick, 1000); }
  if (name === 'trip') { every(() => { const t = S.trip; if (!t.total) return; t.left = Math.max(0, t.left - 1); refreshTrip(); if (t.left === 600 && !t.r10) { t.r10 = true; notify('10 min left', 'Head to your pick-up point: Champ de Mars, 120 m'); } if (t.left === 0) go('returned'); }, 1000);
    if (!S.trip.alertShown) later(() => { S.trip.alertShown = true; dangerSheet(); }, 3000); }
}
function refreshTrip() { const t = S.trip; const l = $('#left'), b = $('#bar'); if (l && t.total) l.textContent = hms(t.left); if (b && t.total) b.style.width = (1 - t.left / t.total) * 100 + '%';
  const s = $('#safety-now'), bn = $('#badge-now'); if (s) s.textContent = t.alert ? 'Storm nearby, stay close to the pick-up point' : 'No alerts near you'; if (bn) bn.innerHTML = badge(t.alert ? 'Caution' : 'Safe'); }
function holdButton(b) { if (!b) return; const bar = $('.progress', b); let start = 0, raf = 0;
  const stop = () => { cancelAnimationFrame(raf); bar.style.width = '0'; start = 0; };
  const step = t => { if (!start) start = t; const p = Math.min(1, (t - start) / 1000); bar.style.width = p * 100 + '%'; if (p < 1) raf = requestAnimationFrame(step); else { stop(); book(); } };
  b.addEventListener('pointerdown', e => { e.preventDefault(); raf = requestAnimationFrame(step); });
  ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => b.addEventListener(ev, () => { if (start && raf) { stop(); toast('Keep holding to confirm'); } }));
  b.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); book(); } }); }
function book() { const d = slotDays()[S.slotDay], t = SLOT_TIMES[S.slotTime]; const [hh, mm] = t.split(':').map(Number); const at = new Date(d.date); at.setHours(hh, mm, 0, 0);
  S.booking = { id: 'TM-' + (2400 + Math.floor(Math.random() * 99)), slot: `${d.dow} ${d.d} · ${t}`, place: S.place.split(',')[0], date: `${dateText()} · ${S.time} · ${stayText().replace('Stay ', '')}`, at: at.getTime() };
  stack.length = 0; stack.push('home'); render('ticket', 'fwd'); toast('Booking confirmed'); }
function drawSuggest() { const box = $('#suggest'); if (!box) return; const q = S.place.trim().toLowerCase(); const list = PLACES.filter(p => p.toLowerCase().includes(q) && p !== S.place).slice(0, 4);
  box.innerHTML = q && list.length && !PLACES.includes(S.place) ? `<div class="suggest">${list.map(p => `<button data-act="place" data-v="${esc(p)}">${esc(p)}</button>`).join('')}</div>` : ''; }
function liveSummary() { const e = validate(); const sp = $('#sum-place'), sd = $('#sum-detail'), ya = $('#years-ago'), cb = $('.screen.active [data-act="check"]');
  if (sp) sp.textContent = S.place; if (sd) sd.textContent = summary(); if (ya) ya.innerHTML = e.year || e.day ? `<span class="err-text">${esc(e.year || 'Day must be ' + e.day)}</span>` : yearsAgo();
  if (cb) cb.disabled = Object.keys(e).length > 0;
  [['year', e.year], ['day', e.day], ['place', e.place]].forEach(([k, v]) => { const f = $(`[data-in="${k}"]`); if (f) f.closest('.field').classList.toggle('err', !!v); }); }

// ---------- actions ----------
const ACT = {
  back, go: b => go(b.dataset.to), toast: b => toast(b.dataset.msg), close: () => closeSheet(),
  plan: () => { S.riskOk = false; go('pick'); },
  home: () => { S.trip = null; S.rating = 0; stack.length = 0; render('home', 'back'); },
  menu: b => { const k = b.dataset.k; if (k === 'plan') ACT.plan(); else if (k === 'trips') go('ticket'); else if (k === 'profile') toast('Profile is not part of this prototype'); },
  feat: b => { Object.assign(S, TRIPS[b.dataset.k].set, { riskOk: false }); go('report'); },
  suggest: b => { Object.assign(S, TRIPS[b.dataset.k].set, { riskOk: false }); go('pick'); },
  when: b => { S.when = b.dataset.v; rerender(); },
  interest: b => { const v = b.dataset.v; S.interests.has(v) ? S.interests.delete(v) : S.interests.add(v); rerender(); },
  era: b => { S.era = b.dataset.v; rerender(); },
  unit: b => { const v = b.dataset.v; if (v === 'Open-ended') return openEndedSheet(); S.unit = v; S.amount = Math.min(S.amount, v === 'Hours' ? 12 : 14); rerender(); },
  amt: b => { S.amount += +b.dataset.d; rerender(); },
  place: b => { S.place = b.dataset.v; rerender(); },
  check: () => { S.riskOk = false; go('report'); },
  alt: b => { const a = safety().alts[+b.dataset.i]; Object.assign(S, a.set); S.riskOk = false; rerender(); toast('Trip updated'); },
  risk: () => { S.riskOk = !S.riskOk; rerender(); },
  wear: () => wearSheet(),
  edit: () => { stack.length = 0; stack.push('home'); render('pick', 'back'); },
  day: b => { S.slotDay = +b.dataset.i; rerender(); },
  time: b => { S.slotTime = +b.dataset.i; rerender(); },
  optin: () => { S.optIn = !S.optIn; rerender(); },
  cl: b => { const i = +b.dataset.i; S.checklist[i] = !S.checklist[i]; rerender(); },
  start: () => { const total = S.unit === 'Open-ended' ? 0 : S.amount * (S.unit === 'Hours' ? 3600 : 86400); S.trip = { total, left: total, alert: false, alertShown: false }; stack.length = 0; render('trip', 'fwd'); },
  return: () => confirmReturn(),
  'return-now': () => { closeSheet(); render('returned', 'fwd'); },
  'safe-point': () => { closeSheet(); if (S.trip.total) S.trip.left = Math.min(S.trip.left, 601); refreshTrip(); toast('Route to safe point shown on the map'); },
  rate: b => { S.rating = +b.dataset.i; rerender(); },
};
document.addEventListener('click', e => { const a = e.target.closest('[data-act]'); if (!a || a.disabled) return; const f = ACT[a.dataset.act]; if (f) f(a); });
document.addEventListener('input', e => { const k = e.target.dataset && e.target.dataset.in; if (!k) return; const v = e.target.value;
  if (k === 'year' || k === 'day') S[k] = parseInt(v.replace(/\D/g, ''), 10) || 0; else if (k === 'month') S.month = +v; else S[k] = v;
  if (k === 'place') drawSuggest(); liveSummary(); });
document.addEventListener('change', e => { if (e.target.dataset && e.target.dataset.in === 'month') { S.month = +e.target.value; liveSummary(); } });
let sx = null; addEventListener('touchstart', e => { const t = e.touches[0]; sx = t.clientX < 24 ? t.clientX : null; }, { passive: true });
addEventListener('touchend', e => { if (sx !== null && e.changedTouches[0].clientX - sx > 80 && stack.length) back(); sx = null; });

render('home');
