// Portfolio page: nav letters, copy email, card videos, project detail sheets with carousels, scroll reveals.
// The page reads fine without this file; it only adds these touches.
(function () {
  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hover = window.matchMedia('(hover: hover)').matches;

  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  var nav = document.querySelector('.nav');
  var onScroll = function () { nav.classList.toggle('scrolled', window.scrollY > 8); };
  onScroll(); window.addEventListener('scroll', onScroll, { passive: true });

  // Split nav labels into letters (screen readers keep the aria-label)
  document.querySelectorAll('.nav nav a:not(.gh)').forEach(function (a) {
    var text = a.textContent.trim();
    a.setAttribute('aria-label', text);
    a.classList.add('split');
    a.innerHTML = text.split('').map(function (ch, i) {
      return '<span aria-hidden="true" style="transition-delay:' + (i * 25) + 'ms">' + ch + '</span>';
    }).join('');
  });

  document.querySelectorAll('[data-copy]').forEach(function (btn) {
    var label = btn.textContent;
    btn.addEventListener('click', function () {
      var text = btn.getAttribute('data-copy');
      var done = function () { btn.textContent = 'Copied ✓'; setTimeout(function () { btn.textContent = label; }, 1800); };
      if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(done, function () { window.prompt('Copy this email:', text); });
      else window.prompt('Copy this email:', text);
    });
  });

  var play = function (v) { v.preload = 'auto'; var p = v.play(); if (p && p.catch) p.catch(function () {}); };

  // Card videos: play on hover with a mouse; on touch screens, while the card is on screen.
  var cardVideos = document.querySelectorAll('.card video');
  if (!reduce) {
    if (hover) {
      cardVideos.forEach(function (v) {
        var card = v.closest('.card');
        card.addEventListener('mouseenter', function () { play(v); });
        card.addEventListener('mouseleave', function () { v.pause(); });
      });
    } else if ('IntersectionObserver' in window) {
      var vio = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { e.isIntersecting ? play(e.target) : e.target.pause(); });
      }, { threshold: 0.5 });
      cardVideos.forEach(function (v) { vio.observe(v); });
    }
  } else {
    cardVideos.forEach(function (v) { v.controls = true; });
  }

  // Project detail sheets
  document.querySelectorAll('dialog.case').forEach(function (dlg) {
    var slides = dlg.querySelector('.slides');
    var dots = dlg.querySelector('.dots');
    var items = slides ? Array.prototype.slice.call(slides.children) : [];
    var setCurrent = function (i) {
      Array.prototype.forEach.call(dots.children, function (d, k) { d.setAttribute('aria-current', String(k === i)); });
      items.forEach(function (el, k) { if (el.tagName === 'VIDEO') { if (k === i && dlg.open && !reduce) play(el); else el.pause(); } });
    };
    items.forEach(function (el, i) {
      var b = document.createElement('button');
      b.type = 'button'; b.setAttribute('aria-label', 'Show slide ' + (i + 1));
      b.addEventListener('click', function () { slides.scrollTo({ left: slides.clientWidth * i, behavior: reduce ? 'auto' : 'smooth' }); });
      dots.appendChild(b);
    });
    if (slides) {
      var t;
      slides.addEventListener('scroll', function () {
        clearTimeout(t);
        t = setTimeout(function () { setCurrent(Math.round(slides.scrollLeft / slides.clientWidth)); }, 80);
      }, { passive: true });
      if (reduce) items.forEach(function (el) { if (el.tagName === 'VIDEO') el.controls = true; });
    }
    dlg.querySelector('[data-close]').addEventListener('click', function () { dlg.close(); });
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); }); // click on the dimmed backdrop
    dlg.addEventListener('close', function () { items.forEach(function (el) { if (el.tagName === 'VIDEO') el.pause(); }); });
    dlg.__open = function () {
      dlg.showModal();
      dlg.querySelector('.case-scroll').scrollTop = 0;
      if (slides) { slides.scrollLeft = 0; setCurrent(0); }
    };
  });
  // Clicking a project card (or its "View project details" button) opens its sheet.
  // Only the small round icons are real links out to the live site and GitHub.
  var openSheet = function (id) { var dlg = document.getElementById(id); if (dlg && dlg.showModal) dlg.__open(); };
  document.querySelectorAll('button[data-open]').forEach(function (btn) {
    btn.addEventListener('click', function () { openSheet(btn.getAttribute('data-open')); });
  });
  document.querySelectorAll('.card[data-open]').forEach(function (card) {
    card.addEventListener('click', function (e) {
      if (e.target.closest('a, button')) return;
      openSheet(card.getAttribute('data-open'));
    });
  });

  if (reduce || !('IntersectionObserver' in window)) return;
  root.classList.add('js');
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -6% 0px' });
  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
})();
