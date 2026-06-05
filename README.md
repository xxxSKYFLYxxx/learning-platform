# КУРС — Онлайн-платформа обучения

> Практические курсы по программированию от реальных разработчиков.  
> Российский стек · Работает без VPN · Неорутализм × Конструктивизм

[![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js)](https://nextjs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-7.8-2D3748?logo=prisma)](https://prisma.io/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

---

## О проекте

**КУРС** — полноценная обучающая платформа с видеоплеером, системой прогресса, Stripe-оплатой и выдачей PDF-сертификатов. Разработана по принципу «автономного агента» — каждая итерация сдаётся в виде рабочего артефакта.

**Демо-данные:** 8 курсов · 105 уроков · 5 студентов · 8 отзывов

---

## Технологический стек

### Frontend
| Технология | Версия | Назначение |
|---|---|---|
| **Next.js** | 16.2 | App Router, SSR/ISR, Server Actions |
| **React** | 19.2 | UI-компоненты |
| **TypeScript** | 5+ | Строгая типизация |
| **Tailwind CSS** | 4 | Utility-first стили |
| **Unbounded + Manrope** | Google Fonts | Типографика (кириллица) |
| **Space Mono** | Google Fonts | Числа, цены, код |

### Backend & Data
| Технология | Версия | Назначение |
|---|---|---|
| **Prisma** | 7.8 | ORM + миграции |
| **PostgreSQL** | 17 | Основная база данных |
| **@prisma/adapter-pg** | — | Prisma 7 Driver Adapter |
| **NextAuth.js** | v5 beta | Email magic link авторизация |

### Интеграции (все российские)
| Сервис | Назначение | Работает без VPN |
|---|---|---|
| **ЮКасса** | Оплата: карты, СБП, ЮMoney, SberPay | ✅ |
| **Kinescope** | Видеохостинг, HLS стриминг, аналитика | ✅ |
| **ВКонтакте OAuth** | Вход через VK | ✅ |
| **Яндекс ID** | Вход через Яндекс | ✅ |
| **Яндекс Метрика** | Веб-аналитика, вебвизор, цели | ✅ |
| **Resend** | Email magic link | ✅ |
| **Sanity CMS** | Контент курсов | ✅ |
| **@react-pdf/renderer** | PDF-сертификаты | ✅ |

### Хостинг (рекомендуемый российский)
| Сервис | Назначение |
|---|---|
| **Timeweb Cloud** | VPS / облачный деплой |
| **Selectel** | Облачная платформа, S3-хранилище |
| **Яндекс Cloud** | Managed PostgreSQL, Functions |
| **ISPmanager** | Панель управления сервером |
| **GitHub Actions** | CI/CD: lint → typecheck → build |
| **Docker Compose** | PostgreSQL для локальной разработки |

---

## Функциональность

### Студент
- Вход через email magic link (без пароля)
- Каталог курсов с полнотекстовым поиском и фильтрами (уровень, цена, сортировка)
- Просмотр уроков с Mux Player (адаптивный стриминг)
- Автосохранение прогресса каждые 10 секунд
- Кнопка «Урок завершён» + автопереход к следующему
- Личный кабинет с прогресс-барами по каждому курсу
- PDF-сертификат с уникальным кодом верификации при 100% завершении

### Преподаватель (`/instructor`)
- Дашборд: выручка, студенты, рейтинг
- Загрузка видео напрямую в Mux через signed upload URL
- Управление модулями и уроками курса

### Администратор (`/admin`)
- Полный CRUD курсов, модулей, уроков
- Управление пользователями и ролями (Student / Instructor / Admin)
- Таблица заявок со статусами и суммами
- Публикация / снятие курсов в один клик

### Публичные страницы
- Главная с hero, секцией преимуществ, преподавателями, отзывами
- Каталог `/courses` с поиском и сортировкой
- Страница курса `/courses/[slug]` с программой и отзывами
- Публичная верификация сертификатов `/certificates/[code]`
- `/sitemap.xml` и `/robots.txt` для SEO

---

## Структура проекта

```
learning_platform/
├── prisma/
│   ├── schema.prisma          # Схема БД (12 моделей)
│   ├── seed.ts                # Тестовые данные (8 курсов)
│   └── migrations/            # SQL-миграции
│
├── src/
│   ├── app/
│   │   ├── (auth)/login/          # Страница входа
│   │   ├── (public)/courses/      # Каталог + страница курса
│   │   ├── admin/                 # Панель администратора
│   │   │   ├── page.tsx           # Дашборд
│   │   │   ├── courses/           # CRUD курсов + модули/уроки
│   │   │   ├── users/             # Управление ролями
│   │   │   ├── enrollments/       # Все заявки
│   │   │   └── actions.ts         # Server Actions
│   │   ├── api/
│   │   │   ├── auth/[...nextauth] # NextAuth handlers
│   │   │   ├── certificates/[code]/pdf # Генерация PDF
│   │   │   ├── enrollments/       # Запись + Stripe Checkout
│   │   │   ├── mux/               # Upload URL + webhook
│   │   │   ├── progress/          # Сохранение прогресса урока
│   │   │   └── stripe/webhook     # Подтверждение оплаты
│   │   ├── certificates/[code]/   # Публичная верификация
│   │   ├── dashboard/             # ЛК студента + сертификаты
│   │   ├── instructor/            # Кабинет преподавателя
│   │   ├── learn/[course]/[lesson] # Видеоплеер
│   │   ├── page.tsx               # Главная страница
│   │   ├── sitemap.ts             # SEO sitemap
│   │   └── robots.ts              # robots.txt
│   │
│   ├── components/
│   │   ├── admin/AdminNav.tsx      # Сайдбар админки
│   │   ├── course/CourseCard.tsx   # Карточка курса
│   │   ├── instructor/VideoUploader.tsx
│   │   ├── layout/                # Header, Footer, Logo, Providers
│   │   └── lesson/
│   │       ├── LessonPlayer.tsx   # Mux Player + автопрогресс
│   │       ├── CourseSidebar.tsx  # Аккордеон модулей
│   │       ├── CompleteButton.tsx # Завершение урока
│   │       └── CertificatePDF.tsx # PDF шаблон (@react-pdf)
│   │
│   ├── lib/
│   │   ├── auth.ts    # NextAuth + PrismaAdapter
│   │   ├── prisma.ts  # Singleton + PrismaPg adapter
│   │   ├── stripe.ts  # Stripe клиент
│   │   ├── mux.ts     # Mux клиент
│   │   ├── sanity.ts  # Sanity клиент + urlFor
│   │   └── utils.ts   # cn, formatPrice, formatDuration, slugify
│   │
│   ├── types/
│   │   ├── index.ts        # CourseWithRelations, CourseCard, etc.
│   │   └── next-auth.d.ts  # Session: { id, role }
│   │
│   └── proxy.ts            # Middleware: защита маршрутов + RBAC
│
├── .claude/launch.json      # Preview server конфиг
├── .env.example             # Шаблон переменных
├── docker-compose.yml       # PostgreSQL + volumes
├── next.config.ts           # Image remotePatterns, turbopack
└── prisma.config.ts         # Prisma 7 datasource (DATABASE_URL)
```

---

## Схема базы данных

```
User ──── Account / Session     (NextAuth)
  │
  ├── Enrollment ──── Course    (статус: ACTIVE / COMPLETED / REFUNDED)
  ├── LessonProgress ──── Lesson (watchedSeconds, completed)
  ├── Review ──── Course        (rating 1-5, text)
  ├── Certificate ──── Course   (uniqueCode UUID)
  └── Course[]  (как Instructor)

Course ──── Module ──── Lesson  (sortOrder, isFree, muxAssetId)
  │
  └── CourseTag ──── Tag

enum Role       { STUDENT | INSTRUCTOR | ADMIN }
enum CourseLevel { BEGINNER | INTERMEDIATE | ADVANCED }
```

---

## Быстрый старт

### Требования
- Node.js 20+
- PostgreSQL 17+ (или Docker)
- npm 10+

### 1. Клонировать и установить зависимости

```bash
git clone https://github.com/xxxSKYFLYxxx/learning-platform.git
cd learning-platform
npm install
```

### 2. Настроить переменные окружения

```bash
cp .env.example .env
```

Минимальный `.env` для запуска:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/learning_platform"
AUTH_SECRET="сгенерировать: openssl rand -base64 32"
AUTH_URL="http://localhost:3000"
RESEND_API_KEY="re_xxxxxxxxxxxx"
EMAIL_FROM="noreply@yourdomain.com"
```

### 3. Запустить PostgreSQL

```bash
# Docker
docker-compose up -d

# Или создать БД вручную
createdb learning_platform
```

### 4. Применить миграции

```bash
npx prisma migrate dev
```

### 5. Заполнить тестовыми данными

```bash
DATABASE_URL="postgresql://..." npx tsx prisma/seed.ts
```

Создаст: 8 курсов · 105 уроков · 2 преподавателя · 5 студентов · 8 отзывов

### 6. Запустить сервер разработки

```bash
npm run dev
```

Открыть [http://localhost:3000](http://localhost:3000)

> Для доступа к `/admin` нужно поставить роль `ADMIN` через Prisma Studio (`npx prisma studio`) или SQL.

---

## Команды

```bash
# -- Разработка ----------------------------------------
npm run dev              # Dev-сервер с Turbopack HMR
npm run build            # Production сборка
npm run start            # Запуск production-сборки
npm run lint             # ESLint проверка
npx tsc --noEmit         # TypeScript без компиляции

# -- База данных ---------------------------------------
npx prisma migrate dev   # Создать и применить миграцию
npx prisma migrate deploy # Применить в production (без промпта)
npx prisma studio        # GUI для БД в браузере
npx prisma generate      # Регенерировать Prisma Client
npx prisma db push       # Sync схемы без создания миграции
npx prisma db execute --stdin < query.sql  # SQL запрос

# -- Тестовые данные -----------------------------------
DATABASE_URL="..." npx tsx prisma/seed.ts

# -- Деплой --------------------------------------------
vercel                   # Деплой preview
vercel --prod            # Деплой production
```

---

## Переменные окружения

| Переменная | Обязательно | Описание |
|---|---|---|
| `DATABASE_URL` | ✅ | `postgresql://user:pass@host:5432/db` |
| `AUTH_SECRET` | ✅ | 32+ символа случайной строки |
| `AUTH_URL` | ✅ | Базовый URL (`https://yourdomain.com`) |
| `RESEND_API_KEY` | ✅ | Для отправки magic link email |
| `EMAIL_FROM` | ✅ | Email отправителя |
| `VK_CLIENT_ID` | ВКонтакте вход | ID приложения vk.com |
| `VK_CLIENT_SECRET` | ВКонтакте вход | Защищённый ключ |
| `YANDEX_CLIENT_ID` | Яндекс ID | ID приложения oauth.yandex.ru |
| `YANDEX_CLIENT_SECRET` | Яндекс ID | Пароль приложения |
| `YOOKASSA_SHOP_ID` | Оплата | ID магазина ЮКасса |
| `YOOKASSA_SECRET_KEY` | Оплата | Секретный ключ ЮКасса |
| `KINESCOPE_API_KEY` | Видео | API-ключ Kinescope |
| `KINESCOPE_PROJECT_ID` | Видео | ID проекта Kinescope |
| `NEXT_PUBLIC_YANDEX_METRIKA_ID` | Аналитика | Номер счётчика Метрики |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | CMS | ID проекта Sanity |
| `NEXT_PUBLIC_SANITY_DATASET` | CMS | `production` |

---

## Роли и доступ

| Маршрут | Кто видит |
|---|---|
| `/` `/courses/*` `/certificates/*` | Все |
| `/login` | Только неавторизованные |
| `/dashboard/*` | Любой авторизованный |
| `/learn/*` | Авторизованный + записан на курс |
| `/instructor/*` | Роль `INSTRUCTOR` или `ADMIN` |
| `/admin/*` | Только роль `ADMIN` |

---

## Дизайн-система

**Концепция:** Неорутализм × Русский конструктивизм

| Переменная | Цвет | Назначение |
|---|---|---|
| `--color-ink` | `#0F0F0F` | Текст, рамки |
| `--color-accent` | `#D4402F` | CTA, акценты |
| `--color-page` | `#FAFAF7` | Фон страниц |
| `--color-surface` | `#FFFFFF` | Карточки, панели |
| `--color-muted` | `#787068` | Вторичный текст |
| `--color-success` | `#1A9E6E` | Завершено, записан |
| `--font-display` | Unbounded Black | Заголовки (поддержка кириллицы) |
| `--font-sans` | Manrope | Основной текст |
| `--font-mono` | Space Mono | Числа, цены, код |

**Сигнатурный элемент:** `box-shadow: 4px 4px 0 #0F0F0F` — брутальная офсетная тень

**Логотип:** `К|УРС` — типографический знак: красный блок «К» + outlined «УРС»

---

## Figma

[КУРС — Design System](https://www.figma.com/design/jGmLndpzVE4Bu8rymBOkPi)

| Страница | Содержимое |
|---|---|
| 01 Brand & Tokens | Цвета, типографика, кнопки |
| 02 Homepage | Полный мокап главной страницы |
| 03 Components | UI-компоненты |
| 04 Logo Design | Система логотипа: построение, варианты, масштаб |

---

## Репозиторий

[github.com/xxxSKYFLYxxx/learning-platform](https://github.com/xxxSKYFLYxxx/learning-platform)

---

## Лицензия

MIT — свободно для коммерческого и личного использования.
