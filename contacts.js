/* =====================================================================
   КОНТАКТЫ — одно место для ссылок на всём сайте.
   Кнопки «tg», «wa» и «почта» в правом верхнем углу каждой страницы
   (на телефоне — только на главной и «обо мне», там, где нет верхнего меню).
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
  .vb-cta a:hover, .vb-cta a:focus-visible {
    outline: none;
    border-color: #9d5cff; background: rgba(157, 92, 255, .16);
    box-shadow: 0 0 18px rgba(157, 92, 255, .35);
  }
  @media (max-width: 760px) {
    .vb-cta .lbl { display: none; }
    .vb-cta a { min-width: 0; height: 34px; padding: 0 10px; font-size: 11px; }
    body:has(.vb-nav) .vb-cta { display: none; }   /* на телефоне место сверху занято меню */
  }
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
})();
