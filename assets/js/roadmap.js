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
