// The Time Machine · Watch + CMS views and the mode switcher (uses globals from app.js)
'use strict';

const dev = $('#device');
let mode = 'app', appScreen = 'home', wIndex = 0;
const SIZE = { app: [393 + 24, 852 + 24], watch: [198 + 40, 242 + 40], cms: [1440, 1024] };

function fitDevice() {
  if (innerWidth <= 520) { dev.style.transform = ''; return; }
  const st = $('#stage'), [w, h] = SIZE[mode];
  const k = Math.min((st.clientWidth - 48) / w, (st.clientHeight - 48) / h, mode === 'watch' ? 2 : 1);
  dev.style.transform = `scale(${k})`;
}
function setMode(m) {
  if (mode === 'app') appScreen = cur || 'home';
  clearTimers(); closeSheet(); document.querySelectorAll('.modal-back, .w-hint').forEach(n => n.remove());
  mode = m; dev.className = m === 'app' ? '' : m;
  document.querySelectorAll('#modes button').forEach(b => b.classList.toggle('on', b.dataset.mode === m));
  if (m === 'app') { $('#app').innerHTML = ''; render(appScreen); }
  else if (m === 'watch') renderWatch();
  else renderCMS();
  fitDevice();
}
document.querySelectorAll('#modes button').forEach(b => b.onclick = () => setMode(b.dataset.mode));
addEventListener('resize', fitDevice);

// ---------- Watch ----------
const WARN = '<svg class="warn" viewBox="0 0 24 24" fill="none" stroke="#EF6A62" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"><path d="M12 3l10 17H2z M12 9v4 M12 16.5v.5"/></svg>';
const CHECK = '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#7FD19B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-10"/></svg>';
function watchScreens() {
  const t = S.trip, b = S.booking;
  const ticket = b
    ? `<span class="lab">Your ticket</span><div class="qr">${qrSvg(64)}</div><span class="t1">${esc(b.slot)}</span><span class="t2" id="w-checkin">Check-in soon</span>`
    : `<span class="lab">Your ticket</span><span class="t1">No trips booked</span><span class="t2">Book a trip on your phone</span><button class="wbtn ghost" data-act="w-demo">Start demo trip</button>`;
  const count = t
    ? `<span class="lab">Time left</span><span class="big" id="w-left">${t.total ? hms(t.left).slice(t.left >= 3600 ? 0 : 3) : 'Open'}</span><span class="t2">Pick-up · 120 m</span><button class="wbtn" data-act="w-return">Return now</button>`
    : S.returned ? `${CHECK}<span class="t1">Back in ${NOW_YEAR}</span><span class="t2">Trip finished</span>`
    : `<span class="lab">Time left</span><span class="t1">No active trip</span><button class="wbtn ghost" data-act="w-demo">Start demo trip</button>`;
  const alert = t && t.alert
    ? `${WARN}<span class="t1">Storm in 40 min</span><span class="t2">Return to stay safe</span><button class="wbtn red" data-act="w-return">Return now</button>`
    : `<span class="lab">Safety now</span><span class="t1" style="color:#7FD19B">● Safe</span><span class="t2">No alerts near you</span>`;
  return [ticket, count, alert];
}
function renderWatch() {
  const scr = watchScreens();
  $('#app').innerHTML = `<div class="w" data-act="w-next">${scr[wIndex]}</div><div class="w-dots">${scr.map((_, i) => `<button class="${i === wIndex ? 'on' : ''}" data-act="w-dot" data-i="${i}" aria-label="Screen ${i + 1}"></button>`).join('')}</div>`;
  if (!$('.w-hint', dev)) dev.insertAdjacentHTML('beforeend', '<span class="w-hint">Tap the screen or the dots to switch</span>');
  clearTimers();
  every(() => {
    const t = S.trip;
    if (t && t.total) { t.left = Math.max(0, t.left - 1); const n = $('#w-left'); if (n) n.textContent = hms(t.left).slice(t.left >= 3600 ? 0 : 3); }
    if (S.booking) { const n = $('#w-checkin'); if (n) { const ms = S.booking.at - Date.now(); n.textContent = ms > 0 ? `Check-in in ${Math.floor(ms / 864e5)}d ${Math.floor(ms / 36e5) % 24}h` : 'Check in now'; } }
  }, 1000);
  if (S.trip && !S.trip.alertShown) later(() => { if (mode !== 'watch' || !S.trip) return; S.trip.alertShown = true; S.trip.alert = true; wIndex = 2; renderWatch(); }, 3000);
}
function endTrip() { S.trip = null; S.returned = true; appScreen = 'returned'; }
Object.assign(ACT, {
  'w-next': e => { if (e.target.closest('button')) return; wIndex = (wIndex + 1) % 3; renderWatch(); },
  'w-dot': b => { wIndex = +b.dataset.i; renderWatch(); },
  'w-demo': () => { book(true); const total = 3 * 3600; S.trip = { total, left: total, alert: false, alertShown: false }; S.returned = false; appScreen = 'trip'; wIndex = 1; renderWatch(); toast('Demo trip started'); },
  'w-return': () => { endTrip(); wIndex = 1; renderWatch(); toast(`Returning to ${NOW_YEAR}`); },
});
// The watch screen itself has data-act="w-next"; make sure clicks on it pass the event target
document.addEventListener('click', e => { const w = e.target.closest('.w'); if (w && !e.target.closest('button') && mode === 'watch') { wIndex = (wIndex + 1) % 3; renderWatch(); } }, true);
ACT['w-next'] = () => {};

