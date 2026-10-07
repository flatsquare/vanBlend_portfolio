/* =====================================================================
   РАБОТЫ КОЛЛЕКЦИИ — заполни своими. Используется в collection.html и work.html
   title — название, year — год
   src   — главная картинка (она же в ленте коллекции)
   extra — дополнительные фото на странице работы (2–4 штуки, пустая строка = заглушка);
           появляются по одной: справа, слева, справа, слева
   ===================================================================== */
const EXTRA_PLACEHOLDER = () => ['', '', '', ''];

const WORKS = [
  { title: 'Работа 1',  year: '2026', src: '', extra: EXTRA_PLACEHOLDER() },
  { title: 'Работа 2',  year: '2026', src: '', extra: EXTRA_PLACEHOLDER() },
  { title: 'Работа 3',  year: '2025', src: '', extra: EXTRA_PLACEHOLDER() },
  { title: 'Работа 4',  year: '2025', src: '', extra: EXTRA_PLACEHOLDER() },
  { title: 'Работа 5',  year: '2025', src: '', extra: EXTRA_PLACEHOLDER() },
  { title: 'Работа 6',  year: '2025', src: '', extra: EXTRA_PLACEHOLDER() },
  { title: 'Работа 7',  year: '2024', src: '', extra: EXTRA_PLACEHOLDER() },
  { title: 'Работа 8',  year: '2024', src: '', extra: EXTRA_PLACEHOLDER() },
  { title: 'Работа 9',  year: '2024', src: '', extra: EXTRA_PLACEHOLDER() },
  { title: 'Работа 10', year: '2024', src: '', extra: EXTRA_PLACEHOLDER() },
  { title: 'Работа 11', year: '2023', src: '', extra: EXTRA_PLACEHOLDER() },
  { title: 'Работа 12', year: '2023', src: '', extra: EXTRA_PLACEHOLDER() },
  { title: 'Работа 13', year: '2023', src: '', extra: EXTRA_PLACEHOLDER() },
  { title: 'Работа 14', year: '2023', src: '', extra: EXTRA_PLACEHOLDER() },
  { title: 'Работа 15', year: '2022', src: '', extra: EXTRA_PLACEHOLDER() },
  { title: 'Работа 16', year: '2022', src: '', extra: EXTRA_PLACEHOLDER() },
];

// все окошки работ одного формата (ширина / высота), картинка обрезается по центру
const CARD_RATIO = 4 / 5;
