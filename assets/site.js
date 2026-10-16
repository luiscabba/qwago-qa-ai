
(function () {
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var els = Array.prototype.slice.call(document.querySelectorAll('section h2, section > p, section > div > p, section .glass, section [data-rv], footer'));
  els = els.filter(function (e) { return !e.closest('[data-hero]') && getComputedStyle(e).position !== 'absolute' && !e.closest('.rv'); });
  els.forEach(function (e) {
    e.classList.add('rv');
    var p = e.parentElement, i = Array.prototype.indexOf.call(p.children, e);
    e.style.transitionDelay = Math.min(i, 6) * 90 + 'ms';
  });
  function countUp(el) {
    var end = parseFloat(el.getAttribute('data-count')), suf = el.getAttribute('data-suffix') || '', t0 = null;
    function step(t) { if (!t0) t0 = t; var k = Math.min(1, (t - t0) / 1400); k = 1 - Math.pow(1 - k, 3); el.textContent = Math.round(end * k) + suf; if (k < 1) requestAnimationFrame(step); }
    requestAnimationFrame(step);
  }
  if (reduce || !('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('in'); }); return; }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      en.target.classList.add('in');
      en.target.querySelectorAll('[data-count]').forEach(countUp);
      io.unobserve(en.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  els.forEach(function (e) { io.observe(e); });
  var orbs = document.querySelectorAll('.orb'), shot = document.querySelector('[data-parallax]'), tick = false;
  function onScroll() {
    tick = false; var y = window.scrollY;
    orbs.forEach(function (o, i) { o.style.translate = '0 ' + (y * (i % 2 ? 0.08 : -0.05)).toFixed(1) + 'px'; });
    if (shot) { var r = shot.getBoundingClientRect(), k = Math.max(-1, Math.min(1, r.top / window.innerHeight)); shot.style.transform = 'perspective(1600px) rotateX(' + (k * 10).toFixed(2) + 'deg) scale(' + (1 - Math.abs(k) * 0.04).toFixed(3) + ')'; }
  }
  addEventListener('scroll', function () { if (!tick) { tick = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();
})();
