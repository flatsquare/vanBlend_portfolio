/* =====================================================================
   КОНТАКТЫ — одно место для ссылок на всём сайте.
   Кнопки «tg», «wa» и «почта» в правом верхнем углу каждой страницы.
   На телефоне на страницах с верхним меню вместо них компактная «связь»:
   слово с иконкой, по нажатию слева выезжают иконки почты, Telegram и WhatsApp.
   Те же ссылки берёт страница about.html.
   Подключение: <script src="contacts.js"></script> в конце <body>.
   ===================================================================== */
const CONTACTS = {
  tg:   'https://t.me/USERNAME',        // ← замени на свой
  wa:   'https://wa.me/79990000000',    // ← замени на свой номер (только цифры, с кодом страны)
  mail: 'mailto:you@example.com',       // ← замени на свой
  artstation: 'https://www.artstation.com/van_blend',
};

(() => {
  const css = `
  .vb-cta {
    position: fixed; z-index: 60;
    top: clamp(14px, 2.6vh, 26px); right: clamp(12px, 2.4vw, 36px);
    display: flex; align-items: center; gap: 10px;
    font-family: "Jost", "Futura", "Century Gothic", sans-serif; font-weight: 400;
    opacity: 0; transform: translateY(-10px);
    animation: vbCtaIn .8s cubic-bezier(.2, .8, .2, 1) .25s forwards;
  }
  @keyframes vbCtaIn { to { opacity: 1; transform: none; } }
  html.vb-arrived .vb-cta { animation: none; opacity: 1; transform: none; }   /* пришли переходом */

  .vb-cta .lbl {
    font-size: 11px; letter-spacing: .3em; text-transform: uppercase;
    color: #a3a3ab; opacity: .7; margin-right: 4px;
  }
  /* кнопка-действие: фиолетовая рамка — сразу видно, что это не раздел, а «написать» */
  .vb-cta a {
    display: grid; place-items: center;
    min-width: 64px; height: 38px; padding: 0 14px;
    border: 1px solid rgba(157, 92, 255, .6); border-radius: 2px;
    font-size: 13px; letter-spacing: .2em; text-transform: uppercase;
    color: #fff; text-decoration: none;
    transition: background-color .3s ease, border-color .3s ease, box-shadow .3s ease;
  }
  @media (hover: hover) {
  .vb-cta a:hover, .vb-cta a:focus-visible {
    outline: none;
    border-color: #9d5cff; background: rgba(157, 92, 255, .16);
    box-shadow: 0 0 18px rgba(157, 92, 255, .35);
  }
  }
  /* средняя ширина — без подписи и поменьше, чтобы не наезжать на меню разделов */
  @media (max-width: 1150px) {
    .vb-cta { gap: 6px; }
    .vb-cta .lbl { display: none; }
    .vb-cta a { min-width: 44px; height: 34px; padding: 0 10px; font-size: 12px; }
  }
  @media (max-width: 760px) {
    .vb-cta .lbl { display: none; }
    .vb-cta a { min-width: 0; height: 34px; padding: 0 10px; font-size: 11px; }
    body:has(.vb-nav) .vb-cta { display: none; }   /* на телефоне место сверху занято меню */
  }

  /* ---- компактная «связь» для телефона (страницы с верхним меню) ---- */
  .vb-cm {
    position: fixed; z-index: 60; top: 9px; right: 6px; height: 40px;
    display: none; align-items: center; gap: 6px;
    font-family: "Jost", "Futura", "Century Gothic", sans-serif; font-weight: 400;
    -webkit-tap-highlight-color: transparent;
  }
  @media (max-width: 760px) { body:has(.vb-nav) .vb-cm { display: flex; } }
  .vb-cm .tog {
    height: 40px; padding: 0 8px; display: flex; align-items: center; gap: 7px;
    color: #a3a3ab; font-size: 10px; letter-spacing: .22em; text-transform: uppercase;
    background: none; border: 0; font-family: inherit; cursor: pointer;
    transition: color .25s ease;
  }
  .vb-cm .tog svg { width: 20px; height: 20px; }
  .vb-cm.open .tog { color: #9d5cff; }
  /* иконки выезжают слева от «связи» */
  .vb-cm .ico { display: flex; gap: 6px; }
  .vb-cm .ico a {
    width: 38px; height: 38px; display: grid; place-items: center;
    color: #fff; border: 1px solid rgba(157, 92, 255, .6); border-radius: 2px;
    opacity: 0; transform: translateX(14px); pointer-events: none;
    transition: opacity .25s ease, transform .3s cubic-bezier(.2, .8, .2, 1);
  }
  .vb-cm .ico a:nth-child(2) { transition-delay: .04s; }
  .vb-cm .ico a:nth-child(1) { transition-delay: .08s; }
  .vb-cm .ico svg { width: 19px; height: 19px; }
  .vb-cm.open .ico a { opacity: 1; transform: none; pointer-events: auto; }
  .vb-cm .ico a:active { background: rgba(157, 92, 255, .2); }
  @media (prefers-reduced-motion: reduce) {
    .vb-cta { animation: none; opacity: 1; transform: none; }
  }`;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  const cta = document.createElement('div');
  cta.className = 'vb-cta';
  cta.innerHTML = `<span class="lbl">написать</span>
    <a href="${CONTACTS.tg}" target="_blank" rel="noopener" aria-label="Telegram">tg</a>
    <a href="${CONTACTS.wa}" target="_blank" rel="noopener" aria-label="WhatsApp">wa</a>
    <a href="${CONTACTS.mail}">почта</a>`;
  document.body.appendChild(cta);

  /* компактная «связь» (телефон) — тонкие линейные иконки в стиле сайта */
  const svg = d => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"
    stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
  const I = {
    chat: '<path d="M4 5h16v11H9l-5 4z"/>',
    mail: '<rect x="3" y="5.5" width="18" height="13" rx="1"/><path d="m3.5 6.5 8.5 6.5 8.5-6.5"/>',
    tg:   '<path d="M21 4 3 11.2l6.3 2.1L18 7l-6.8 7.6v5L14.6 16l4 3z"/>',
    wa:   '<path d="M4.5 19.5 5.6 16A8 8 0 1 1 8.4 18.6z"/><path d="M9.2 8.6c.2 2.9 2.6 5.5 5.6 6l1-1.3-1.6-.9-.9.8c-1-.5-2-1.5-2.4-2.5l.8-.9-.8-1.7z"/>',
  };
  const cm = document.createElement('div');
  cm.className = 'vb-cm';
  cm.innerHTML = `<div class="ico" id="vb-cm-ico">
      <a href="${CONTACTS.mail}" aria-label="Почта">${svg(I.mail)}</a>
      <a href="${CONTACTS.tg}" target="_blank" rel="noopener" aria-label="Telegram">${svg(I.tg)}</a>
      <a href="${CONTACTS.wa}" target="_blank" rel="noopener" aria-label="WhatsApp">${svg(I.wa)}</a>
    </div>
    <button class="tog" type="button" aria-expanded="false" aria-controls="vb-cm-ico">${svg(I.chat)}<span>связь</span></button>`;
  document.body.appendChild(cm);
  const tog = cm.querySelector('.tog');
  const setOpen = v => { cm.classList.toggle('open', v); tog.setAttribute('aria-expanded', v); };
  tog.addEventListener('click', e => { e.stopPropagation(); setOpen(!cm.classList.contains('open')); });
  document.addEventListener('click', e => { if (!cm.contains(e.target)) setOpen(false); });
})();
