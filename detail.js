/* =====================================================================
   КАРТОЧКИ (проект / работа коллекции) — навигация «как в играх»:
   слева сверху — выход на уровень выше (стрелка «назад» с подписью, куда она ведёт),
   справа сверху — соседи по тому же уровню: «‹ 02 / 07 ›».
   Переход к соседу — сдвиг вбок, без возврата в список.

   Подключение (после разметки со ссылкой .prev-tab):
     <script src="detail.js"></script>
     <script>vbDetail({ page: 'project.html', param: 'p', index: 0, count: 7,
                        upLabel: 'проекты', labels: ['Предыдущий проект', 'Следующий проект'] });</script>
   Клавиши: PageUp / PageDown — соседи (на странице работы ещё ← →).
   ===================================================================== */
(() => {
  const css = `
  /* «назад» с подписью */
  .prev-tab { width: auto !important; gap: 10px; padding: 0 14px 0 17px; display: flex !important; align-items: center; }
  .prev-tab .lbl {
    font-size: 12px; font-weight: 400; letter-spacing: .3em; text-transform: uppercase;
    transition: transform .4s cubic-bezier(.34, 1.56, .64, 1);
  }

  /* соседи справа сверху — зеркально стрелке «назад» */
  .sib {
    position: fixed; z-index: 50;
    top: clamp(10px, 2vh, 20px); right: clamp(8px, 3vw - 12px, 36px);
    height: 80px;
    display: flex; align-items: center; gap: 4px;
    color: var(--muted, #a3a3ab);
    font-family: "Jost", "Futura", "Century Gothic", sans-serif;
  }
  .sib-btn {
    width: 48px; height: 48px;
    display: grid; place-items: center;
    color: inherit; text-decoration: none;
    transition: color .3s ease;
  }
  .sib-btn svg { width: 26px; height: 26px; transition: transform .4s cubic-bezier(.34, 1.56, .64, 1); }
  @media (hover: hover) {
  .sib-btn:hover, .sib-btn:focus-visible { color: var(--accent, #9d5cff); outline: none; }
  }
  @media (hover: hover) {
  .sib-btn.prev:hover svg, .sib-btn.prev:focus-visible svg { transform: translateX(-4px); }
  }
  @media (hover: hover) {
  .sib-btn.next:hover svg, .sib-btn.next:focus-visible svg { transform: translateX(4px); }
  }
  .sib-n { min-width: 64px; text-align: center; font-size: 12px; font-weight: 400; letter-spacing: .3em; }

  @media (max-width: 760px) {
    .prev-tab { padding: 0 10px 0 12px; gap: 6px; }
    .prev-tab .lbl { font-size: 10px; letter-spacing: .22em; }
    .sib { top: 6px; height: 60px; right: 2px; }
    .sib-btn { width: 40px; height: 40px; }
    .sib-btn svg { width: 22px; height: 22px; }
    .sib-n { min-width: 52px; font-size: 11px; letter-spacing: .2em; }
  }`;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  const chevron = d => `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="5"
    stroke-linecap="butt" stroke-linejoin="miter" aria-hidden="true"><path d="${d}"/></svg>`;
  const pad = v => String(v).padStart(2, '0');

  window.vbDetail = ({ page, param, index, count, upLabel, labels = ['Предыдущий', 'Следующий'] }) => {
    // подпись у стрелки «назад»
    const back = document.querySelector('.prev-tab');
    if (back && upLabel && !back.querySelector('.lbl')) {
      back.insertAdjacentHTML('beforeend', `<span class="lbl">${upLabel}</span>`);
    }
    if (!count || count < 2) return;

    const url = i => `${page}?${param}=${(i + count) % count}`;
    const nav = document.createElement('nav');
    nav.className = 'sib';
    nav.setAttribute('aria-label', 'Соседние');
    // data-dir — в какую сторону сдвигать страницу при переходе (см. transition.js)
    nav.innerHTML = `
      <a class="sib-btn prev" href="${url(index - 1)}" data-dir="left" aria-label="${labels[0]}">${chevron('M30 9 15 24l15 15')}</a>
      <span class="sib-n" aria-hidden="true">${pad(index + 1)} / ${pad(count)}</span>
      <a class="sib-btn next" href="${url(index + 1)}" data-dir="right" aria-label="${labels[1]}">${chevron('M18 9l15 15-15 15')}</a>`;
    document.body.appendChild(nav);

    const go = (i, dir) => (window.vbGo || (u => location.href = u))(url(i), dir);
    addEventListener('keydown', e => {
      if (e.key === 'PageDown') { e.preventDefault(); go(index + 1, 'right'); }
      if (e.key === 'PageUp')   { e.preventDefault(); go(index - 1, 'left'); }
    });
    return { next: () => go(index + 1, 'right'), prev: () => go(index - 1, 'left') };
  };

  // пришли на карточку с соседней (сдвигом вбок) — вступление не повторяем
  window.vbFromSibling = () => /\bvb-in-(left|right)\b/.test(document.documentElement.className);
})();
