export type CmsLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

export type CmsInstructor = {
  id: string;
  name: string;
  email: string;
  role: string;
  image: string;
  bio: string;
};

export type CmsCourse = {
  id: string;
  slug: string;
  title: string;
  description: string;
  imageUrl: string;
  isFree: boolean;
  level: CmsLevel;
  price: number | null;
  instructorId: string;
  enrollments: number;
  reviews: number;
  rating: number;
  published: boolean;
};

export type CmsUser = {
  id: string;
  name: string;
  email: string;
  role: "STUDENT" | "INSTRUCTOR" | "ADMIN";
  courses: number;
  joinedAt: string;
};

export type CmsReview = {
  id: string;
  courseSlug: string;
  courseTitle: string;
  userName: string;
  rating: number;
  text: string;
};

export const cmsInstructors: CmsInstructor[] = [
  {
    id: "fallback-instructor-layout",
    name: "Мария Соколова",
    email: "maria@kurs.dev",
    role: "Frontend Lead",
    image: "https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop",
    bio: "Учит верстке, CSS-архитектуре и аккуратной работе с макетами.",
  },
  {
    id: "fallback-instructor-js",
    name: "Иван Петров",
    email: "ivan@kurs.dev",
    role: "Fullstack Developer",
    image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop",
    bio: "Показывает JavaScript, React и серверную разработку на реальных задачах.",
  },
  {
    id: "fallback-instructor-product",
    name: "Алина Морозова",
    email: "alina@kurs.dev",
    role: "Product Designer",
    image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop",
    bio: "Объясняет дизайн-системы, UI-паттерны и передачу макета в разработку.",
  },
  {
    id: "fallback-instructor-backend",
    name: "Сергей Волков",
    email: "sergey@kurs.dev",
    role: "Backend Engineer",
    image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop",
    bio: "Ведет backend, базы данных, API и деплой приложений.",
  },
];

export const cmsCourses: CmsCourse[] = [
  {
    id: "fallback-layout",
    slug: "verstka-s-nulya",
    title: "Верстка с нуля: HTML, CSS, Flexbox и макеты",
    description: "Подробный курс для новичков: HTML-структура, CSS, Flexbox, Grid, адаптив, чтение макетов и финальный лендинг.",
    imageUrl: "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800&h=450&fit=crop",
    isFree: true,
    level: "BEGINNER",
    price: null,
    instructorId: "fallback-instructor-layout",
    enrollments: 184,
    reviews: 24,
    rating: 5,
    published: true,
  },
  {
    id: "fallback-css",
    slug: "css-i-tailwind",
    title: "Современный CSS и Tailwind",
    description: "CSS-фундамент, Flexbox, Grid, адаптивные интерфейсы и компонентный подход.",
    imageUrl: "https://images.pexels.com/photos/270404/pexels-photo-270404.jpeg?auto=compress&cs=tinysrgb&w=800&h=450&fit=crop",
    isFree: true,
    level: "BEGINNER",
    price: null,
    instructorId: "fallback-instructor-layout",
    enrollments: 143,
    reviews: 19,
    rating: 4.9,
    published: true,
  },
  {
    id: "fallback-js",
    slug: "osnovy-javascript",
    title: "Основы JavaScript",
    description: "Первый язык для интерактивных страниц: переменные, функции, DOM и практика.",
    imageUrl: "https://images.pexels.com/photos/1972464/pexels-photo-1972464.jpeg?auto=compress&cs=tinysrgb&w=800&h=450&fit=crop",
    isFree: true,
    level: "BEGINNER",
    price: null,
    instructorId: "fallback-instructor-js",
    enrollments: 210,
    reviews: 31,
    rating: 4.8,
    published: true,
  },
  {
    id: "fallback-react",
    slug: "react-dlya-nachinayushchih",
    title: "React для начинающих",
    description: "Компоненты, состояние, props, формы и сборка первого личного кабинета.",
    imageUrl: "https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=800&h=450&fit=crop",
    isFree: false,
    level: "INTERMEDIATE",
    price: 3990,
    instructorId: "fallback-instructor-js",
    enrollments: 126,
    reviews: 18,
    rating: 4.9,
    published: true,
  },
  {
    id: "fallback-next",
    slug: "nextjs-fullstack",
    title: "Next.js Fullstack",
    description: "App Router, серверные компоненты, API routes, авторизация и деплой на Vercel.",
    imageUrl: "https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=800&h=450&fit=crop",
    isFree: false,
    level: "ADVANCED",
    price: 5900,
    instructorId: "fallback-instructor-js",
    enrollments: 98,
    reviews: 14,
    rating: 4.9,
    published: true,
  },
  {
    id: "fallback-ui",
    slug: "ui-kit-i-design-system",
    title: "UI-kit и дизайн-система",
    description: "Как собрать сетку, типографику, компоненты, состояния и документацию для продукта.",
    imageUrl: "https://images.pexels.com/photos/3153201/pexels-photo-3153201.jpeg?auto=compress&cs=tinysrgb&w=800&h=450&fit=crop",
    isFree: false,
    level: "INTERMEDIATE",
    price: 3490,
    instructorId: "fallback-instructor-product",
    enrollments: 76,
    reviews: 11,
    rating: 4.7,
    published: true,
  },
  {
    id: "fallback-node",
    slug: "nodejs-api",
    title: "Node.js и REST API",
    description: "Express, маршруты, middleware, валидация, ошибки и подключение базы данных.",
    imageUrl: "https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=800&h=450&fit=crop",
    isFree: false,
    level: "INTERMEDIATE",
    price: 4490,
    instructorId: "fallback-instructor-backend",
    enrollments: 87,
    reviews: 12,
    rating: 4.8,
    published: true,
  },
  {
    id: "fallback-db",
    slug: "postgresql-dlya-razrabotchika",
    title: "PostgreSQL для разработчика",
    description: "Таблицы, связи, индексы, транзакции и запросы, которые не страшно запускать в production.",
    imageUrl: "https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=800&h=450&fit=crop",
    isFree: false,
    level: "INTERMEDIATE",
    price: 2990,
    instructorId: "fallback-instructor-backend",
    enrollments: 64,
    reviews: 9,
    rating: 4.8,
    published: true,
  },
  {
    id: "fallback-git",
    slug: "git-i-komandnaya-razrabotka",
    title: "Git и командная разработка",
    description: "Коммиты, ветки, pull request, code review и рабочий процесс небольшой команды.",
    imageUrl: "https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=800&h=450&fit=crop",
    isFree: true,
    level: "BEGINNER",
    price: null,
    instructorId: "fallback-instructor-backend",
    enrollments: 172,
    reviews: 20,
    rating: 4.8,
    published: true,
  },
  {
    id: "fallback-deploy",
    slug: "deploi-na-vercel-i-docker",
    title: "Деплой на Vercel и Docker",
    description: "Переменные окружения, сборка, Dockerfile, CI/CD и проверка приложения после релиза.",
    imageUrl: "https://images.pexels.com/photos/325229/pexels-photo-325229.jpeg?auto=compress&cs=tinysrgb&w=800&h=450&fit=crop",
    isFree: false,
    level: "ADVANCED",
    price: 4900,
    instructorId: "fallback-instructor-backend",
    enrollments: 58,
    reviews: 8,
    rating: 4.7,
    published: true,
  },
];

