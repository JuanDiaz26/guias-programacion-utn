/* =============================================================
   Fundamentos del Desarrollo Backend — JavaScript
   - Animaciones de aparición al hacer scroll (IntersectionObserver)
   - Resaltado del enlace activo en la navegación
   ============================================================= */

// 1) Animaciones fade-in al entrar en pantalla
(function () {
  var els = document.querySelectorAll('.reveal');

  // Fallback: si el navegador no soporta IntersectionObserver, mostrar todo.
  if (!('IntersectionObserver' in window)) {
    els.forEach(function (el) { el.classList.add('in'); });
    return;
  }

  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  els.forEach(function (el) { obs.observe(el); });
})();

// 2) Resaltado del enlace activo en la barra de navegación
(function () {
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav-links a'));
  var map = {};
  links.forEach(function (l) { map[l.getAttribute('href').slice(1)] = l; });

  var sections = document.querySelectorAll('section[id]');
  var spy = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      var link = map[e.target.id];
      if (!link) return;
      if (e.isIntersecting) {
        links.forEach(function (l) { l.style.color = ''; l.style.borderColor = ''; });
        link.style.color = 'var(--accent)';
        link.style.borderColor = 'var(--border)';
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(function (s) { spy.observe(s); });
})();
