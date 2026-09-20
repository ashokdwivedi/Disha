// English / Hindi text toggle, persisted across pages via localStorage.
(function () {
  var STORAGE_KEY = 'disha-lang';

  function getLang() {
    try {
      return localStorage.getItem(STORAGE_KEY) || 'en';
    } catch (e) {
      return 'en';
    }
  }

  function setLang(lang) {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      /* localStorage unavailable — language just won't persist */
    }
  }

  function applyLanguage(lang) {
    var key = lang === 'hi' ? 'hi' : 'en';

    document.querySelectorAll('[data-en]').forEach(function (el) {
      var value = el.dataset[key];
      if (value !== undefined) el.textContent = value;
    });

    document.querySelectorAll('[data-alt-en]').forEach(function (el) {
      var value = key === 'hi' ? el.dataset.altHi : el.dataset.altEn;
      if (value !== undefined) el.setAttribute('alt', value);
    });

    document.documentElement.setAttribute('lang', key === 'hi' ? 'hi' : 'en');

    document.querySelectorAll('[data-lang-toggle]').forEach(function (btn) {
      btn.setAttribute(
        'aria-label',
        key === 'hi' ? 'Switch to English' : 'हिन्दी में बदलें'
      );
      btn.classList.toggle('is-hi', key === 'hi');
    });
  }

  function init() {
    var current = getLang();
    applyLanguage(current);

    document.querySelectorAll('[data-lang-toggle]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        current = current === 'hi' ? 'en' : 'hi';
        setLang(current);
        applyLanguage(current);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

// Mobile nav toggle + active-link highlighting.
(function () {
  function init() {
    var navToggle = document.getElementById('nav-toggle');
    var siteNav = document.getElementById('site-nav');

    if (navToggle && siteNav) {
      navToggle.addEventListener('click', function () {
        var isOpen = siteNav.classList.toggle('is-open');
        navToggle.setAttribute('aria-expanded', String(isOpen));
      });
    }

    var currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.site-nav a').forEach(function (link) {
      var href = link.getAttribute('href');
      if (href === currentPage) {
        link.setAttribute('aria-current', 'page');
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

// Accessible expand/collapse for roadmap stage nodes.
// Uses the standard button + aria-expanded/aria-controls/hidden disclosure pattern.
(function () {
  function toggleStage(trigger) {
    var expanded = trigger.getAttribute('aria-expanded') === 'true';
    var panelId = trigger.getAttribute('aria-controls');
    var panel = panelId ? document.getElementById(panelId) : null;
    var stage = trigger.closest('.roadmap__stage');

    trigger.setAttribute('aria-expanded', String(!expanded));
    if (panel) panel.hidden = expanded;
    if (stage) stage.classList.toggle('is-open', !expanded);
  }

  function init() {
    document.querySelectorAll('.roadmap__trigger').forEach(function (trigger) {
      trigger.addEventListener('click', function () {
        toggleStage(trigger);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

// Fade/slide sections in as they scroll into view. Only elements that start
// below the fold get the hidden state (no flash), and visitors without JS or
// with reduced motion always see the full content.
(function () {
  if (!('IntersectionObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  function init() {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        observer.unobserve(el);
        el.classList.add('is-visible');
        // Drop the helper classes once the transition is done so hover
        // transitions on cards go back to their own timing.
        setTimeout(function () { el.classList.remove('reveal', 'is-visible'); }, 1400);
      });
    }, { threshold: 0.12 });

    document.querySelectorAll(
      '.pillar, .card, .crossover__from, .roadmap__stage, .cta-band, .section .eyebrow, .section h2'
    ).forEach(function (el) {
      if (el.getBoundingClientRect().top < window.innerHeight) return;
      el.classList.add('reveal');
      observer.observe(el);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
