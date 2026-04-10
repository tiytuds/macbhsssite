/* ═══════════════════════════════════════════════════════════════
   committee.js — Shared logic for all individual committee pages
   Requires: const COMMITTEE_ID = '...'; defined before this script
═══════════════════════════════════════════════════════════════ */

const _MK = 'bhss_members_' + COMMITTEE_ID;
const _RK = 'bhss_resources_' + COMMITTEE_ID;

function _getData(key) {
  let local = [];
  try { local = JSON.parse(localStorage.getItem(key) || '[]'); } catch(e) {}
  const base = key === _MK
    ? (window.BHSS_MEMBERS?.[COMMITTEE_ID] || [])
    : (window.BHSS_RESOURCES?.[COMMITTEE_ID] || []);
  const baseIds = new Set(base.map(m => m.id));
  return [...local.filter(m => !baseIds.has(m.id)), ...base];
}

function _esc(s) {
  return String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ── RENDER RESOURCES ──
function renderResources() {
  const el = document.getElementById('resourceList');
  if (!el) return;
  const items = _getData(_RK);
  if (!items.length) {
    el.innerHTML = '<p class="resource-empty">No resources added yet.</p>';
    return;
  }
  el.innerHTML = items.map(r => `
    <div class="resource-item">
      <div class="resource-icon">
        <img src="../assets/images/BHSSshield_100x97.png" alt="" />
      </div>
      <a class="resource-link" href="${_esc(r.url)}" target="_blank" rel="noopener">${_esc(r.title)}</a>
    </div>`).join('');
}

// ── RENDER MEMBERS ──
function renderMembers() {
  const members = _getData(_MK);
  const coords  = members.filter(m => m.isCoordinator);
  const rest    = members.filter(m => !m.isCoordinator);

  const coordEl = document.getElementById('coordinatorCard');
  if (coordEl) {
    coordEl.innerHTML = coords.length
      ? coords.map(m => _cardHTML(m, true)).join('')
      : '<p class="people-empty">No coordinator set yet.</p>';
  }

  const gridEl = document.getElementById('membersGrid');
  if (gridEl) {
    gridEl.innerHTML = rest.length
      ? rest.map(m => _cardHTML(m, false)).join('')
      : '<p class="people-empty" style="grid-column:1/-1">No members added yet.</p>';
  }
}

function _cardHTML(m, large) {
  const cls   = large ? 'person-card coordinator' : 'person-card';
  const photo = m.photo
    ? `<img class="person-photo" src="${_esc(m.photo)}" alt="" />`
    : `<div class="person-shield-bg"><img src="../assets/images/BHSSshield_100x97.png" alt="" /></div>`;
  return `<div class="${cls}">
    <div class="person-card-top">${photo}<div class="person-firstname">${_esc(m.firstName)}</div></div>
    <div class="person-card-bottom">
      <div class="person-lastname">${_esc(m.lastName)}</div>
      <div class="person-role">${_esc(m.role)}</div>
    </div>
  </div>`;
}

// ── AUTO-HIGHLIGHT ACTIVE SUB-NAV TAB ──
(function () {
  const current = location.pathname.split('/').pop();
  document.querySelectorAll('.comm-tab').forEach(t => {
    if ((t.getAttribute('href') || '') === current) t.classList.add('active');
  });
})();

// ── INIT ──
renderResources();
renderMembers();
