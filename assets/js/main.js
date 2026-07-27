// Nusantara Brücke – shared front-end behaviour (no framework, no build step)
document.addEventListener('DOMContentLoaded', function () {

  /* Mobile nav toggle */
  var toggle = document.querySelector('.nav-toggle');
  var header = document.querySelector('.site-header');
  if (toggle && header) {
    toggle.addEventListener('click', function () {
      header.classList.toggle('open');
    });
  }
  document.querySelectorAll('.site-header.open .dropdown > a, .dropdown > .nav-link').forEach(function (a) {
    a.addEventListener('click', function (e) {
      if (window.innerWidth <= 760) {
        e.preventDefault();
        a.closest('.dropdown').classList.toggle('open');
      }
    });
  });

  /* Language switcher — swaps chrome strings via data-i18n, shows honest "in progress" note for body copy */
  var dict = {
    de: {},
    en: {
      'nav.betriebe': 'For Companies', 'nav.kandidaten': 'For Candidates', 'nav.ueberuns': 'About Us',
      'nav.wissen': 'Knowledge', 'nav.kontakt': 'Contact', 'nav.login': 'Login',
      'cta.betrieb': 'I need trainees', 'cta.kandidat': 'I want to train in Germany',
      'lang.notice': 'Navigation is available in English. Full page translations for this section are on the Phase-2 roadmap — content below is still shown in German.'
    },
    id: {
      'nav.betriebe': 'Untuk Perusahaan', 'nav.kandidaten': 'Untuk Calon Peserta', 'nav.ueberuns': 'Tentang Kami',
      'nav.wissen': 'Pengetahuan', 'nav.kontakt': 'Kontak', 'nav.login': 'Masuk',
      'cta.betrieb': 'Saya butuh peserta magang', 'cta.kandidat': 'Saya ingin ausbildung di Jerman',
      'lang.notice': 'Menu navigasi sudah tersedia dalam Bahasa Indonesia. Terjemahan lengkap halaman ini menyusul pada Fase 2 — konten di bawah masih ditampilkan dalam bahasa Jerman.'
    }
  };
  var langButtons = document.querySelectorAll('.lang-switch button');
  var notice = document.querySelector('.lang-notice');
  function applyLang(lang) {
    langButtons.forEach(function (b) { b.classList.toggle('active', b.dataset.lang === lang); });
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (lang === 'de') {
        if (el.dataset.deOriginal) el.textContent = el.dataset.deOriginal;
      } else {
        if (!el.dataset.deOriginal) el.dataset.deOriginal = el.textContent;
        if (dict[lang][key]) el.textContent = dict[lang][key];
      }
    });
    if (notice) {
      if (lang === 'de') { notice.classList.remove('show'); }
      else { notice.textContent = dict[lang]['lang.notice']; notice.classList.add('show'); clearTimeout(window._langT); window._langT = setTimeout(function(){ notice.classList.remove('show'); }, 6000); }
    }
    try { localStorage.setItem('nb-lang', lang); } catch (e) {}
  }
  langButtons.forEach(function (b) {
    b.addEventListener('click', function () { applyLang(b.dataset.lang); });
  });
  var saved = (function () { try { return localStorage.getItem('nb-lang'); } catch (e) { return null; } })();
  if (saved && saved !== 'de') applyLang(saved);

  /* Tabs component (process visualisation etc.) */
  document.querySelectorAll('.tabs').forEach(function (tabs) {
    var group = tabs.dataset.group;
    var panels = document.querySelectorAll('.tab-panel[data-group="' + group + '"]');
    tabs.querySelectorAll('.tab-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        tabs.querySelectorAll('.tab-btn').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        panels.forEach(function (p) { p.classList.toggle('active', p.dataset.tab === btn.dataset.tab); });
      });
    });
  });

  /* FAQ accordion */
  document.querySelectorAll('.faq-item .faq-q').forEach(function (q) {
    q.addEventListener('click', function () {
      q.closest('.faq-item').classList.toggle('open');
    });
  });

  /* Generic filter: data-filter-root, selects with data-filter-key, cards with data-* attributes */
  document.querySelectorAll('[data-filter-root]').forEach(function (root) {
    var controls = root.querySelectorAll('[data-filter-key]');
    var cards = root.querySelectorAll('[data-filter-card]');
    var countEl = root.querySelector('[data-filter-count]');
    function run() {
      var active = {};
      controls.forEach(function (c) { if (c.value) active[c.dataset.filterKey] = c.value; });
      var visible = 0;
      cards.forEach(function (card) {
        var match = Object.keys(active).every(function (k) {
          return (card.dataset[k] || '').indexOf(active[k]) !== -1;
        });
        card.style.display = match ? '' : 'none';
        if (match) visible++;
      });
      if (countEl) countEl.textContent = visible;
    }
    controls.forEach(function (c) { c.addEventListener('change', run); });
    run();
  });

  /* Portal sidebar navigation */
  document.querySelectorAll('.portal-nav').forEach(function (nav) {
    var views = document.querySelectorAll('.portal-view');
    nav.querySelectorAll('button[data-view]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        nav.querySelectorAll('button').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        views.forEach(function (v) { v.classList.toggle('active', v.dataset.view === btn.dataset.view); });
      });
    });
  });

  /* Demo form intercept — static prototype, no backend */
  document.querySelectorAll('form[data-demo-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var msg = form.querySelector('[data-form-success]');
      form.querySelectorAll('input,select,textarea,button').forEach(function (el) { el.disabled = true; });
      if (msg) msg.style.display = 'block';
      form.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });

});
