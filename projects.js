/* =====================================================================
   ПРОЕКТЫ — заполни своими данными. Используется в commercial.html и project.html
   title  — название проекта
   client — название клиента (показывается, если нет логотипа)
   logo   — путь к логотипу клиента, например "img/logo-nike.png" (можно пусто)
   cover  — путь к обложке проекта, например "img/project1.jpg" (можно пусто)
   about  — описание проекта, 2–3 предложения (пусто = заглушка)
   meta   — строки под описанием, например [['год', '2026'], ['задача', 'моделинг · рендер'], ['софт', 'blender']]
   shots  — ракурсы проекта (3–4 штуки). Для каждого ракурса три картинки
            одного и того же кадра:
              render — чистый рендер
              clay   — серый солид меш
              wire   — wireframe
            пустая строка = заглушка
   ===================================================================== */
const SHOTS_PLACEHOLDER = () => [1, 2, 3, 4].map(() => ({ render: '', clay: '', wire: '' }));

const PROJECTS = [
  { title: 'Название проекта', client: 'Лого клиента', logo: '', cover: '', shots: SHOTS_PLACEHOLDER() },
  { title: 'Название проекта', client: 'Лого клиента', logo: '', cover: '', shots: SHOTS_PLACEHOLDER() },
  { title: 'Название проекта', client: 'Лого клиента', logo: '', cover: '', shots: SHOTS_PLACEHOLDER() },
  { title: 'Название проекта', client: 'Лого клиента', logo: '', cover: '', shots: SHOTS_PLACEHOLDER() },
  { title: 'Название проекта', client: 'Лого клиента', logo: '', cover: '', shots: SHOTS_PLACEHOLDER() },
  { title: 'Название проекта', client: 'Лого клиента', logo: '', cover: '', shots: SHOTS_PLACEHOLDER() },
  { title: 'Название проекта', client: 'Лого клиента', logo: '', cover: '', shots: SHOTS_PLACEHOLDER() },
];
