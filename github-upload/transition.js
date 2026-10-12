/* =====================================================================
   ПЕРЕХОДЫ МЕЖДУ СТРАНИЦАМИ — лёгкие и символические:
   старая страница гаснет в тёмный фон с небольшим сдвигом,
   новая проявляется из темноты с таким же небольшим сдвигом.

   Направление сдвига — по схеме сайта:
            [ главная ]
                 ↓
     [ коммерческие ] ⇄ [ коллекция ] ⇄ [ обо мне ]
   главная → раздел: всё чуть уезжает вверх (и обратно — вниз);
   между разделами: чуть влево / вправо.
   коммерческие → проект и коллекция → работа: зум внутрь с затемнением (обратно — зум наружу).
   Остальные переходы — просто затемнение.

   Анимируются только opacity, translate и scale — это дёшево для браузера.
   Подключение: <script src="transition.js"></script> в <head> каждой страницы.
   ===================================================================== */
(() => {
  const KEY = 'vb_tr';
  const OUT_MS = 260, IN_MS = 400;
  // насколько сдвигается страница, px: на компьютере 144, на телефоне ~15% ширины экрана
  const SHIFT = Math.min(144, Math.round(innerWidth * 0.15));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- где стоит каждая страница на схеме: [столбец, ряд] ---- */
  const MAP = {
    'index.html':            [0, 0],
    'commercial.html':       [0, 1],
    'collection.html':       [1, 1],
    'collection-strip.html': [1, 1],
    'about.html':            [2, 1],
  };
  // какой переход играть: down / up / left / right — сдвиг по схеме,
  // zin / zout — зум из списка проектов в проект и обратно, иначе null — просто затемнение
  const page = url => {
    try { return new URL(url, location.href).pathname.split('/').pop() || 'index.html'; }
    catch (e) { return ''; }
  };
  function dirBetween(from, to) {
    const pf = page(from), pt = page(to);
    if (pf === 'commercial.html' && pt === 'project.html') return 'zin';
    if (pf === 'project.html' && pt === 'commercial.html') return 'zout';
    if (pf === 'collection.html' && pt === 'work.html') return 'zin';
    if (pf === 'work.html' && pt === 'collection.html') return 'zout';
    const a = MAP[pf], b = MAP[pt];
    if (!a || !b) return null;
    const dx = b[0] - a[0], dy = b[1] - a[1];
    if (dy) return dy > 0 ? 'down' : 'up';
    if (dx) return dx > 0 ? 'right' : 'left';
    return null;
  }
  /* для каждого перехода: сдвиг (единичный вектор, откуда приходит новая страница)
     и масштаб — куда уходит старая (out) и откуда приходит новая (in) */
  const ZOOM = 0.1;
  const FX = {
    down:  { v: [0, 1] },  up:   { v: [0, -1] },
    right: { v: [1, 0] },  left: { v: [-1, 0] },
    fade:  { v: [0, 0] },
    zin:   { v: [0, 0], out: 1 + ZOOM, in: 1 - ZOOM },   // «камера» въезжает в проект
    zout:  { v: [0, 0], out: 1 - ZOOM, in: 1 + ZOOM },   // и отъезжает обратно к списку
  };

  /* ---------------------------- стили ---------------------------- */
  // гаснет вся страница, а двигается / масштабируется всё, кроме фона (.bg) — иначе у края
  // экрана видна граница фона. Через свойства translate и scale, чтобы не спорить
  // с transform-анимациями самих элементов.
  // Начальная прозрачность не 0: при полностью прозрачной странице Chrome считает,
  // что показывать нечего, и держит старый кадр ~0,5 с (paint holding) — был «фриз».
  const shift = (d, k) => `${FX[d].v[0] * SHIFT * k}px ${FX[d].v[1] * SHIFT * k}px`;
  const MOVE = 'body > :not(.bg)';
  const style = document.createElement('style');
  style.textContent = Object.keys(FX).map(d => `
  html.vb-in-${d} body { opacity: .01; }
  html.vb-in-${d} ${MOVE} { translate: ${shift(d, 1)};${FX[d].in ? ` scale: ${FX[d].in};` : ''} }
  body.vb-out-${d} { opacity: 0; }
  body.vb-out-${d} > :not(.bg) { translate: ${shift(d, -1)};${FX[d].out ? ` scale: ${FX[d].out};` : ''} }`).join('') + `
  body.vb-leaving { transition: opacity ${OUT_MS}ms ease-in; pointer-events: none; }
  body.vb-leaving > :not(.bg) { transition: translate ${OUT_MS}ms ease-in, scale ${OUT_MS}ms ease-in; }
  body.vb-entering { transition: opacity ${IN_MS}ms ease-out; }
  body.vb-entering > :not(.bg) { transition: translate ${IN_MS}ms cubic-bezier(.2, .8, .2, 1), scale ${IN_MS}ms cubic-bezier(.2, .8, .2, 1); }
  /* пришли переходом — страница сразу видна, её собственное проявление не нужно */
  html.vb-arrived .page { opacity: 1 !important; }`;
  document.head.appendChild(style);

  /* ---- приход: страница проявляется из темноты ---- */
  let incoming = null;
  try { incoming = sessionStorage.getItem(KEY); sessionStorage.removeItem(KEY); } catch (e) {}
  const html = document.documentElement;
  if (incoming && FX[incoming] && !reduce) {
    html.classList.add('vb-arrived', `vb-in-${incoming}`);
    const reveal = () => {
      document.body.getBoundingClientRect();    // зафиксировать начальное состояние, чтобы анимация стартовала
      document.body.classList.add('vb-entering');
      html.classList.remove(`vb-in-${incoming}`);
      setTimeout(() => document.body.classList.remove('vb-entering'), IN_MS + 50);
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', reveal);
    else reveal();
  }

  /* ---- уход: страница гаснет со сдвигом, потом переход ---- */
  let leaving = false;
  // hint — направление сдвига, если его не вывести из схемы (например, соседняя карточка)
  function go(url, hint) {
    if (leaving) return;
    if (reduce) { location.href = url; return; }
    leaving = true;
    const d = (FX[hint] && hint) || dirBetween(location.href, url) || 'fade';
    try { sessionStorage.setItem(KEY, d); } catch (e) {}
    document.body.classList.add('vb-leaving', `vb-out-${d}`);
    setTimeout(() => { location.href = url; }, OUT_MS);
  }
  window.vbGo = go;

  // вернулись кнопкой «назад» браузера — страница снова видна
  addEventListener('pageshow', e => {
    if (!e.persisted) return;
    leaving = false;
    document.body.className = document.body.className.replace(/\bvb-(leaving|out-\w+)\b/g, '').trim();
  });

  /* ---- перехват внутренних ссылок ---- */
  document.addEventListener('click', e => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = e.target.closest('a[href]');
    if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
    const href = a.getAttribute('href');
    if (/^(mailto:|tel:|https?:|#)/i.test(href)) return;
    e.preventDefault();
    go(a.href, a.dataset.dir);
  });
})();
