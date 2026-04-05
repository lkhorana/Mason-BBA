// ── SHARED UTILITIES ────────────────────────────────────────────────────────

function esc(str) {
  return String(str)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function hl(text, term) {
  if (!term) return text;
  const re = new RegExp('(' + term.replace(/[.*+?^${}()|[\]\\]/g,'\\$&') + ')','gi');
  return text.replace(re,'<mark style="background:#fff3cd;padding:1px 2px;border-radius:2px">$1</mark>');
}

function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

// ── EXPIRY FLAG ──────────────────────────────────────────────────────────────
function flagPill(days) {
  if (days < 0)         return '<span class="flag-pill flag-red">EXPIRED</span>';
  if (days <= 90)       return '<span class="flag-pill flag-amber">EXPIRING SOON</span>';
  if (days <= 180)      return '<span class="flag-pill flag-amber">EXPIRING &lt;6 mo</span>';
  return                       '<span class="flag-pill flag-green">Active</span>';
}

function syllabusLink(r) {
  // If notes contains a real URL (student-submitted), show that as green "Student submitted"
  if (r.notes && r.notes.startsWith('http')) {
    return `<a href="${esc(r.notes)}" target="_blank" class="syllabus-link submitted">Student submitted ↗</a>`;
  }
  // Otherwise fall back to Google search
  return `<a href="${esc(r.syllabus)}" target="_blank" class="syllabus-link search">Search for syllabus ↗</a>`;
}

// ── FAQ ACCORDION ────────────────────────────────────────────────────────────
function toggleFAQ(btn) {
  const ans = btn.nextElementSibling;
  const isOpen = btn.classList.contains('open');
  document.querySelectorAll('.faq-q.open').forEach(b => {
    b.classList.remove('open');
    b.nextElementSibling.classList.remove('open');
  });
  if (!isOpen) { btn.classList.add('open'); ans.classList.add('open'); }
}

function faqItemHTML(q, searchTerm) {
  const color = FAQ_COLORS[q.cat] || '#8A8A8A';
  const hq = searchTerm ? hl(esc(q.q), searchTerm) : esc(q.q);
  const ha = searchTerm ? hl(esc(q.a), searchTerm) : esc(q.a);
  return `
    <div class="faq-item">
      <button class="faq-q" onclick="toggleFAQ(this)">
        <span class="faq-ql">
          <span class="faq-dot" style="background:${color}"></span>${hq}
        </span>
        <span class="faq-chev">&#9660;</span>
      </button>
      <div class="faq-ans">${ha}</div>
    </div>`;
}

function renderFAQ(containerId, countId, items, searchTerm, activeCat) {
  const container = document.getElementById(containerId);
  const countEl   = document.getElementById(countId);
  if (!container) return;

  const s = (searchTerm || '').toLowerCase();
  const filtered = items.filter(q => {
    const catMatch = !activeCat || activeCat === 'all' || q.cat === activeCat;
    const txtMatch = !s || q.q.toLowerCase().includes(s) || q.a.toLowerCase().includes(s);
    return catMatch && txtMatch;
  });

  if (countEl) countEl.textContent = s ? `${filtered.length} result${filtered.length !== 1 ? 's' : ''}` : '';

  if (!filtered.length) {
    container.innerHTML = '<div class="no-results"><h3>No results found</h3><p>Try different keywords or clear the search.</p></div>';
    return;
  }

  // Flat list when searching or filtering, grouped when browsing all
  if (s || (activeCat && activeCat !== 'all')) {
    container.innerHTML = `<div class="faq-list">${filtered.map(q => faqItemHTML(q, s)).join('')}</div>`;
  } else {
    let html = '';
    FAQ_CAT_ORDER.forEach(cat => {
      const catItems = filtered.filter(q => q.cat === cat);
      if (!catItems.length) return;
      html += `<div class="cat-section">
        <div class="cat-label">${cat} — ${catItems.length} answers</div>
        <div class="faq-list">${catItems.map(q => faqItemHTML(q, '')).join('')}</div>
      </div>`;
    });
    container.innerHTML = html;
  }
}

// ── TRANSFER CREDIT TABLE ────────────────────────────────────────────────────
function renderTCTable(tbodyId, emptyId, countId, records, searchTerm, flagFilter, equivFilter) {
  const s = (searchTerm || '').toLowerCase();
  const filtered = records.filter(r => {
    const sm = !s || r.uni.toLowerCase().includes(s) || r.course.toLowerCase().includes(s) || r.equiv.toLowerCase().includes(s);
    const ff = !flagFilter || flagFilter === 'all' || r.flag === flagFilter;
    const ef = !equivFilter || equivFilter === 'all'
      || (equivFilter === 'equiv' && r.equiv !== 'Not equivalent')
      || (equivFilter === 'not'   && r.equiv === 'Not equivalent');
    return sm && ff && ef;
  });

  const body  = document.getElementById(tbodyId);
  const empty = document.getElementById(emptyId);
  const count = document.getElementById(countId);
  if (count) count.textContent = `Showing ${filtered.length} of ${records.length} decisions`;
  if (!body) return;

  if (!filtered.length) {
    body.innerHTML = '';
    if (empty) empty.style.display = 'block';
    return;
  }
  if (empty) empty.style.display = 'none';

  const display = filtered.slice(0, 250);
  body.innerHTML = display.map(r => `
    <tr>
      <td style="font-size:12px;color:var(--text);max-width:170px">${esc(r.uni)}</td>
      <td style="max-width:210px;color:var(--text);font-size:12.5px;line-height:1.4">${esc(r.course)}</td>
      <td style="font-size:12px;max-width:180px">${r.equiv === 'Not equivalent'
        ? '<span style="color:var(--lt);font-style:italic">Not equivalent</span>'
        : esc(r.equiv)}</td>
      <td class="mono">${r.expires}</td>
      <td>${flagPill(parseInt(r.days))}</td>
      <td>${syllabusLink(r)}</td>
    </tr>`).join('');

  if (filtered.length > 250) {
    body.innerHTML += `<tr><td colspan="6" style="text-align:center;padding:12px;font-size:12px;color:var(--lt)">${filtered.length - 250} more — narrow your search to see them.</td></tr>`;
  }
}

function exportTCCSV(records) {
  const rows = [['Institution','Course','W&M Equivalent','Expires','Status','Syllabus']];
  records.forEach(r => rows.push([r.uni, r.course, r.equiv, r.expires, r.flag, r.syllabus]));
  const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');
  const a = document.createElement('a');
  a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
  a.download = 'transfer_credits.csv';
  a.click();
  showToast('CSV downloaded.');
}

// ── ANNOUNCEMENTS ────────────────────────────────────────────────────────────
function renderAnnouncements(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = ANNOUNCEMENTS.map((a, i) => {
    const catClass = a.cat === 'Newsletter' ? 'pill-green' : a.cat === 'Event' ? 'pill-blue' : 'pill-amber';
    const preview = a.body.split('\n').filter(l => l.trim()).slice(0,2).join(' ').substring(0,160);
    return `
      <div class="ann-card" onclick="toggleAnn(${i})">
        <div class="ann-top">
          <div class="ann-title">
            <span class="pill ${catClass}" style="margin-right:8px;font-size:9px">${esc(a.cat)}</span>${esc(a.title)}
          </div>
          <div class="ann-date">${a.date}</div>
        </div>
        <div class="ann-prev">${esc(preview)}…</div>
        <div class="ann-body" id="ann-body-${i}">${esc(a.body)}</div>
        <div class="ann-tog" id="ann-tog-${i}">Read more ▾</div>
      </div>`;
  }).join('');
}

function toggleAnn(i) {
  const body = document.getElementById('ann-body-'+i);
  const tog  = document.getElementById('ann-tog-'+i);
  const open = body.classList.toggle('open');
  tog.textContent = open ? 'Collapse ▴' : 'Read more ▾';
}

// ── GUIDANCE 4-STEP FORM ─────────────────────────────────────────────────────
const ADVISOR_MAP = {
  'Admissions / Application Requirements': { type: 'Pre-Admissions Advisor',     cal: 'admissions-advising' },
  'Course Planning & Registration':        { type: 'Academic Advisor',            cal: 'course-planning'     },
  'Transfer Credit Evaluation':            { type: 'Transfer Credit Coordinator', cal: 'transfer-credit'     },
  'Pass/Fail Request':                     { type: 'Academic Advisor',            cal: 'pass-fail'           },
  'Graduation Planning & Timeline':        { type: 'Graduation Advisor',          cal: 'graduation-planning' },
  'Study Abroad Planning':                 { type: 'Academic Advisor + Reves Center', cal: 'study-abroad'   },
  'Major / Concentration Change':          { type: 'Academic Advisor',            cal: 'major-change'        },
  'Other':                                 { type: 'General Academic Advisor',    cal: 'general-advising'    },
};

let gCurrentStep = 1;
let gSelectedTopic = '';
let gCalUrl = '';

function gSetStep(step) {
  gCurrentStep = step;
  for (let i = 1; i <= 4; i++) {
    const s = document.getElementById('gstep-' + i);
    const p = document.getElementById('gps-' + i);
    if (s) s.classList.toggle('active', i === step);
    if (p) {
      p.classList.remove('active','done');
      if (i === step) p.classList.add('active');
      else if (i < step) p.classList.add('done');
    }
  }
}

function gNext(from) {
  if (from === 1) {
    const req = ['g-fn','g-ln','g-email','g-id','g-major','g-grad'];
    for (const id of req) {
      const el = document.getElementById(id);
      if (!el || !el.value.trim()) { alert('Please fill in all required fields including Student ID.'); return; }
    }
  }
  if (from === 2) {
    if (!gSelectedTopic) { alert('Please select a topic.'); return; }
  }
  if (from === 3) {
    const desc = document.getElementById('g-desc');
    if (!desc || !desc.value.trim()) { alert('Please describe your situation.'); return; }
    gBuildSummary();
  }
  gSetStep(from + 1);
}

function gBack(from) { gSetStep(from - 1); }

function gSelectTopic(el, topic) {
  document.querySelectorAll('.topic-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  gSelectedTopic = topic;
}

function gBuildSummary() {
  const fn    = document.getElementById('g-fn').value;
  const ln    = document.getElementById('g-ln').value;
  const email = document.getElementById('g-email').value;
  const sid   = document.getElementById('g-id').value;
  const maj   = document.getElementById('g-major').value;
  const grad  = document.getElementById('g-grad').value;
  const day   = document.getElementById('g-day').value;
  const time  = document.getElementById('g-time').value;
  const fmt   = document.getElementById('g-format').value;
  const desc  = document.getElementById('g-desc').value;
  const att   = document.getElementById('g-attach') ? document.getElementById('g-attach').value : '';

  const adv = ADVISOR_MAP[gSelectedTopic] || { type: 'General Academic Advisor', cal: 'general-advising' };

  const rows = [
    ['Student Name',       `${fn} ${ln}`],
    ['Student ID',         sid],
    ['W&M Email',          email],
    ['Major / Concentration', maj],
    ['Graduation Term',    grad],
    ['Topic',              gSelectedTopic],
    ['Advisor Type',       adv.type],
    ['Preferred Time',     `${day}, ${time} — ${fmt}`],
    ['Description',        desc],
    ['Attachments / Links',att || 'None'],
  ];

  const sumEl = document.getElementById('g-sum');
  if (sumEl) {
    sumEl.innerHTML = rows.map(r =>
      `<div class="sum-row"><span class="sum-lbl">${esc(r[0])}</span><span class="sum-val">${esc(r[1])}</span></div>`
    ).join('');
  }

  const params = new URLSearchParams({
    name: `${fn} ${ln}`, email, a1: gSelectedTopic,
    a2: `${maj} | ${grad} | ID: ${sid}`,
    a3: desc.substring(0, 200)
  });
  gCalUrl = `https://calendly.com/mason-bba/${adv.cal}?${params.toString()}`;
}

function gOpenCal() { if (gCalUrl) window.open(gCalUrl, '_blank'); }

function gReset() {
  ['g-fn','g-ln','g-email','g-id','g-desc','g-attach'].forEach(id => {
    const el = document.getElementById(id); if (el) el.value = '';
  });
  ['g-major','g-grad','g-day','g-time','g-format'].forEach(id => {
    const el = document.getElementById(id); if (el) el.selectedIndex = 0;
  });
  gSelectedTopic = '';
  document.querySelectorAll('.topic-card').forEach(c => c.classList.remove('selected'));
  gSetStep(1);
}