// ---------- CMS ----------
const CMS = {
  page: 'travelers', filter: 'All', q: '',
  rows: [
    { n: 'Anna K.', id: 'TM-2481', d: 'Paris · 31 Mar 1889', s: 'In-trip', r: '13:00 local', a: 'Storm in 40 min' },
    { n: 'Ben T.', id: 'TM-2479', d: 'Kyoto · 1600', s: 'In-trip', r: '12:10 local', a: '—' },
    { n: 'Finn O.', id: 'TM-2470', d: 'Rome · 80 AD', s: 'Alert', r: 'Overdue 5 min', a: 'Not at pick-up point' },
    { n: 'Dara P.', id: 'TM-2490', d: 'Tokyo · 2150', s: 'Checked-in', r: '15:30 local', a: '—' },
    { n: 'Elena R.', id: 'TM-2492', d: 'Cairo · 1922', s: 'Booked', r: '—', a: '—' },
    { n: 'Chai S.', id: 'TM-2475', d: 'Florence · 1504', s: 'Returned', r: '—', a: '—' },
    { n: 'Grace L.', id: 'TM-2488', d: 'London · 1851', s: 'Booked', r: '—', a: '—' },
    { n: 'Hiro M.', id: 'TM-2466', d: 'Paris · 1889', s: 'Returned', r: '—', a: '—' },
  ],
  events: [
    { n: 'Eiffel Tower opening', p: 'Paris · 31 Mar 1889', lv: 'Safe', ag: 'Belle Époque Tours', b: 32, live: true, img: P.eiffel },
    { n: 'Florence art studios', p: 'Florence · 1504', lv: 'Safe', ag: 'Renaissance Trails', b: 18, live: true, img: P.florence },
    { n: 'Colosseum opening games', p: 'Rome · 80 AD', lv: 'Caution', ag: 'Roma Antica Travel', b: 9, live: true, img: P.rome },
    { n: 'Future food market', p: 'Tokyo · 2150', lv: 'Caution', ag: 'Not assigned', b: 0, live: false, img: P.tokyo },
    { n: 'Storming of the Bastille', p: 'Paris · 14 Jul 1789', lv: 'Blocked', ag: '—', b: 0, live: false, img: '' },
  ],
};
const isAlert = r => r.s === 'Alert' || (r.a && r.a !== '—');
function cmsRows() {
  const rows = [...CMS.rows];
  if (S.booking) rows.unshift({ you: true, n: 'You (demo)', id: S.booking.id, d: S.booking.place + ' · ' + S.year + (S.era === 'BC' ? ' BC' : ''),
    s: S.trip ? (S.trip.alert ? 'In-trip' : 'In-trip') : S.returned ? 'Returned' : 'Booked',
    r: S.trip ? (S.trip.total ? 'in ' + hms(S.trip.left).slice(0, 5) : 'Open-ended') : '—', a: S.trip && S.trip.alert ? 'Storm in 40 min' : '—' });
  return rows.sort((a, b) => isAlert(b) - isAlert(a));
}
function renderCMS() {
  const nav = ['Traveler monitor', 'Bookings', 'Users', 'Featured events', 'Danger zones', 'Partners', 'Settings'];
  const on = CMS.page === 'travelers' ? 'Traveler monitor' : 'Featured events';
  $('#app').innerHTML = `<div class="cms"><aside><div class="logo">${svgIcon(ICON.plan).replace('currentColor', '#9C5B1F')}Time Machine CMS</div>
    ${nav.map(n => `<button class="nav ${n === on ? 'on' : ''}" data-act="c-nav" data-v="${n}">${n}</button>`).join('')}</aside><main id="cms-main"></main></div>`;
  drawCMS();
}
function drawCMS() {
  const m = $('#cms-main'); if (!m) return;
  if (CMS.page === 'travelers') {
    const all = cmsRows(); const cnt = s => all.filter(r => r.s === s).length;
    const q = CMS.q.trim().toLowerCase();
    const rows = all.filter(r => (CMS.filter === 'All' || r.s === CMS.filter || (CMS.filter === 'Alert' && isAlert(r))) && (!q || (r.n + r.id + r.d).toLowerCase().includes(q)));
    m.innerHTML = `<div class="head"><div><h1>Traveler monitor</h1><p class="sub">Today · updates live</p></div><div class="field search"><div class="search">${ICON.search}<input id="c-q" placeholder="Search traveler or booking ID" value="${esc(CMS.q)}" aria-label="Search"></div></div></div>
      <div class="stats"><div class="stat"><span>Booked</span><b>${cnt('Booked') + 16}</b></div><div class="stat"><span>In-trip now</span><b>${cnt('In-trip') + cnt('Alert')}</b></div><div class="stat"><span>Returned today</span><b>${cnt('Returned') + 13}</b></div><div class="stat alert"><span>Needs attention</span><b>${all.filter(isAlert).length}</b></div></div>
      <div class="chips">${['All', 'Booked', 'Checked-in', 'In-trip', 'Returned', 'Alert'].map(f => `<button class="chip ${CMS.filter === f ? 'on' : ''}" data-act="c-filter" data-v="${f}">${f}</button>`).join('')}</div>
      <table><thead><tr><th>Traveler</th><th>Booking ID</th><th>Destination</th><th>Status</th><th>Return at</th><th>Alerts</th><th>Action</th></tr></thead><tbody id="c-body">${rowsHtml(rows)}</tbody></table>
      <p class="small">Showing ${rows.length} of ${all.length + 37} travelers · Alerts are sorted to the top${S.booking ? ' · Your demo booking is highlighted' : ''}</p>`;
    const qi = $('#c-q'); qi.addEventListener('input', () => { CMS.q = qi.value; const pos = qi.selectionStart; drawCMS(); const n = $('#c-q'); n.focus(); n.setSelectionRange(pos, pos); });
    clearTimers(); if (S.trip) every(() => { if (S.trip && S.trip.total) S.trip.left = Math.max(0, S.trip.left - 1); const b = $('#c-body'); if (b && !CMS.q) b.innerHTML = rowsHtml(cmsRows().filter(r => CMS.filter === 'All' || r.s === CMS.filter || (CMS.filter === 'Alert' && isAlert(r)))); }, 1000);
  } else {
    m.innerHTML = `<div class="head"><div><h1>Featured events</h1><p class="sub">Trips promoted on Home and in Assist</p></div><button class="btn primary mid" data-act="toast" data-msg="The event form is not part of this prototype"><span class="label">+ Add event</span></button></div>
      <table><thead><tr><th>Event</th><th>Time & place</th><th>Safety</th><th>Partner agency</th><th>Bookings</th><th>Status</th><th>Live</th></tr></thead><tbody>
      ${CMS.events.map((e, i) => { const bl = e.lv === 'Blocked'; return `<tr><td class="strong ${bl ? 'muted' : ''}">${e.img ? `<img class="thumb" src="${e.img}" alt="">` : '<span class="thumb" style="display:inline-block"></span>'}${esc(e.n)}</td><td class="${bl ? 'muted' : ''}">${esc(e.p)}</td><td>${badge(e.lv)}</td><td class="${e.ag === 'Not assigned' || bl ? 'muted' : ''}">${esc(e.ag)}</td><td class="${bl ? 'muted' : ''}">${e.b}</td>
        <td>${bl ? '<span class="red" style="color:var(--blocked);font-weight:600">Can\'t publish</span>' : `<span class="pill ${e.live ? 'Live' : 'Draft'}">${e.live ? 'Live' : 'Draft'}</span>`}</td>
        <td>${bl ? '<span class="muted">—</span>' : `<button class="toggle ${e.live ? 'on' : ''}" data-act="c-live" data-i="${i}" role="switch" aria-checked="${e.live}" aria-label="Publish ${esc(e.n)}"></button>`}</td></tr>`; }).join('')}</tbody></table>
      <div class="rules"><b>Rules</b><span class="small">Events must pass the safety check before they go live. Partner agencies only receive data from travelers who opted in.</span></div>`;
  }
}
function rowsHtml(rows) {
  if (!rows.length) return `<tr><td colspan="7" class="empty">No travelers match this filter</td></tr>`;
  return rows.map(r => { const a = isAlert(r); return `<tr class="${a ? 'alert' : ''} ${r.you ? 'you' : ''}"><td class="strong">${esc(r.n)}</td><td class="muted">${esc(r.id)}</td><td>${esc(r.d)}</td><td><span class="pill ${r.s}">${r.s}</span></td>
    <td class="${a && r.r !== '—' ? 'red' : r.r === '—' ? 'muted' : ''}">${esc(r.r)}</td><td class="${a ? 'red' : 'muted'}">${esc(r.a)}</td>
    <td>${a ? `<button class="btn danger-fill small" data-act="c-recall" data-id="${r.id}"><span class="label">Recall</span></button>` : `<button class="link" data-act="toast" data-msg="Traveler details are not part of this prototype">View</button>`}</td></tr>`; }).join('');
}
function modal(html) { const m = document.createElement('div'); m.className = 'modal-back'; m.innerHTML = `<div class="modal">${html}</div>`; m.addEventListener('click', e => { if (e.target === m) m.remove(); }); $('.cms').appendChild(m); }
Object.assign(ACT, {
  'c-nav': b => { const v = b.dataset.v; if (v === 'Traveler monitor') CMS.page = 'travelers'; else if (v === 'Featured events') CMS.page = 'events'; else return toast(`${v} is not part of this prototype`); renderCMS(); },
  'c-filter': b => { CMS.filter = b.dataset.v; drawCMS(); },
  'c-live': b => { const e = CMS.events[+b.dataset.i]; e.live = !e.live; drawCMS(); toast(e.live ? `${e.n} is live` : `${e.n} moved to draft`); },
  'c-recall': b => { const id = b.dataset.id; const r = cmsRows().find(x => x.id === id);
    modal(`<h2>Recall ${esc(r.n)}?</h2><p class="sub">The machine will pull them back to ${NOW_YEAR} now. This can't be undone.</p><div class="row"><button class="btn secondary mid" data-act="c-cancel"><span class="label">Cancel</span></button><button class="btn danger-fill mid" data-act="c-confirm" data-id="${id}"><span class="label">Recall now</span></button></div>`); },
  'c-cancel': () => document.querySelectorAll('.modal-back').forEach(n => n.remove()),
  'c-confirm': b => { const id = b.dataset.id; document.querySelectorAll('.modal-back').forEach(n => n.remove());
    if (S.booking && S.booking.id === id) endTrip(); else { const r = CMS.rows.find(x => x.id === id); Object.assign(r, { s: 'Returned', r: '—', a: '—' }); }
    drawCMS(); toast('Traveler recalled safely'); },
});

// book() helper used by the watch demo: create a booking without leaving the current view
const _book = book;
book = function (silent) { if (silent !== true) return _book(); const d = slotDays()[S.slotDay], tm = SLOT_TIMES[S.slotTime]; const [hh, mm] = tm.split(':').map(Number); const at = new Date(d.date); at.setHours(hh, mm, 0, 0);
  S.booking = { id: 'TM-' + (2400 + Math.floor(Math.random() * 99)), slot: `${d.dow} ${d.d} · ${tm}`, place: S.place.split(',')[0], date: `${dateText()} · ${S.time} · ${stayText().replace('Stay ', '')}`, at: at.getTime() }; };

// keep the app's own trip end in sync with the watch / CMS
const _returnNow = ACT['return-now'];
ACT['return-now'] = () => { S.returned = true; _returnNow(); };

setMode('app');
