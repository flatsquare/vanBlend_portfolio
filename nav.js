/* =====================================================================
   ВЕРХНЯЯ ПАНЕЛЬ НАВИГАЦИИ — для всех страниц, кроме главной.
   Подключение: <script src="nav.js" data-current="commercial"></script>
   data-current: commercial | collection | about
   data-parent:  раздел, внутри которого открыта страница (например, проект внутри
                 commercial) — пункт подсвечен линией, но кликается, чтобы вернуться
   ===================================================================== */
(() => {
  const ITEMS = [
    { id: 'home',       label: 'главная',                 href: 'index.html#menu' },
    { id: 'commercial', label: 'коммерческие<br>проекты', href: 'commercial.html' },
    { id: 'collection', label: 'коллекция',               href: 'collection.html' },
    { id: 'about',      label: 'обо мне',                 href: 'about.html' }
  ];

  const current = document.currentScript?.dataset.current || '';
  const parent = document.currentScript?.dataset.parent || '';

  /* ---------------------------- стили ----------------------------
     тот же «язык», что у меню на главной: голый текст,
     при наведении под пунктом вырастает фиолетовая вертикальная линия */
  const css = `
  .vb-nav {
    position: fixed; top: clamp(14px, 2.6vh, 26px); left: 0; right: 0; z-index: 50;
    pointer-events: none;               /* панель во всю ширину, но кликаются только пункты */
    transform: translateY(-12px); opacity: 0;
    animation: vbNavIn .8s cubic-bezier(.2, .8, .2, 1) .15s forwards;
    font-family: "Jost", "Futura", "Century Gothic", sans-serif; font-weight: 400;
    display: flex; flex-direction: column; align-items: center;
  }
  @keyframes vbNavIn { to { transform: none; opacity: 1; } }
  /* пришли переходом с другой страницы — меню проявляется вместе со страницей (см. transition.js) */
  html.vb-arrived .vb-nav { animation: none; transform: none; opacity: 1; }

  .vb-grid { pointer-events: auto; }

  /* зона меню — только для меню: контент страницы начинается ниже,
     а всё, что заезжает выше (например, карточки карусели), растворяется
     и полностью пропадает на нижней границе меню (--vb-nav-h считается в measure()) */
  main.page {
    padding-top: calc(var(--vb-nav-h, 110px) + var(--vb-fade, 40px));
    -webkit-mask-image: linear-gradient(transparent var(--vb-nav-h, 110px), #000 calc(var(--vb-nav-h, 110px) + var(--vb-fade, 40px)));
            mask-image: linear-gradient(transparent var(--vb-nav-h, 110px), #000 calc(var(--vb-nav-h, 110px) + var(--vb-fade, 40px)));
  }
  /* все пункты — одинаковые прямоугольники в сетке из трёх равных колонок:
     «главная» (без рамки) над средней, разделы в ряд под ней; всё по центру экрана */
  .vb-grid {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 4px 14px;
  }
  .vb-nav ul { display: contents; list-style: none; }
  .vb-nav li { position: relative; display: grid; list-style: none; grid-row: 2; }

  .vb-nav .fx {
    position: relative;
    display: grid; place-items: center;
    min-height: 44px; padding: 8px 20px;
    font: inherit; font-size: 16px; line-height: 1.3;
    letter-spacing: .2em; text-transform: uppercase; text-align: center;
    background: none; border: 0; cursor: pointer; text-decoration: none;
    white-space: nowrap;
  }
  /* прозрачный прямоугольник с серой рамкой */
  .vb-nav .box {
    border: 1px solid rgba(255, 255, 255, .22); border-radius: 2px;
    transition: border-color .3s ease;
  }
  .vb-nav .box:hover, .vb-nav .box:focus-visible { border-color: rgba(255, 255, 255, .5); }
  /* вертикальная фиолетовая линия под прямоугольником: вырастает снизу вверх, к рамке */
  .vb-nav .fx::before {
    content: ""; position: absolute; left: 50%; top: 100%;
    width: 1px; height: 20px; margin-left: -.5px;
    background: #9d5cff; box-shadow: 0 0 10px #9d5cff;
    transform: scaleY(0); transform-origin: 50% 100%;
    transition: transform .45s cubic-bezier(.65, 0, .35, 1);
  }
  .vb-nav .fx .t { color: var(--c, #fff); }
  .vb-nav .fx:hover::before, .vb-nav .fx:focus-visible::before { transform: scaleY(1); }
  .vb-nav .fx:focus-visible { outline: none; }

  /* текущая страница: серый текст, линия стоит постоянно, не кликается */
  .vb-nav [aria-current="page"] { --c: rgba(255, 255, 255, .5); cursor: default; pointer-events: none; }
  .vb-nav [aria-current="page"]::before { transform: scaleY(1); }
  /* раздел, внутри которого мы сейчас: линия стоит, но по пункту можно вернуться */
  .vb-nav .parent::before { transform: scaleY(1); }

  /* «главная» — над средним пунктом, как главная страница над разделами на схеме:
     крупнее и плотнее, при наведении чуть увеличивается */
  .vb-nav .home {
    grid-column: 2; grid-row: 1;
    font-size: 19px; font-weight: 500; letter-spacing: .32em;
    transition: transform .35s cubic-bezier(.34, 1.56, .64, 1), border-color .3s ease;
  }
  .vb-nav .home::before { display: none; }
  .vb-nav .home .t { color: #fff; }
  .vb-nav .home:hover, .vb-nav .home:focus-visible { transform: scale(1.05); }

  @media (max-width: 760px) {
    .vb-nav { left: 8px; right: 8px; }
    .vb-grid { width: 100%; gap: 6px; }
    .vb-nav .fx { font-size: 11px; letter-spacing: .1em; padding: 6px 4px; }
    .vb-nav .home { font-size: 13px; letter-spacing: .26em; }
    .vb-nav .fx::before { height: 14px; }
  }
  @media (prefers-reduced-motion: reduce) {
    .vb-nav, .vb-nav * { animation: none !important; transition: none !important; }
    .vb-nav { opacity: 1; transform: none; }
  }`;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  // жирное начертание Jost для «главной» (на страницах подключены только 200–400)
  const font = document.createElement('link');
  font.rel = 'stylesheet';
  font.href = 'https://fonts.googleapis.com/css2?family=Jost:wght@500&display=swap';
  document.head.appendChild(font);

  /* ---------------------------- разметка ---------------------------- */
  const nav = document.createElement('nav');
  nav.className = 'vb-nav';
  nav.setAttribute('aria-label', 'Навигация по сайту');
  const home = ITEMS.find(it => it.id === 'home');
  nav.innerHTML = `<div class="vb-grid"><a class="fx home" href="${home.href}">`
    + `<span class="t">${home.label}</span></a>`
    + '<ul>' + ITEMS.filter(it => it !== home).map(it => {
    const cur = it.id === current;
    return `<li><a class="fx box${it.id === parent ? ' parent' : ''}" href="${it.href}"${cur ? ' aria-current="page" tabindex="-1"' : ''}><span class="t">${it.label}</span></a></li>`;
  }).join('') + '</ul></div>';
  document.body.prepend(nav);

  /* ---------------------------- высота зоны меню ---------------------------- */
  function measure() {
    // нижняя граница меню (без анимации появления) + небольшой зазор
    const navH = nav.offsetTop + nav.offsetHeight + 8;
    document.documentElement.style.setProperty('--vb-nav-h', `${Math.round(navH)}px`);
  }
  measure();
  document.fonts?.ready.then(measure);
  addEventListener('resize', measure);

})();
