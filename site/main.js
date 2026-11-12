// Small enhancements only: the page reads fine without this file.
(function () {
  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canWatch = 'IntersectionObserver' in window;

  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // Copy email (falls back to a prompt where the clipboard API isn't allowed)
  document.querySelectorAll('[data-copy]').forEach(function (btn) {
    var label = btn.textContent;
    btn.addEventListener('click', function () {
      var text = btn.getAttribute('data-copy');
      var done = function () {
        btn.textContent = 'Copied ✓';
        setTimeout(function () { btn.textContent = label; }, 1800);
      };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(done, function () { window.prompt('Copy this email:', text); });
      } else {
        window.prompt('Copy this email:', text);
      }
    });
  });

  // Project recordings play while they're on screen and pause when they leave it.
  // Without JS, or with reduced motion, they keep their play controls instead.
  var videos = document.querySelectorAll('.screen video');
  if (videos.length && canWatch && !reduce) {
    var vio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var v = entry.target;
        if (entry.isIntersecting) {
          v.preload = 'auto';
          var p = v.play();
          if (p && p.catch) p.catch(function () { v.controls = true; });
        } else {
          v.pause();
        }
      });
    }, { threshold: 0.35 });
    videos.forEach(function (v) { v.controls = false; vio.observe(v); });
  }

  // Fade sections up once as they scroll into view
  if (!canWatch || reduce) return;
  root.classList.add('js');
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -6% 0px' });
  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
})();