export const cmsUsers: CmsUser[] = [
  { id: "user-1", name: "Анна Лебедева", email: "anna@example.com", role: "STUDENT", courses: 3, joinedAt: "2026-04-12" },
  { id: "user-2", name: "Дмитрий Орлов", email: "dima@example.com", role: "STUDENT", courses: 5, joinedAt: "2026-04-19" },
  { id: "user-3", name: "Мария Соколова", email: "maria@kurs.dev", role: "INSTRUCTOR", courses: 2, joinedAt: "2026-03-02" },
  { id: "user-4", name: "Иван Петров", email: "ivan@kurs.dev", role: "INSTRUCTOR", courses: 3, joinedAt: "2026-03-04" },
  { id: "user-5", name: "Матвей Админ", email: "admin@kurs.dev", role: "ADMIN", courses: 0, joinedAt: "2026-02-21" },
  { id: "user-6", name: "Елена Новикова", email: "elena@example.com", role: "STUDENT", courses: 2, joinedAt: "2026-05-08" },
  { id: "user-7", name: "Артем Ким", email: "artem@example.com", role: "STUDENT", courses: 1, joinedAt: "2026-05-16" },
];

export const cmsReviews: CmsReview[] = [
  {
    id: "review-1",
    courseSlug: "verstka-s-nulya",
    courseTitle: "Верстка с нуля",
    userName: "Анна",
    rating: 5,
    text: "Понравилось, что верстку объясняют через реальные блоки: header, карточки, сетки и адаптив.",
  },
  {
    id: "review-2",
    courseSlug: "css-i-tailwind",
    courseTitle: "Современный CSS",
    userName: "Алексей",
    rating: 5,
    text: "После уроков по Flexbox наконец стало понятно, почему элементы ведут себя именно так.",
  },
  {
    id: "review-3",
    courseSlug: "nextjs-fullstack",
    courseTitle: "Next.js Fullstack",
    userName: "Дмитрий",
    rating: 5,
    text: "Разобрался с App Router и смог выложить свой проект на Vercel без паники.",
  },
  {
    id: "review-4",
    courseSlug: "react-dlya-nachinayushchih",
    courseTitle: "React для начинающих",
    userName: "Елена",
    rating: 4,
    text: "Хороший темп, много практики, формы и состояние стали понятнее.",
  },
  {
    id: "review-5",
    courseSlug: "nodejs-api",
    courseTitle: "Node.js и REST API",
    userName: "Артем",
    rating: 5,
    text: "Классно, что сразу показали валидацию, ошибки и нормальную структуру API.",
  },
];
