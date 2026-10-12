/* =====================================================================
   ВЕРХНЯЯ ПАНЕЛЬ НАВИГАЦИИ — для всех страниц, кроме главной.
   Схема:   ← главная          проекты:                     связь
                        коммерческие   личные                 •
   «проекты:» — серая подпись над разделами, как на главной.
   «связь» справа — выпадающий список tg / whatsapp / почта (ссылки — из contacts.js,
   поэтому nav.js подключается раньше contacts.js).
   Подключение: <script src="nav.js" data-current="commercial"></script>
   data-current: commercial | collection
   data-parent:  раздел, внутри которого открыта карточка (project → commercial, work → collection):
                 пункт тоже выглядит вкладкой, но по нему можно вернуться в список
   ===================================================================== */
(() => {
  const ITEMS = [
    { id: 'commercial', label: 'коммерческие', href: 'commercial.html' },
    { id: 'collection', label: 'личные',       href: 'collection.html' }
  ];

  const current = document.currentScript?.dataset.current || '';
  const parent = document.currentScript?.dataset.parent || '';

  /* ---------------------------- стили ----------------------------
     тот же «язык», что у меню на главной: голый текст капсом,
     при наведении слева выдвигается фиолетовая линия и текст заливается фиолетовым */
  const css = `
  .vb-nav {
    --accent: #9d5cff; --muted: #a3a3ab;
    position: fixed; top: clamp(14px, 2.6vh, 26px); left: 0; right: 0; z-index: 50;
    padding: 0 clamp(8px, 3vw - 12px, 36px);
    display: grid; grid-template-columns: 1fr auto 1fr; align-items: start;
    pointer-events: none;               /* панель во всю ширину, но кликаются только пункты */
    transform: translateY(-12px); opacity: 0;
    animation: vbNavIn .8s cubic-bezier(.2, .8, .2, 1) .15s forwards;
    font-family: "Jost", "Futura", "Century Gothic", sans-serif; font-weight: 300;
  }
  @keyframes vbNavIn { to { transform: none; opacity: 1; } }
  /* страница прокручена (карточки на телефоне) — под меню тёмная подложка до линии, чтобы контент не просвечивал */
  .vb-nav::before {
    content: ""; position: absolute; z-index: -1; left: 0; right: 0; top: -40px; bottom: calc(-1 * var(--drop) - 1px);
    background: rgba(11, 11, 14, .94); opacity: 0; pointer-events: none; transition: opacity .3s ease;
  }
  .vb-nav.scrolled::before { opacity: 1; }
  /* пришли переходом с другой страницы — меню проявляется вместе со страницей (см. transition.js) */
  html.vb-arrived .vb-nav { animation: none; transform: none; opacity: 1; }
  .vb-nav a, .vb-nav button { pointer-events: auto; }

  /* линия под меню — отделяет его от страницы; под текущим разделом в ней проход,
     а бока его блока опускаются до линии — как вкладка картотеки.
     Контур под текущей вкладкой (бока + линия + точки на стыках) — один элемент .tabline:
     внутри всё сплошное белое, а прозрачность задана ему целиком, поэтому там, где части
     накладываются (углы, точки), цвет не становится светлее.
     Дальние концы линии (--ext-l / --ext-r) измеряет measure() */
  .vb-nav { --drop: 22px; --inset: clamp(12px, 1.6vw, 24px); --dash: rgba(255, 255, 255, .22); }
  .vb-nav:not(.has-cur)::after {             /* без текущего раздела — просто линия во всю ширину */
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

  /* «назад: главная» — двойная стрелка с подписью, как на карточках */
  .vb-up {
    justify-self: start; align-self: center;
    height: 64px; padding: 0 14px 0 4px;
    display: flex; align-items: center; gap: 10px;
    color: var(--muted); text-decoration: none;
    transition: color .3s ease;
  }
  .vb-up svg { width: 40px; height: 40px; flex: none; transition: transform .4s cubic-bezier(.34, 1.56, .64, 1); }
  .vb-up span { font-size: 12px; font-weight: 400; letter-spacing: .3em; text-transform: uppercase; }
  @media (hover: hover) {
    .vb-up:hover, .vb-up:focus-visible { color: var(--accent); outline: none; }
    .vb-up:hover svg, .vb-up:focus-visible svg { transform: translateX(-6px); }
  }

  /* ----- центр: «проекты:» над двумя разделами ----- */
  .vb-sec { display: flex; flex-direction: column; align-items: center; gap: 8px; }
  .vb-lbl {
    font-size: 11px; font-weight: 400; letter-spacing: .32em; text-transform: uppercase;
    color: var(--muted); opacity: .75; padding-left: .32em;    /* компенсация разрядки — по центру */
    user-select: none;
  }
  /* разделы — одинаковые прямоугольники в ряд, по центру экрана */
  .vb-items { display: grid; grid-template-columns: repeat(${ITEMS.length}, 1fr); gap: 14px; list-style: none; margin: 0; padding: 0; }
  .vb-items li { position: relative; display: grid; }

  /* пункт: фиолетовая линия слева + заливка текста при наведении */
  .vb-nav .fx {
    position: relative; display: inline-flex; align-items: center;
    padding: 6px 0; white-space: nowrap;
    font: inherit; font-size: clamp(14px, 1.25vw, 18px);
    letter-spacing: .22em; text-transform: uppercase; text-decoration: none;
    background: none; border: 0; cursor: pointer; color: inherit;
    --line: 28px;
  }
  .vb-nav .fx::before {
    content: ""; flex: none; width: 0; height: 1px; margin-right: 0;
    background: var(--accent); box-shadow: 0 0 10px var(--accent);
    transition: width .45s cubic-bezier(.65, 0, .35, 1), margin .45s cubic-bezier(.65, 0, .35, 1);
  }
  .vb-nav .fx .t {
    background: linear-gradient(90deg, var(--accent) 0 50%, var(--c, var(--muted)) 50% 100%);
    background-size: 200% 100%; background-position: 100% 0;
    -webkit-background-clip: text; background-clip: text; color: transparent;
    transition: background-position .55s cubic-bezier(.65, 0, .35, 1) .05s;
  }
  @media (hover: hover) {
    .vb-nav .fx:hover::before, .vb-nav .fx:focus-visible::before { width: var(--line); margin-right: 14px; }
    .vb-nav .fx:hover .t, .vb-nav .fx:focus-visible .t { background-position: 0 0; }
  }
  .vb-nav .fx:focus-visible { outline: none; }

  /* раздел — прозрачный прямоугольник с серой рамкой; при наведении рамка светлеет,
     а под ним вырастает вертикальная фиолетовая черта */
  .vb-nav .box {
    justify-content: center; min-height: 44px; padding: 8px 22px;
    font-size: 15px; letter-spacing: .2em; font-weight: 400;
    border: 1px solid rgba(255, 255, 255, .22); border-radius: 2px;
    transition: border-color .3s ease;
  }
  .vb-nav .box .t { background: none; color: var(--c, #fff); transition: color .3s ease; }
  .vb-nav .box::before {
    position: absolute; left: 50%; top: 100%; margin: 0 0 0 -.5px;
    width: 1px; height: 18px;
    transform: scaleY(0); transform-origin: 50% 100%;
    transition: transform .45s cubic-bezier(.65, 0, .35, 1);
  }
  @media (hover: hover) {
    .vb-nav .box:hover, .vb-nav .box:focus-visible { border-color: rgba(255, 255, 255, .5); }
    .vb-nav .box:hover::before, .vb-nav .box:focus-visible::before { width: 1px; margin: 0 0 0 -.5px; transform: scaleY(1); }
  }
  /* текущий раздел — вкладка: без нижней границы, бока уходят к линии (.tabline); не кликается */
  .vb-nav .box[aria-current="page"] {
    --c: rgba(255, 255, 255, .55); cursor: default; pointer-events: none;
    border-bottom-color: transparent; border-radius: 2px 2px 0 0;
  }
  .vb-nav .box[aria-current="page"]::before { display: none; }
  /* раздел, внутри которого открыта карточка (data-parent): тоже вкладка, но по ней можно вернуться */
  .vb-nav .box.parent { --c: rgba(255, 255, 255, .8); border-bottom-color: transparent; border-radius: 2px 2px 0 0; }
  .vb-nav .box.parent::before { display: none; }
  @media (hover: hover) {
    .vb-nav .box.parent:hover, .vb-nav .box.parent:focus-visible { border-color: rgba(255, 255, 255, .22); border-bottom-color: transparent; --c: var(--accent); }
  }

  /* ----- справа: «связь» с точкой под ней, по клику / наведению выпадает список ----- */
  .vb-ct { justify-self: end; position: relative; display: flex; flex-direction: column; align-items: center; }
  .vb-ct > .fx { --c: #fff; padding-bottom: 2px; }
  .vb-dot { width: 6px; height: 6px; border-radius: 50%; background: #fff; margin-top: 6px; transition: transform .3s ease, background-color .3s ease; }
  .vb-ct.open .vb-dot { transform: scale(.6); background: var(--accent); }
  .vb-drop {
    position: absolute; right: 0; top: 100%; padding-top: 14px;
    opacity: 0; transform: translateY(-8px); pointer-events: none;
    transition: opacity .3s ease, transform .35s cubic-bezier(.2, .8, .2, 1);
  }
  .vb-ct.open .vb-drop, .vb-ct:focus-within .vb-drop { opacity: 1; transform: none; }
  .vb-ct.open .vb-drop a, .vb-ct:focus-within .vb-drop a { pointer-events: auto; }
  .vb-drop a { pointer-events: none; }
  @media (hover: hover) {
    .vb-ct:hover .vb-drop { opacity: 1; transform: none; }
    .vb-ct:hover .vb-drop a { pointer-events: auto; }
    .vb-ct:hover .vb-dot { transform: scale(.6); background: var(--accent); }
  }
  /* список со скобкой справа «]» — зеркально главной, т.к. прижат к правому краю */
  /* чёрная подложка — перекрывает линию под меню и контент страницы */
  .vb-list {
    position: relative; padding: 10px 18px 10px 26px;
    background: #0b0b0e; box-shadow: 0 12px 30px rgba(0, 0, 0, .5);
    display: flex; flex-direction: column; align-items: flex-end; gap: 8px;
    border-right: 1px solid rgba(255, 255, 255, .5);
  }
  .vb-list::before, .vb-list::after {
    content: ""; position: absolute; right: -1px; width: 12px; height: 1px; background: rgba(255, 255, 255, .5);
  }
  .vb-list::before { top: 0; }
  .vb-list::after { bottom: 0; }
  .vb-list .fx { font-size: 13px; letter-spacing: .24em; padding: 3px 0; --line: 18px; --c: #fff; }

  /* средняя ширина — компактнее, чтобы «главная» не наезжала на разделы */
  @media (min-width: 761px) and (max-width: 1150px) {
    .vb-up { gap: 6px; padding-right: 8px; }
    .vb-up svg { width: 32px; height: 32px; }
    .vb-up span { font-size: 11px; letter-spacing: .22em; }
    .vb-nav .box { padding: 8px 16px; font-size: 13px; letter-spacing: .16em; }
  }
  /* телефон: сверху стрелка и «связь», ниже по центру «проекты:» и разделы */
  @media (max-width: 760px) {
    .vb-nav {
      top: 6px; padding: 0 8px;
      grid-template-columns: 1fr 1fr; grid-template-areas: "up ct" "sec sec"; row-gap: 4px;
    }
    .vb-nav { --drop: 16px; --inset: 8px; }
    .vb-up { grid-area: up; height: 46px; padding: 0 10px 0 0; gap: 6px; }
    .vb-up svg { width: 28px; height: 28px; }
    .vb-up span { font-size: 10px; letter-spacing: .22em; }
    .vb-ct { grid-area: ct; align-self: center; padding-right: 6px; }
    .vb-ct > .fx { font-size: 12px; }
    .vb-dot { width: 5px; height: 5px; margin-top: 4px; }
    .vb-sec { grid-area: sec; gap: 4px; }
    .vb-lbl { font-size: 10px; }
    .vb-sec { width: 100%; }
    .vb-items { width: 100%; gap: 6px; }
    .vb-nav .fx { font-size: 13px; letter-spacing: .16em; }
    .vb-nav .box { min-height: 40px; padding: 6px 4px; font-size: 12px; letter-spacing: .14em; }
    .vb-nav .box::before { height: 12px; }
    .vb-list .fx { font-size: 12px; }
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
  // стрелка «назад» — на уровень выше: из раздела на главную, с карточки (data-parent) — в список проектов
  const up = ITEMS.find(it => it.id === parent);
  // с карточки (project.html?p=N / work.html?w=N) возвращаемся в список сразу на этот же проект: ?at=N
  const q = new URLSearchParams(location.search), atN = q.get('p') ?? q.get('w');
  const back = href => (atN !== null && /^\d+$/.test(atN) ? `${href}?at=${atN}` : href);
  const upHref = up ? back(up.href) : 'index.html#menu';
  const upLabel = up ? 'проекты' : 'главная';
  nav.innerHTML = `<a class="vb-up" href="${upHref}" aria-label="${up ? 'Назад к проектам' : 'На главную'}">
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="butt" stroke-linejoin="miter" aria-hidden="true">
        <path d="M23 9 8 24l15 15"/><path d="M38 9 23 24l15 15"/></svg><span>${upLabel}</span></a>
    <div class="vb-sec">
      <span class="vb-lbl">проекты:</span>
      <ul class="vb-items">${ITEMS.map(it => {
        const cur = it.id === current, par = it.id === parent;
        return `<li><a class="fx box${par ? ' parent' : ''}" href="${par ? back(it.href) : it.href}"${cur ? ' aria-current="page" tabindex="-1"' : ''}><span class="t">${it.label}</span></a>${cur || par ? '<span class="tabline" aria-hidden="true"></span>' : ''}</li>`;
      }).join('')}</ul>
    </div>
    <div class="vb-ct">
      <button class="fx" type="button" aria-expanded="false" aria-controls="vb-drop"><span class="t">связь</span></button>
      <span class="vb-dot" aria-hidden="true"></span>
      <div class="vb-drop" id="vb-drop"><div class="vb-list">
        <a class="fx" data-contact="tg" target="_blank" rel="noopener"><span class="t">tg</span></a>
        <a class="fx" data-contact="wa" target="_blank" rel="noopener"><span class="t">whatsapp</span></a>
        <a class="fx" data-contact="mail"><span class="t">почта</span></a>
      </div></div>
    </div>`;
  document.body.prepend(nav);

  /* «связь»: клик / касание открывает и закрывает, клик мимо или Esc — закрывает */
  const ct = nav.querySelector('.vb-ct');
  const ctBtn = ct.querySelector('button');
  const setOpen = v => { ct.classList.toggle('open', v); ctBtn.setAttribute('aria-expanded', v); };
  ctBtn.addEventListener('click', e => { e.stopPropagation(); setOpen(!ct.classList.contains('open')); });
  // касание мимо — pointerdown, а не click: iOS Safari не шлёт click по «пустым» местам страницы
  document.addEventListener('pointerdown', e => { if (!ct.contains(e.target)) setOpen(false); });
  // Esc закрывает список; если он был открыт — на этом всё (страница не уходит «назад» по тому же Esc)
  addEventListener('keydown', e => {
    if (e.key !== 'Escape' || !(ct.classList.contains('open') || ct.contains(document.activeElement))) return;
    setOpen(false); document.activeElement.blur(); e.stopImmediatePropagation();
  });

  /* ---------------------------- высота зоны меню ---------------------------- */
  function measure() {
    // нижняя граница меню вместе с линией под ним (без анимации появления)
    const drop = parseFloat(getComputedStyle(nav).getPropertyValue('--drop')) || 22;
    const navH = nav.offsetTop + nav.offsetHeight + drop + 6;
    document.documentElement.style.setProperty('--vb-nav-h', `${Math.round(navH)}px`);
    // куски линии слева и справа от текущей вкладки — сколько им тянуться до краёв экрана.
    // Делим на масштаб меню: во время переходов страница увеличена, а нужна обычная раскладка
    const cur = nav.querySelector('[aria-current="page"], .box.parent');
    nav.classList.toggle('has-cur', !!cur);
    if (cur) {
      const li = cur.parentElement;
      const n = nav.getBoundingClientRect(), r = li.getBoundingClientRect();
      const k = n.width / nav.offsetWidth || 1;
      const inset = innerWidth <= 760 ? 8 : Math.min(24, Math.max(12, innerWidth * 0.016));
      li.style.setProperty('--ext-l', `${Math.max(0, (r.left - n.left) / k - inset)}px`);
      li.style.setProperty('--ext-r', `${Math.max(0, (n.right - r.right) / k - inset)}px`);
    }
  }
  // прокручиваться может и окно, и сам body (на карточках у html и body свой overflow) — слушаем все
  const onScroll = () => nav.classList.toggle('scrolled', Math.max(scrollY, document.body.scrollTop) > 4);
  document.addEventListener('scroll', onScroll, { passive: true, capture: true });
  onScroll();

  measure();
  document.fonts?.ready.then(measure);
  addEventListener('resize', measure);
  if ('ResizeObserver' in window) new ResizeObserver(measure).observe(nav);
})();
