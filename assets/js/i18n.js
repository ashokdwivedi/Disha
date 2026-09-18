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
