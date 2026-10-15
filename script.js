// Luis Lungs · Portafolio UGC
// No necesitas tocar este archivo para cambiar textos, fotos o videos.
(function () {
  document.documentElement.classList.add('js');

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Año del pie de página
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // Barra superior con fondo al hacer scroll
  var bar = document.querySelector('.topbar');
  var onScroll = function () { bar.classList.toggle('is-scrolled', window.scrollY > 40); };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Contador animado para los números (8.600, 100 mil)
  function countUp(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    if (reduceMotion || !target) return;
    var start = null, dur = 1400;
    function step(t) {
      if (!start) start = t;
      var p = Math.min((t - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toLocaleString('es-CO');
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // Aparición suave de los elementos
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        e.target.querySelectorAll('[data-count]').forEach(countUp);
        io.unobserve(e.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('is-in'); });
  }

  // Videos: solo se descargan cuando la persona toca "play" (la página carga rápido)
  var current = null;
  document.querySelectorAll('.vcard__media').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var card = btn.closest('.vcard');
      var video = btn.querySelector('video');
      if (!video) {
        video = document.createElement('video');
        video.src = btn.getAttribute('data-src');
        video.playsInline = true;
        video.setAttribute('playsinline', '');
        video.preload = 'auto';
        btn.appendChild(video);
        video.addEventListener('ended', function () { card.classList.remove('is-playing'); });
      }
      if (current && current !== video) {
        current.pause();
        current.closest('.vcard').classList.remove('is-playing');
      }
      if (video.paused) {
        video.play().then(function () {
          card.classList.add('is-playing');
          current = video;
        }).catch(function () { card.classList.remove('is-playing'); });
      } else {
        video.pause();
        card.classList.remove('is-playing');
      }
    });
  });
})();
