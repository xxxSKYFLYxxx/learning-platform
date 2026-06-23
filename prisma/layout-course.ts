const practiceChecklist = `
## Как выполнять практику

1. Создайте отдельную папку для урока.
2. Сделайте файлы \`index.html\` и \`style.css\`.
3. Перепечатайте код руками, а потом измените 2-3 значения и посмотрите результат.
4. После выполнения проверьте страницу на ширине 1440px, 768px и 375px.
`.trim();

export function getLayoutCourse(instructorId: string, imageUrl: string) {
  return {
    slug: "verstka-s-nulya",
    title: "Верстка с нуля: HTML, CSS, Flexbox и макеты",
    description:
      "Подробный курс для новичков: как читать макет, писать HTML-структуру, оформлять CSS, собирать блоки на Flexbox и Grid, делать адаптив и доводить верстку до аккуратного результата.",
    price: null,
    isFree: true,
    level: "BEGINNER" as const,
    instructorId,
    imageUrl,
    modules: [
      {
        title: "Старт в верстке",
        lessons: [
          {
            title: "Что такое верстка и как мыслит верстальщик",
            dur: 900,
            free: true,
            content: `
# Что такое верстка

Верстка - это превращение дизайна в живую веб-страницу. Дизайнер показывает, как должно выглядеть, а верстальщик собирает это из HTML и CSS так, чтобы страница открывалась в браузере, была удобной на разных экранах и не разваливалась от реального текста.

## Из чего состоит работа

- **HTML** отвечает за смысл и структуру: заголовки, абзацы, ссылки, списки, секции.
- **CSS** отвечает за внешний вид: размеры, цвета, отступы, сетки, адаптив.
- **Макет** дает ориентир: где какие блоки, какие расстояния, как ведет себя интерфейс.

Верстальщик не просто копирует пиксели. Он разбивает экран на блоки, ищет повторяющиеся элементы, понимает логику отступов и заранее думает, что будет на телефоне.

## Главный алгоритм

1. Посмотреть на макет целиком.
2. Разделить страницу на крупные секции: header, hero, карточки, footer.
3. Внутри каждой секции найти контейнер и элементы.
4. Написать HTML без стилей.
5. Добавить базовые CSS-настройки.
6. Настроить сетки: Flexbox или Grid.
7. Сделать адаптив.
8. Проверить переполнение текста, картинки и разные ширины экрана.

## Мини-практика

Возьмите любой сайт и попробуйте устно разложить первый экран:

- где header;
- где логотип;
- где навигация;
- где главный заголовок;
- где кнопка;
- какие блоки повторяются.

${practiceChecklist}
`.trim(),
          },
          {
            title: "Рабочая среда: VS Code, браузер и DevTools",
            dur: 760,
            free: true,
            content: `
# Рабочая среда

Для старта нужны три инструмента: редактор кода, браузер и инструменты разработчика.

## VS Code

Установите расширения:

| Расширение | Зачем нужно |
|---|---|
| Live Server | Открывает HTML в браузере и обновляет страницу |
| Prettier | Форматирует код |
| Auto Rename Tag | Меняет закрывающий тег вместе с открывающим |

## Структура первого проекта

\`\`\`text
layout-start/
  index.html
  style.css
  images/
\`\`\`

## Подключение CSS

\`\`\`html
<!doctype html>
<html lang="ru">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Моя первая верстка</title>
    <link rel="stylesheet" href="style.css" />
  </head>
  <body>
    <h1>Привет, верстка</h1>
  </body>
</html>
\`\`\`

## DevTools

Откройте DevTools клавишей F12. Самые важные вкладки:

- **Elements** - смотреть HTML и CSS;
- **Computed** - видеть итоговые размеры и отступы;
- **Toggle device toolbar** - проверять мобильные экраны.

## Задание

Создайте проект, подключите CSS и задайте странице базовый фон:

\`\`\`css
body {
  margin: 0;
  font-family: Arial, sans-serif;
  background: #f5f7fb;
  color: #1f2937;
}
\`\`\`
`.trim(),
          },
          {
            title: "HTML-скелет страницы: теги и семантика",
            dur: 940,
            content: `
# HTML-скелет

HTML лучше писать от смысла, а не от внешнего вида. Если это главный заголовок - используем \`h1\`. Если навигация - \`nav\`. Если отдельный раздел - \`section\`.

## Базовая структура страницы

\`\`\`html
<header class="header">
  <a class="logo" href="/">Layout School</a>
  <nav class="nav">
    <a href="#about">О курсе</a>
    <a href="#program">Программа</a>
    <a href="#contacts">Контакты</a>
  </nav>
</header>

<main>
  <section class="hero">
    <h1>Научитесь верстать сайты с нуля</h1>
    <p>Разберем HTML, CSS, Flexbox, Grid и адаптив.</p>
    <a class="button" href="#program">Начать обучение</a>
  </section>
</main>

<footer class="footer">
  <p>© Layout School</p>
</footer>
\`\`\`

## Когда использовать div

\`div\` нужен для группировки, когда нет более точного тега. Например, обертка карточек:

\`\`\`html
<div class="cards">
  <article class="card">...</article>
  <article class="card">...</article>
</div>
\`\`\`

## Частые ошибки

- Делать всю страницу из одних \`div\`.
- Использовать \`h1\` несколько раз без причины.
- Ставить кнопку там, где нужна ссылка.
- Писать классы по цвету: \`red-block\`, \`big-text\`. Лучше по роли: \`alert\`, \`section-title\`.

## Задание

Сверстайте HTML без CSS: header, hero-блок, секцию из трех преимуществ и footer.
`.trim(),
          },
          {
            title: "Как называть классы и держать порядок",
            dur: 720,
            content: `
# Классы и порядок

Хорошая верстка начинается с понятных имен. Через неделю вы должны открыть файл и быстро понять, что где находится.

## Простая схема именования

\`\`\`html
<section class="features">
  <div class="container">
    <h2 class="features__title">Почему это удобно</h2>
    <div class="features__list">
      <article class="feature-card">
        <h3 class="feature-card__title">Практика</h3>
        <p class="feature-card__text">Каждый урок заканчивается задачей.</p>
      </article>
    </div>
  </div>
</section>
\`\`\`

Не обязательно фанатично следовать БЭМ, но идея полезная: блок, его элементы и понятные роли.

## Порядок CSS

\`\`\`css
.feature-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 24px;
  border-radius: 12px;
  background: #ffffff;
}
\`\`\`

Сначала расположение, потом размеры и отступы, потом внешний вид. Так код легче читать.

## Задание

Возьмите HTML из прошлого урока и переименуйте классы так, чтобы по названию было понятно назначение каждого блока.
`.trim(),
          },
        ],
      },
      {
        title: "CSS-фундамент",
        lessons: [
          {
            title: "Подключение CSS, reset и базовые стили",
            dur: 900,
            content: `
# Базовые стили

Перед версткой полезно убрать странности браузера и задать общие правила.

\`\`\`css
*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  font-family: Arial, sans-serif;
  line-height: 1.5;
  color: #111827;
  background: #ffffff;
}

img {
  display: block;
  max-width: 100%;
}

a {
  color: inherit;
  text-decoration: none;
}

button,
input,
textarea {
  font: inherit;
}
\`\`\`

## Контейнер

Контейнер ограничивает ширину контента и центрирует его:

\`\`\`css
.container {
  width: min(100% - 32px, 1120px);
  margin-inline: auto;
}
\`\`\`

На маленьких экранах останется по 16px слева и справа, а на больших контент не растянется слишком широко.

## Задание

Добавьте reset, контейнер и проверьте, что контент не прилипает к краям экрана.
`.trim(),
          },
          {
            title: "Box model: margin, padding, border",
            dur: 980,
            content: `
# Box model

Каждый элемент на странице - прямоугольник. У него есть контент, внутренний отступ, рамка и внешний отступ.

\`\`\`css
.card {
  width: 320px;
  padding: 24px;
  border: 1px solid #e5e7eb;
  margin-bottom: 24px;
}
\`\`\`

## Padding или margin

- \`padding\` - расстояние внутри блока.
- \`margin\` - расстояние между блоками.

Если текст внутри карточки прилип к краям, нужен \`padding\`. Если две карточки стоят слишком близко, нужен \`gap\` или \`margin\`.

## Почему нужен box-sizing

\`\`\`css
* {
  box-sizing: border-box;
}
\`\`\`

С этим правилом ширина элемента включает padding и border. Так проще считать размеры.

## Практика

Сверстайте карточку:

\`\`\`html
<article class="card">
  <h3>HTML</h3>
  <p>Структура страницы и смысловые теги.</p>
</article>
\`\`\`

\`\`\`css
.card {
  max-width: 320px;
  padding: 24px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #fff;
}
\`\`\`
`.trim(),
          },
          {
            title: "Текст, цвета, кнопки и состояния",
            dur: 860,
            content: `
# Визуальная база

Текст должен быть читаемым, кнопки - заметными, а состояния - понятными.

## Типографика

\`\`\`css
.section-title {
  margin: 0 0 16px;
  font-size: 36px;
  line-height: 1.15;
  letter-spacing: 0;
}

.section-text {
  margin: 0;
  max-width: 640px;
  color: #4b5563;
  font-size: 18px;
}
\`\`\`

## Кнопка

\`\`\`css
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  padding: 0 20px;
  border-radius: 8px;
  background: #2563eb;
  color: #fff;
  font-weight: 700;
}

.button:hover {
  background: #1d4ed8;
}

.button:focus-visible {
  outline: 3px solid #93c5fd;
  outline-offset: 3px;
}
\`\`\`

## Задание

Сделайте две кнопки: основную и вторичную. У обеих должны быть hover и focus-visible.
`.trim(),
          },
          {
            title: "Картинки, object-fit и фоны",
            dur: 780,
            content: `
# Картинки

Изображения часто ломают верстку, если не ограничить их размер.

\`\`\`css
img {
  display: block;
  max-width: 100%;
}
\`\`\`

## Карточка с картинкой

\`\`\`css
.product-card__image {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  border-radius: 10px;
}
\`\`\`

\`aspect-ratio\` держит форму, а \`object-fit: cover\` аккуратно обрезает изображение внутри рамки.

## Фон секции

\`\`\`css
.hero {
  padding: 96px 0;
  background:
    linear-gradient(rgba(15, 23, 42, 0.65), rgba(15, 23, 42, 0.65)),
    url("/hero.jpg") center / cover;
  color: #fff;
}
\`\`\`

## Задание

Сверстайте карточку товара с изображением, названием, ценой и кнопкой. Проверьте, что разные картинки не растягивают карточки по высоте.
`.trim(),
          },
        ],
      },
      {
        title: "Flexbox подробно",
        lessons: [
          {
            title: "display: flex, оси и gap",
            dur: 1040,
            content: `
# Flexbox

Flexbox нужен, когда элементы надо разложить в одну линию или колонку и управлять расстояниями между ними.

\`\`\`css
.cards {
  display: flex;
  gap: 24px;
}
\`\`\`

## Контейнер и элементы

\`.cards\` - flex-контейнер. Его прямые дети становятся flex-элементами.

\`\`\`html
<div class="cards">
  <article class="card">1</article>
  <article class="card">2</article>
  <article class="card">3</article>
</div>
\`\`\`

## Оси

По умолчанию главная ось идет слева направо:

\`\`\`css
.cards {
  display: flex;
  flex-direction: row;
}
\`\`\`

Если поставить \`column\`, главная ось станет вертикальной.

## Задание

Сделайте ряд из трех карточек с расстоянием 24px через \`gap\`.
`.trim(),
          },
          {
            title: "justify-content и align-items",
            dur: 1020,
            content: `
# Выравнивание во Flexbox

\`justify-content\` работает вдоль главной оси, \`align-items\` - вдоль поперечной.

\`\`\`css
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}
\`\`\`

## Частые значения

| Свойство | Значение | Что делает |
|---|---|---|
| justify-content | center | центрирует вдоль главной оси |
| justify-content | space-between | раскидывает элементы по краям |
| align-items | center | центрирует по поперечной оси |
| align-items | flex-start | прижимает к началу поперечной оси |

## Практика: header

\`\`\`html
<header class="header">
  <a class="logo" href="/">Logo</a>
  <nav class="nav">
    <a href="#">Курсы</a>
    <a href="#">О нас</a>
    <a href="#">Контакты</a>
  </nav>
</header>
\`\`\`

\`\`\`css
.header,
.nav {
  display: flex;
  align-items: center;
}

.header {
  justify-content: space-between;
  padding: 20px 0;
}

.nav {
  gap: 20px;
}
\`\`\`
`.trim(),
          },
          {
            title: "flex-wrap, flex-basis и адаптивные карточки",
            dur: 1120,
            content: `
# Перенос элементов

Если карточек много, им нужно разрешить переноситься:

\`\`\`css
.cards {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
}

.card {
  flex: 1 1 280px;
}
\`\`\`

\`flex: 1 1 280px\` значит:

- элемент может расти;
- элемент может сжиматься;
- базовая ширина - 280px.

## Когда это удобно

Для простых рядов карточек Flexbox часто быстрее Grid. Карточки сами переносятся на новую строку, когда не хватает места.

## Задание

Сделайте 6 карточек преимуществ. На большом экране они должны идти в 3 колонки, на планшете в 2, на телефоне в 1. Попробуйте решить через \`flex-wrap\` без media queries.
`.trim(),
          },
          {
            title: "Типовые Flexbox-блоки: меню, карточка, hero",
            dur: 1180,
            content: `
# Типовые блоки на Flexbox

## Карточка с кнопкой внизу

\`\`\`css
.course-card {
  display: flex;
  flex-direction: column;
  min-height: 360px;
  padding: 24px;
}

.course-card__button {
  margin-top: auto;
}
\`\`\`

\`margin-top: auto\` забирает свободное место и прижимает кнопку вниз.

## Hero с текстом и медиа

\`\`\`css
.hero__inner {
  display: flex;
  align-items: center;
  gap: 48px;
}

.hero__content,
.hero__media {
  flex: 1 1 0;
}
\`\`\`

## Мобильная версия

\`\`\`css
@media (max-width: 768px) {
  .hero__inner {
    flex-direction: column;
    align-items: flex-start;
  }
}
\`\`\`

## Задание

Соберите hero-блок: слева текст и кнопка, справа изображение. На телефоне изображение должно уйти под текст.
`.trim(),
          },
        ],
      },
      {
        title: "Макеты, Grid и адаптив",
        lessons: [
          {
            title: "Как читать макет перед версткой",
            dur: 1080,
            content: `
# Как читать макет

Перед кодом нужно понять систему макета.

## Чеклист

- Какая максимальная ширина контейнера?
- Сколько колонок в сетке?
- Какие повторяющиеся отступы: 8, 16, 24, 32, 48?
- Какие шрифты и размеры заголовков?
- Какие цвета используются повторно?
- Какие блоки будут адаптироваться?

## Разбор секции

Если в макете есть блок с карточками, сначала определите:

1. Заголовок секции.
2. Подзаголовок или описание.
3. Список карточек.
4. Внутреннюю структуру карточки.
5. Поведение на мобильном экране.

## Задание

Найдите любой лендинг и нарисуйте текстовую структуру первого экрана:

\`\`\`text
header
  logo
  nav
  button
main
  hero
    title
    text
    actions
    image
\`\`\`
`.trim(),
          },
          {
            title: "CSS Grid для сеток карточек",
            dur: 1060,
            content: `
# CSS Grid

Grid удобен, когда нужна настоящая сетка: колонки и строки.

\`\`\`css
.cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}
\`\`\`

## Автоадаптивная сетка

\`\`\`css
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 24px;
}
\`\`\`

Браузер сам решает, сколько колонок помещается.

## Flexbox или Grid

- Flexbox - для строки, меню, выравнивания, простых карточек.
- Grid - для галерей, каталога, сложных областей страницы.

## Задание

Сделайте сетку из 8 карточек через \`repeat(auto-fit, minmax(260px, 1fr))\`.
`.trim(),
          },
          {
            title: "Media queries и мобильная версия",
            dur: 1140,
            content: `
# Адаптив

Адаптив - это не отдельная версия сайта, а набор правил, которые помогают интерфейсу жить на разных ширинах.

## Базовые брейкпоинты

\`\`\`css
@media (max-width: 1024px) {
  .section {
    padding: 72px 0;
  }
}

@media (max-width: 768px) {
  .hero__inner {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .section-title {
    font-size: 28px;
  }
}
\`\`\`

## Что проверять

- Текст не вылезает из блока.
- Кнопки не становятся слишком узкими.
- Картинки не растягиваются.
- Меню не ломает header.
- Горизонтального скролла нет.

## Задание

Возьмите hero из прошлых уроков и сделайте нормальный вид для 1440px, 768px и 375px.
`.trim(),
          },
          {
            title: "Финальный проект: лендинг курса",
            dur: 1800,
            content: `
# Финальный проект

Соберите лендинг курса по верстке. Это будет ваша первая полноценная страница.

## Структура

1. Header: логотип, меню, кнопка.
2. Hero: заголовок, текст, две кнопки, изображение.
3. Преимущества: 3-6 карточек.
4. Программа: список модулей.
5. Практика: блок с примером кода.
6. Footer.

## Требования

- Семантический HTML.
- Единый \`.container\`.
- Flexbox для header и hero.
- Grid для карточек.
- Адаптив до 375px.
- Hover/focus состояния у ссылок и кнопок.
- Нет горизонтального скролла.

## Мини-шаблон секции

\`\`\`html
<section class="program" id="program">
  <div class="container">
    <h2 class="section-title">Программа обучения</h2>
    <div class="program__grid">
      <article class="program-card">
        <h3>HTML</h3>
        <p>Структура, семантика и базовые теги.</p>
      </article>
    </div>
  </div>
</section>
\`\`\`

## Самопроверка

Откройте DevTools и пройдитесь по странице сверху вниз. Если какой-то блок требует объяснения "ну тут потом поправлю", поправьте сразу. Верстка становится крепкой именно на таких мелочах.
`.trim(),
          },
        ],
      },
      {
        title: "Профессиональная практика",
        lessons: [
          {
            title: "Формы: поля, label, ошибки и состояния",
            dur: 1040,
            content: `
# Формы в верстке

Форма должна быть не только красивой, но и понятной: пользователь должен видеть, что заполняет, где ошибка и что произойдет после отправки.

## Базовая структура

\`\`\`html
<form class="contact-form">
  <div class="field">
    <label class="field__label" for="name">Имя</label>
    <input class="field__control" id="name" name="name" type="text" placeholder="Анна" />
    <p class="field__hint">Как к вам обращаться</p>
  </div>

  <div class="field field--error">
    <label class="field__label" for="email">Email</label>
    <input class="field__control" id="email" name="email" type="email" aria-describedby="email-error" />
    <p class="field__error" id="email-error">Введите корректный email</p>
  </div>

  <button class="button" type="submit">Отправить</button>
</form>
\`\`\`

## Стили состояний

\`\`\`css
.field {
  display: grid;
  gap: 6px;
}

.field__control {
  min-height: 48px;
  padding: 0 14px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
}

.field__control:focus {
  outline: 3px solid #bfdbfe;
  border-color: #2563eb;
}

.field--error .field__control {
  border-color: #dc2626;
}

.field__error {
  margin: 0;
  color: #dc2626;
  font-size: 14px;
}
\`\`\`

## Задание

Сверстайте форму заявки из трех полей: имя, email, сообщение. Добавьте обычное состояние, focus и ошибку.
`.trim(),
          },
          {
            title: "Доступность: keyboard, focus и alt",
            dur: 980,
            content: `
# Доступность в верстке

Доступность - это когда сайтом удобно пользоваться не только мышью. Клавиатура, скринридеры, контраст и понятная структура напрямую зависят от верстки.

## Минимальные правила

- У интерактивных элементов должен быть видимый \`:focus-visible\`.
- Картинкам нужен осмысленный \`alt\`, если картинка несет смысл.
- Кнопка делает действие, ссылка ведет на страницу.
- Заголовки идут логично: \`h1\`, потом \`h2\`, потом \`h3\`.
- Нельзя убирать outline без замены.

## Хороший focus

\`\`\`css
a:focus-visible,
button:focus-visible,
input:focus-visible {
  outline: 3px solid #93c5fd;
  outline-offset: 3px;
}
\`\`\`

## Скрытый текст для скринридера

\`\`\`css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
\`\`\`

\`\`\`html
<button class="icon-button">
  <span class="sr-only">Открыть меню</span>
</button>
\`\`\`

## Задание

Пройдите финальный лендинг клавишей Tab. Все ссылки, кнопки и поля должны быть доступны и видимы при фокусе.
`.trim(),
          },
          {
            title: "Pixel perfect без фанатизма",
            dur: 900,
            content: `
# Pixel perfect

Pixel perfect - это не магия и не слепое совпадение каждого пикселя. Это аккуратное соответствие макету: сетка, отступы, размеры, типографика и поведение блоков.

## Что сверять первым

1. Ширина контейнера.
2. Вертикальные отступы секций.
3. Расстояния между элементами.
4. Размеры шрифтов и line-height.
5. Состояния кнопок и ссылок.
6. Адаптивные версии.

## Где не стоит застревать

- Разница в 1px из-за рендера шрифта допустима.
- Реальный текст может быть длиннее макетного.
- Картинки в проде часто отличаются от макета.

## Практический прием

Заведите CSS-переменные для повторяемых значений:

\`\`\`css
:root {
  --container: 1120px;
  --space-section: 96px;
  --space-card: 24px;
  --radius-card: 12px;
  --color-accent: #2563eb;
}
\`\`\`

## Задание

Откройте свой финальный проект рядом с макетом или скриншотом. Выпишите 10 отличий и исправьте минимум 5 самых заметных.
`.trim(),
          },
          {
            title: "Чеклист сдачи верстки",
            dur: 880,
            content: `
# Чеклист перед сдачей

Перед тем как показать верстку заказчику, наставнику или работодателю, пройдитесь по чеклисту.

## HTML

- Один \`h1\` на странице.
- Секции имеют понятную структуру.
- Кнопки и ссылки используются по смыслу.
- У изображений заполнен \`alt\`.

## CSS

- Есть \`box-sizing: border-box\`.
- Нет случайных огромных \`margin\`.
- Повторяющиеся цвета и отступы вынесены в переменные или единый стиль.
- Нет лишнего горизонтального скролла.

## Адаптив

- Проверены ширины 1440px, 1024px, 768px, 375px.
- Меню не ломается.
- Карточки переносятся корректно.
- Текст не вылезает из контейнера.

## Финальное задание

Сделайте README для своего лендинга:

\`\`\`md
# Landing Layout

## Что сверстано
- Header
- Hero
- Cards grid
- Form
- Footer

## Технологии
- HTML
- CSS
- Flexbox
- Grid

## Что проверено
- Desktop
- Tablet
- Mobile
\`\`\`
`.trim(),
          },
        ],
      },
    ],
  };
}
