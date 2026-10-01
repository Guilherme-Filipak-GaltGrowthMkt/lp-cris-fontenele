/* Cris Fontenele | Landing Page de campanha
   Barra de ação, entradas de seção, indicador do carrossel,
   fachada do vídeo e disparo da conversão no clique do WhatsApp. */
(function () {
  var d = document;
  var hasIO = 'IntersectionObserver' in window;

  // Barra fixa e bolha (no mobile): aparecem quando o hero sai da tela por cima
  var bar = d.querySelector('[data-actionbar]');
  var hero = d.querySelector('.hero');
  if (bar && hero && hasIO) {
    new IntersectionObserver(function (entries) {
      var e = entries[0];
      var past = !e.isIntersecting && e.boundingClientRect.top < 0;
      bar.hidden = !past;
      d.body.classList.toggle('past-hero', past);
    }).observe(hero);
  }

  // Entradas de seção, uma vez só.
  // Os cards do mosaico disparam mais tarde (15% acima da borda de baixo),
  // para irem surgindo um a um enquanto a pessoa rola.
  function reveal(items, opts) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      });
    }, opts);
    items.forEach(function (el) { io.observe(el); });
  }
  if (hasIO) {
    reveal(d.querySelectorAll('.reveal:not(.mosaic-card)'), { threshold: 0.15 });
    reveal(d.querySelectorAll('.mosaic-card.reveal'), { threshold: 0.3, rootMargin: '0px 0px -15% 0px' });
  }

  // Indicador de posição dos carrosséis do mobile (.rail seguido de .dots)
  d.querySelectorAll('.rail').forEach(function (track) {
    var box = track.nextElementSibling;
    if (!hasIO || !box || !box.classList.contains('dots')) return;
    var dots = box.querySelectorAll('span');
    var cards = Array.prototype.slice.call(track.children);
    var dotsIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var i = cards.indexOf(e.target);
        dots.forEach(function (dot, j) { dot.setAttribute('aria-current', i === j ? 'true' : 'false'); });
      });
    }, { root: track, threshold: 0.6 });
    cards.forEach(function (c) { dotsIO.observe(c); });
  });

  // Vídeo: o iframe só entra no DOM depois do clique
  d.querySelectorAll('.video').forEach(function (box) {
    var btn = box.querySelector('.video__play');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var f = d.createElement('iframe');
      f.src = 'https://www.youtube-nocookie.com/embed/' + box.dataset.yt + '?autoplay=1&rel=0&modestbranding=1&playsinline=1';
      f.title = 'Cristiane Fontenele explica como funciona o acompanhamento';
      f.allow = 'accelerometer; autoplay; encrypted-media; picture-in-picture';
      f.allowFullscreen = true;
      box.innerHTML = '';
      box.appendChild(f);
    }, { once: true });
  });

  // Conversão: um disparo por clique em link do WhatsApp.
  // window.WA_CONVERSION é definido no <head> junto com a tag do Google Ads.
  d.addEventListener('click', function (ev) {
    var a = ev.target.closest && ev.target.closest('a[href*="wa.me/"]');
    if (a && window.gtag && window.WA_CONVERSION) {
      window.gtag('event', 'conversion', { send_to: window.WA_CONVERSION });
    }
  });
})();
