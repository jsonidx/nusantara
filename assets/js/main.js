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
