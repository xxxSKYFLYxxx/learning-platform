import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Pexels CDN — verified free stock photos
const PX = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=800&h=450&fit=crop`;

const IMG = {
  js:        PX(1972464),   // JavaScript code on screen
  react:     PX(1921326),   // display coding programming development
  ts:        PX(4164418),   // black screen with code (VS Code)
  node:      PX(6424590),   // programming code on laptop dark
  python:    PX(3888151),   // workplace laptop code
  git:       PX(546819),    // source code on screen
  css:       PX(270404),    // colorful code coder coding
  nextjs:    PX(25437427),  // computer monitor displaying lines of code
  // Instructor photos
  instructorM: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop",
  instructorF: "https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop",
  // Student avatars
  student1: "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop",
  student2: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop",
  student3: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop",
  student4: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop",
  student5: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop",
};

async function main() {
  console.log("Seeding database...");

  // ── INSTRUCTORS ─────────────────────────────────────────────
  const ivan = await prisma.user.upsert({
    where: { email: "ivan@kurs.dev" },
    update: { role: "INSTRUCTOR", name: "Иван Петров", image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop" },
    create: { email: "ivan@kurs.dev", name: "Иван Петров", role: "INSTRUCTOR", image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop" },
  });

  const maria = await prisma.user.upsert({
    where: { email: "maria@kurs.dev" },
    update: { role: "INSTRUCTOR", name: "Мария Соколова", image: "https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop" },
    create: { email: "maria@kurs.dev", name: "Мария Соколова", role: "INSTRUCTOR", image: "https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop" },
  });

  // ── COURSES ─────────────────────────────────────────────────
  const courses = [
    {
      slug: "osnovy-javascript",
      title: "Основы JavaScript",
      description: "Полный курс по JavaScript с нуля — переменные, функции, массивы, объекты, DOM, асинхронность и ES6+. Идеально для тех, кто делает первые шаги в программировании.",
      price: null, isFree: true, level: "BEGINNER" as const,
      instructorId: ivan.id, imageUrl: IMG.js,
      modules: [
        { title: "Введение в JavaScript", lessons: [
          { title: "Что такое JavaScript и зачем он нужен", dur: 840, free: true },
          { title: "Настройка рабочего окружения: VS Code + Node", dur: 620, free: true },
          { title: "Переменные: var, let, const", dur: 740 },
          { title: "Типы данных: строки, числа, булевы", dur: 680 },
        ]},
        { title: "Управляющие конструкции", lessons: [
          { title: "Условия: if, else, switch", dur: 720 },
          { title: "Циклы: for, while, for...of", dur: 810 },
          { title: "Функции и стрелочные функции", dur: 900 },
        ]},
        { title: "Работа с данными", lessons: [
          { title: "Массивы: map, filter, reduce", dur: 1020 },
          { title: "Объекты и деструктуризация", dur: 880 },
          { title: "Spread и rest операторы", dur: 640 },
        ]},
        { title: "Асинхронный JavaScript", lessons: [
          { title: "Callbacks и их проблемы", dur: 760 },
          { title: "Промисы: Promise, .then, .catch", dur: 920 },
          { title: "async/await — современный подход", dur: 840 },
          { title: "Итоговый проект: ToDo приложение", dur: 2400, free: true },
        ]},
      ],
    },
    {
      slug: "react-s-nulya",
      title: "React с нуля до Pro",
      description: "Современный React с хуками, контекстом, React Query и TypeScript. Создадим полноценное приложение с авторизацией, API-запросами и деплоем на Vercel.",
      price: 4900, isFree: false, level: "INTERMEDIATE" as const,
      instructorId: ivan.id, imageUrl: IMG.react,
      modules: [
        { title: "Основы React", lessons: [
          { title: "Что такое React и Virtual DOM", dur: 780, free: true },
          { title: "JSX: синтаксис и правила", dur: 660 },
          { title: "Компоненты: function vs class", dur: 720 },
          { title: "Props: передача данных между компонентами", dur: 800 },
        ]},
        { title: "Хуки React", lessons: [
          { title: "useState: управление состоянием", dur: 920 },
          { title: "useEffect: сайд-эффекты и жизненный цикл", dur: 1040 },
          { title: "useContext: глобальное состояние", dur: 880 },
          { title: "useMemo и useCallback: оптимизация", dur: 760 },
          { title: "Создание своих кастомных хуков", dur: 840 },
        ]},
        { title: "React Query и работа с API", lessons: [
          { title: "Настройка React Query", dur: 580 },
          { title: "useQuery: загрузка данных", dur: 840 },
          { title: "useMutation: изменение данных", dur: 720 },
          { title: "Кэширование и инвалидация", dur: 680 },
        ]},
        { title: "Итоговый проект", lessons: [
          { title: "Архитектура проекта", dur: 960 },
          { title: "Реализация авторизации", dur: 1200 },
          { title: "CRUD операции с API", dur: 1440 },
          { title: "Деплой на Vercel", dur: 720 },
        ]},
      ],
    },
    {
      slug: "typescript-dlya-razrabotchikov",
      title: "TypeScript для разработчиков",
      description: "Строгая типизация, интерфейсы, дженерики, утилитарные типы и декораторы. Переходим с JS на TS без боли — с реальными примерами из production.",
      price: 3500, isFree: false, level: "INTERMEDIATE" as const,
      instructorId: maria.id, imageUrl: IMG.ts,
      modules: [
        { title: "Базовая типизация", lessons: [
          { title: "Зачем TypeScript? История и преимущества", dur: 600, free: true },
          { title: "Примитивные типы и type inference", dur: 720 },
          { title: "Массивы, кортежи, enum", dur: 640 },
          { title: "Объединения и пересечения типов", dur: 780 },
        ]},
        { title: "Интерфейсы и типы объектов", lessons: [
          { title: "interface vs type: что выбрать", dur: 760 },
          { title: "Опциональные и readonly свойства", dur: 580 },
          { title: "Расширение интерфейсов", dur: 640 },
        ]},
        { title: "Дженерики", lessons: [
          { title: "Введение в Generic Types", dur: 840 },
          { title: "Ограничения дженериков (constraints)", dur: 720 },
          { title: "Утилитарные типы: Partial, Pick, Omit, Record", dur: 900 },
          { title: "Conditional Types и infer", dur: 1020 },
        ]},
      ],
    },
    {
      slug: "nodejs-i-express",
      title: "Node.js и Express: Backend с нуля",
      description: "Создаём REST API на Node.js + Express с авторизацией JWT, базой данных PostgreSQL, ORM Prisma и деплоем на сервер. Всё как в реальных проектах.",
      price: 3900, isFree: false, level: "INTERMEDIATE" as const,
      instructorId: ivan.id, imageUrl: IMG.node,
      modules: [
        { title: "Основы Node.js", lessons: [
          { title: "Node.js: архитектура и event loop", dur: 840, free: true },
          { title: "Модульная система: CommonJS и ES Modules", dur: 680 },
          { title: "Работа с файловой системой (fs, path)", dur: 760 },
          { title: "HTTP-сервер без фреймворка", dur: 920 },
        ]},
        { title: "Express.js", lessons: [
          { title: "Маршрутизация и middleware", dur: 840 },
          { title: "Валидация данных: Zod + Express", dur: 780 },
          { title: "Обработка ошибок", dur: 640 },
          { title: "Загрузка файлов (Multer)", dur: 720 },
        ]},
        { title: "База данных и ORM", lessons: [
          { title: "PostgreSQL: основы SQL", dur: 1080 },
          { title: "Prisma ORM: схема и миграции", dur: 920 },
          { title: "CRUD операции с Prisma", dur: 840 },
          { title: "Отношения между таблицами", dur: 960 },
        ]},
        { title: "Аутентификация и деплой", lessons: [
          { title: "JWT: access и refresh токены", dur: 1020 },
          { title: "Bcrypt: хеширование паролей", dur: 560 },
          { title: "Деплой на Railway / Render", dur: 840 },
        ]},
      ],
    },
    {
      slug: "python-dlya-nachinayushchikh",
      title: "Python для начинающих",
      description: "Первый язык программирования — Python. Изучим синтаксис, структуры данных, ООП и создадим несколько реальных мини-проектов. Без воды.",
      price: null, isFree: true, level: "BEGINNER" as const,
      instructorId: maria.id, imageUrl: IMG.python,
      modules: [
        { title: "Введение в Python", lessons: [
          { title: "Почему Python? Установка и настройка", dur: 600, free: true },
          { title: "Переменные, типы данных, ввод/вывод", dur: 720, free: true },
          { title: "Операторы и выражения", dur: 580 },
        ]},
        { title: "Структуры данных", lessons: [
          { title: "Списки и кортежи", dur: 840 },
          { title: "Словари и множества", dur: 780 },
          { title: "List comprehensions", dur: 660 },
        ]},
        { title: "Функции и ООП", lessons: [
          { title: "Функции, аргументы, lambda", dur: 900 },
          { title: "Классы и объекты", dur: 1020 },
          { title: "Наследование и полиморфизм", dur: 880 },
        ]},
        { title: "Практические проекты", lessons: [
          { title: "Парсер данных с BeautifulSoup", dur: 1200 },
          { title: "Телеграм-бот на aiogram", dur: 1440 },
        ]},
      ],
    },
    {
      slug: "git-i-github",
      title: "Git и GitHub: контроль версий",
      description: "Обязательный инструмент каждого разработчика. Ветки, слияния, rebase, pull requests, CI/CD и работа в команде — всё за 4 часа.",
      price: null, isFree: true, level: "BEGINNER" as const,
      instructorId: ivan.id, imageUrl: IMG.git,
      modules: [
        { title: "Основы Git", lessons: [
          { title: "Установка и настройка Git", dur: 420, free: true },
          { title: "init, add, commit: первый репозиторий", dur: 640, free: true },
          { title: "Просмотр истории: log, diff, show", dur: 580 },
          { title: ".gitignore и удаление файлов", dur: 480 },
        ]},
        { title: "Ветки и слияние", lessons: [
          { title: "Создание и переключение веток", dur: 600 },
          { title: "Merge vs Rebase: когда что использовать", dur: 840 },
          { title: "Разрешение конфликтов", dur: 720 },
        ]},
        { title: "GitHub и командная работа", lessons: [
          { title: "Push, pull, fetch: работа с remote", dur: 660 },
          { title: "Fork, Pull Request, Code Review", dur: 900 },
          { title: "GitHub Actions: первый CI pipeline", dur: 1080 },
        ]},
      ],
    },
    {
      slug: "css-i-tailwind",
      title: "Современный CSS и Tailwind",
      description: "От основ CSS до Flexbox, Grid и Tailwind CSS. Научимся верстать адаптивные интерфейсы быстро и красиво. Включает компонентный подход и анимации.",
      price: 2500, isFree: false, level: "BEGINNER" as const,
      instructorId: maria.id, imageUrl: IMG.css,
      modules: [
        { title: "CSS фундамент", lessons: [
          { title: "Box model, display, position", dur: 900, free: true },
          { title: "Шрифты, цвета, единицы измерения", dur: 720 },
          { title: "Псевдоклассы и псевдоэлементы", dur: 640 },
        ]},
        { title: "Flexbox и Grid", lessons: [
          { title: "Flexbox полное руководство", dur: 1200 },
          { title: "CSS Grid: двумерные макеты", dur: 1080 },
          { title: "Адаптивный дизайн и media queries", dur: 840 },
        ]},
        { title: "Tailwind CSS", lessons: [
          { title: "Установка и конфигурация", dur: 480 },
          { title: "Utility-first подход", dur: 720 },
          { title: "Кастомизация и дизайн-токены", dur: 660 },
          { title: "Анимации и transitions", dur: 780 },
          { title: "Финальный проект: лендинг", dur: 1800 },
        ]},
      ],
    },
    {
      slug: "nextjs-polny-kurs",
      title: "Next.js: полный курс",
      description: "App Router, SSR, ISR, Server Actions, авторизация, деплой на Vercel. Самый полный русскоязычный курс по Next.js 14+ от архитектуры до production.",
      price: 5900, isFree: false, level: "ADVANCED" as const,
      instructorId: ivan.id, imageUrl: IMG.nextjs,
      modules: [
        { title: "App Router и файловая структура", lessons: [
          { title: "Next.js 14: что нового в App Router", dur: 900, free: true },
          { title: "Layouts, Pages, Loading, Error", dur: 840 },
          { title: "Route Groups и параллельные маршруты", dur: 720 },
          { title: "Dynamic Routes и generateStaticParams", dur: 780 },
        ]},
        { title: "Server и Client Components", lessons: [
          { title: "RSC: React Server Components объяснены", dur: 1020 },
          { title: "use client: когда и зачем", dur: 720 },
          { title: "Data fetching паттерны", dur: 900 },
          { title: "Кэширование: fetch, revalidate, tags", dur: 840 },
        ]},
        { title: "Server Actions и формы", lessons: [
          { title: "Server Actions: мутации данных", dur: 960 },
          { title: "useFormState и useFormStatus", dur: 720 },
          { title: "Оптимистичные обновления", dur: 680 },
        ]},
        { title: "Production", lessons: [
          { title: "Metadata API и SEO", dur: 780 },
          { title: "Next Auth v5: аутентификация", dur: 1200 },
          { title: "Middleware и защита маршрутов", dur: 660 },
          { title: "Оптимизация изображений и шрифтов", dur: 600 },
          { title: "Деплой на Vercel: CI/CD", dur: 840 },
        ]},
      ],
    },
  ];

  for (const courseData of courses) {
    const { modules: modulesData, ...courseFields } = courseData;

    // Delete existing course and recreate for clean state
    const existing = await prisma.course.findUnique({ where: { slug: courseFields.slug } });
    if (existing) {
      await prisma.course.delete({ where: { slug: courseFields.slug } });
    }

    const course = await prisma.course.create({
      data: { ...courseFields, published: true },
    });

    for (let mIdx = 0; mIdx < modulesData.length; mIdx++) {
      const mod = await prisma.module.create({
        data: { courseId: course.id, title: modulesData[mIdx].title, sortOrder: mIdx },
      });

      for (let lIdx = 0; lIdx < modulesData[mIdx].lessons.length; lIdx++) {
        const l = modulesData[mIdx].lessons[lIdx];
        await prisma.lesson.create({
          data: {
            moduleId: mod.id,
            title: l.title,
            duration: l.dur,
            isFree: (l as { free?: boolean }).free ?? false,
            sortOrder: lIdx,
          },
        });
      }
    }

    console.log(`✓ ${course.title}`);
  }

  // ── STUDENTS ────────────────────────────────────────────────
  const students = [
    { email: "alex@mail.ru",      name: "Алексей Смирнов",   image: "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop" },
    { email: "anna@gmail.com",    name: "Анна Козлова",      image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop" },
    { email: "dmitry@yandex.ru",  name: "Дмитрий Волков",   image: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop" },
    { email: "elena@mail.ru",     name: "Елена Морозова",    image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop" },
    { email: "nikita@gmail.com",  name: "Никита Попов",      image: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop" },
  ];

  const createdStudents = await Promise.all(
    students.map((s) =>
      prisma.user.upsert({ where: { email: s.email }, update: s, create: s })
    )
  );

  // ── ENROLLMENTS ─────────────────────────────────────────────
  const allCourses = await prisma.course.findMany({ select: { id: true, slug: true } });
  const courseMap = Object.fromEntries(allCourses.map((c) => [c.slug, c.id]));

  const enrollmentPairs = [
    [createdStudents[0], "osnovy-javascript"],
    [createdStudents[0], "react-s-nulya"],
    [createdStudents[1], "osnovy-javascript"],
    [createdStudents[1], "python-dlya-nachinayushchikh"],
    [createdStudents[1], "css-i-tailwind"],
    [createdStudents[2], "react-s-nulya"],
    [createdStudents[2], "typescript-dlya-razrabotchikov"],
    [createdStudents[2], "nodejs-i-express"],
    [createdStudents[3], "git-i-github"],
    [createdStudents[3], "osnovy-javascript"],
    [createdStudents[4], "nextjs-polny-kurs"],
    [createdStudents[4], "react-s-nulya"],
  ];

  for (const [student, slug] of enrollmentPairs) {
    const courseId = courseMap[slug as string];
    if (!courseId) continue;
    await prisma.enrollment.upsert({
      where: { userId_courseId: { userId: (student as { id: string }).id, courseId } },
      update: {},
      create: { userId: (student as { id: string }).id, courseId, status: "ACTIVE" },
    });
  }

  // ── REVIEWS ─────────────────────────────────────────────────
  const reviews = [
    { studentIdx: 0, slug: "osnovy-javascript", rating: 5, text: "Лучший курс по JS для начинающих! Всё объяснено с нуля, без воды. За месяц прошёл весь материал и уже пишу свои проекты." },
    { studentIdx: 0, slug: "react-s-nulya",     rating: 5, text: "Иван объясняет сложные вещи простым языком. После этого курса получил первую работу фронтенд-разработчиком. Рекомендую!" },
    { studentIdx: 1, slug: "osnovy-javascript", rating: 4, text: "Отличный курс! Единственное пожелание — больше задач для самостоятельной работы. В целом всё очень понятно." },
    { studentIdx: 1, slug: "python-dlya-nachinayushchikh", rating: 5, text: "Мария — прекрасный преподаватель. Объясняет чётко и по делу. Python стал моим вторым языком." },
    { studentIdx: 2, slug: "react-s-nulya",     rating: 5, text: "Глубокий курс с реальными примерами. Особенно понравился раздел про React Query — до этого не понимал, зачем он нужен." },
    { studentIdx: 2, slug: "typescript-dlya-razrabotchikov", rating: 5, text: "Наконец-то понял дженерики и utility types! Курс структурирован идеально, от простого к сложному." },
    { studentIdx: 3, slug: "git-i-github",      rating: 5, text: "За один день разобрался с Git! Теперь уверенно пишу коммиты, создаю PR и работаю в команде." },
    { studentIdx: 4, slug: "nextjs-polny-kurs", rating: 5, text: "Самый полный курс по Next.js на русском. Server Actions, кэширование, деплой — всё разобрали досконально." },
  ];

  for (const r of reviews) {
    const student = createdStudents[r.studentIdx];
    const courseId = courseMap[r.slug];
    if (!courseId) continue;
    await prisma.review.upsert({
      where: { userId_courseId: { userId: student.id, courseId } },
      update: {},
      create: { userId: student.id, courseId, rating: r.rating, text: r.text },
    });
  }

  console.log("\n✅ Seed complete!");
  console.log(`   ${courses.length} courses, ${students.length} students, ${reviews.length} reviews`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
