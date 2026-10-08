/* =====================================================================
   ВЕРХНЯЯ ПАНЕЛЬ НАВИГАЦИИ — для всех страниц, кроме главной.
   Разделы — один уровень, они в ряд по центру; на главную (уровень выше)
   ведёт стрелка «назад» слева сверху, как на карточках проектов.
   Подключение: <script src="nav.js" data-current="commercial"></script>
   data-current: commercial | collection | about
   data-parent:  раздел, внутри которого открыта страница (например, проект внутри
                 commercial) — пункт подсвечен линией, но кликается, чтобы вернуться
   ===================================================================== */
(() => {
  const ITEMS = [
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

  .vb-grid, .vb-up { pointer-events: auto; }
  /* линия под меню — отделяет его от страницы; под текущим разделом в ней проход:
     вкладка текущей страницы «переходит» в саму страницу.
     Контур под текущей вкладкой (бока + линия + точки на стыках) — один элемент .tabline:
     внутри всё сплошное белое, а прозрачность задана ему целиком. Поэтому там, где части
     накладываются (углы, точки), цвет не становится светлее — контур ровный.
     Всё привязано к краям вкладки; измеряются только дальние концы линии (--ext-l / --ext-r) */
  .vb-nav { --drop: 26px; --inset: clamp(12px, 1.6vw, 24px); --dash: rgba(255, 255, 255, .22); }
  /* без текущего раздела — просто линия во всю ширину */
  .vb-nav:not(.has-cur)::after {
    content: ""; position: absolute; top: calc(100% + var(--drop)); height: 1px;
    left: var(--inset); right: var(--inset); background: var(--dash);
  }
  .vb-nav .tabline {
    position: absolute; left: 0; right: 0; top: 100%; height: calc(var(--drop) + 1px);
    opacity: .22; pointer-events: none;
  }
  .vb-nav .tabline::before {                 /* бока вкладки — продолжение её рамки вниз */
    content: ""; position: absolute; inset: 0;
    border-left: 1px solid #fff; border-right: 1px solid #fff;
  }
  .vb-nav .tabline::after {                  /* линия слева и справа от вкладки + точки на стыках */
    content: ""; position: absolute; height: 5px; top: calc(var(--drop) - 2px);
    left: calc(-1 * var(--ext-l, 0px)); right: calc(-1 * var(--ext-r, 0px));
    background:
      radial-gradient(circle 2.5px at calc(var(--ext-l, 0px) + .5px) 50%, #fff 92%, transparent 100%),
      radial-gradient(circle 2.5px at calc(100% - var(--ext-r, 0px) - .5px) 50%, #fff 92%, transparent 100%),
      linear-gradient(#fff, #fff) left 0 top 2px / var(--ext-l, 0px) 1px no-repeat,
      linear-gradient(#fff, #fff) right 0 top 2px / var(--ext-r, 0px) 1px no-repeat;
  }

  /* зона меню — только для меню: контент страницы начинается ниже,
     а всё, что заезжает выше (например, карточки карусели), растворяется
     и полностью пропадает на нижней границе меню (--vb-nav-h считается в measure()) */
  main.page {
    padding-top: calc(var(--vb-nav-h, 110px) + var(--vb-fade, 40px));
    -webkit-mask-image: linear-gradient(transparent var(--vb-nav-h, 110px), #000 calc(var(--vb-nav-h, 110px) + var(--vb-fade, 40px)));
            mask-image: linear-gradient(transparent var(--vb-nav-h, 110px), #000 calc(var(--vb-nav-h, 110px) + var(--vb-fade, 40px)));
  }
  /* разделы — одинаковые прямоугольники в ряд из трёх равных колонок, по центру экрана */
  .vb-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
  .vb-nav ul { display: contents; list-style: none; }
  .vb-nav li { position: relative; display: grid; list-style: none; }

  /* «назад: главная» — двойная стрелка с подписью, как на карточках */
  .vb-up {
    position: absolute; top: 50%; left: clamp(8px, 3vw - 12px, 36px); translate: 0 -50%;
    height: 80px; padding: 0 14px 0 17px;
    display: flex; align-items: center; gap: 10px;
    color: #a3a3ab; text-decoration: none;
    transition: color .3s ease;
  }
  .vb-up svg { width: 46px; height: 46px; flex: none; transition: transform .4s cubic-bezier(.34, 1.56, .64, 1); }
  .vb-up span { font-size: 12px; letter-spacing: .3em; text-transform: uppercase; }
  @media (hover: hover) {
  .vb-up:hover, .vb-up:focus-visible { color: #9d5cff; outline: none; }
  }
  @media (hover: hover) {
  .vb-up:hover svg, .vb-up:focus-visible svg { transform: translateX(-6px); }
  }

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
  @media (hover: hover) {
  .vb-nav .box:hover, .vb-nav .box:focus-visible { border-color: rgba(255, 255, 255, .5); }
  }
  /* вертикальная фиолетовая линия под прямоугольником: вырастает снизу вверх, к рамке */
  .vb-nav .fx::before {
    content: ""; position: absolute; left: 50%; top: 100%;
    width: 1px; height: 20px; margin-left: -.5px;
    background: #9d5cff; box-shadow: 0 0 10px #9d5cff;
    transform: scaleY(0); transform-origin: 50% 100%;
    transition: transform .45s cubic-bezier(.65, 0, .35, 1);
  }
  .vb-nav .fx .t { color: var(--c, #fff); }
  @media (hover: hover) {
  .vb-nav .fx:hover::before, .vb-nav .fx:focus-visible::before { transform: scaleY(1); }
  }
  .vb-nav .fx:focus-visible { outline: none; }

  /* текущая страница — «вкладка»: без нижней границы, боковые стороны опускаются
     до линии под меню, а в линии под ней проход. Не кликается */
  .vb-nav [aria-current="page"] {
    --c: rgba(255, 255, 255, .55); cursor: default; pointer-events: none;
    border-bottom-color: transparent; border-radius: 2px 2px 0 0;
  }
  .vb-nav .fx[aria-current="page"]::before { display: none; }   /* фиолетовая чёрточка не нужна — контур рисует .tabline */
  /* раздел, внутри которого мы сейчас: линия стоит, но по пункту можно вернуться */
  .vb-nav .parent::before { transform: scaleY(1); }

  /* средняя ширина — прямоугольники компактнее, чтобы не наезжать на стрелку и контакты */
  @media (min-width: 761px) and (max-width: 1150px) {
    .vb-grid { gap: 10px; }
    .vb-nav .fx { font-size: 13px; letter-spacing: .16em; padding: 8px 14px; }
  }
  @media (max-width: 760px) {
    .vb-nav { left: 8px; right: 8px; top: 6px; padding-top: 50px; }   /* стрелка — отдельной строкой сверху */
    .vb-nav { --drop: 20px; }
    .vb-nav { --inset: 0px; }
    .vb-grid { width: 100%; gap: 6px; }
    .vb-nav .fx { font-size: 11px; letter-spacing: .1em; padding: 6px 4px; }
    .vb-up { top: 0; left: -4px; translate: none; height: 46px; padding: 0 10px; gap: 6px; }
    .vb-up svg { width: 30px; height: 30px; }
    .vb-up span { font-size: 10px; letter-spacing: .22em; }
    .vb-nav .fx::before { height: 14px; }
  }
  @media (prefers-reduced-motion: reduce) {
    .vb-nav, .vb-nav * { animation: none !important; transition: none !important; }
    .vb-nav { opacity: 1; transform: none; }
  }`;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  /* ---------------------------- разметка ---------------------------- */
  const nav = document.createElement('nav');
  nav.className = 'vb-nav';
  nav.setAttribute('aria-label', 'Навигация по сайту');
  nav.innerHTML = `<a class="vb-up" href="index.html#menu" aria-label="На главную">
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="butt" stroke-linejoin="miter" aria-hidden="true">
        <path d="M23 9 8 24l15 15"/><path d="M38 9 23 24l15 15"/></svg><span>главная</span></a>`
    + '<div class="vb-grid"><ul>' + ITEMS.map(it => {
    const cur = it.id === current;
    return `<li><a class="fx box${it.id === parent ? ' parent' : ''}" href="${it.href}"${cur ? ' aria-current="page" tabindex="-1"' : ''}><span class="t">${it.label}</span></a>${cur ? '<span class="tabline" aria-hidden="true"></span>' : ''}</li>`;
  }).join('') + '</ul></div>';
  document.body.prepend(nav);

  /* ---------------------------- высота зоны меню ---------------------------- */
  function measure() {
    // нижняя граница меню вместе с линией под ним (без анимации появления)
    const navH = nav.offsetTop + nav.offsetHeight + 30;
    document.documentElement.style.setProperty('--vb-nav-h', `${Math.round(navH)}px`);
    // куски линии слева и справа от текущей вкладки — сколько им тянуться до краёв экрана.
    // Делим на масштаб меню: во время переходов страница увеличена, а нужна обычная раскладка
    const cur = nav.querySelector('[aria-current="page"]');
    nav.classList.toggle('has-cur', !!cur);
    if (cur) {
      const li = cur.parentElement;
      li.classList.add('cur');
      const n = nav.getBoundingClientRect(), r = li.getBoundingClientRect();
      const k = n.width / nav.offsetWidth || 1;
      const inset = innerWidth <= 760 ? 0 : Math.min(24, Math.max(12, innerWidth * 0.016));
      li.style.setProperty('--ext-l', `${Math.max(0, (r.left - n.left) / k - inset)}px`);
      li.style.setProperty('--ext-r', `${Math.max(0, (n.right - r.right) / k - inset)}px`);
    }
  }
  measure();
  document.fonts?.ready.then(measure);
  addEventListener('resize', measure);
  // ширина меню меняется и без resize окна — например, когда появляется полоса прокрутки
  if ('ResizeObserver' in window) new ResizeObserver(measure).observe(nav);

})();
