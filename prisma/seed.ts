import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Instructor
  const instructor = await prisma.user.upsert({
    where: { email: "instructor@example.com" },
    update: {},
    create: {
      email: "instructor@example.com",
      name: "Иван Петров",
      role: "INSTRUCTOR",
    },
  });

  // Course 1 -- free
  const course1 = await prisma.course.upsert({
    where: { slug: "osnovy-javascript" },
    update: {},
    create: {
      slug: "osnovy-javascript",
      title: "Основы JavaScript",
      description: "Полный курс по JavaScript с нуля -- переменные, функции, массивы, объекты, асинхронность.",
      price: null,
      isFree: true,
      published: true,
      level: "BEGINNER",
      instructorId: instructor.id,
    },
  });

  const mod1 = await prisma.module.upsert({
    where: { id: "mod-js-1" },
    update: {},
    create: {
      id: "mod-js-1",
      courseId: course1.id,
      title: "Введение в JavaScript",
      sortOrder: 0,
    },
  });

  for (const [i, title] of [
    "Что такое JavaScript и зачем он нужен",
    "Переменные: var, let, const",
    "Типы данных и операторы",
    "Функции и область видимости",
  ].entries()) {
    await prisma.lesson.upsert({
      where: { id: `lesson-js-1-${i}` },
      update: {},
      create: {
        id: `lesson-js-1-${i}`,
        moduleId: mod1.id,
        title,
        sortOrder: i,
        isFree: i === 0,
        duration: 600 + i * 120,
      },
    });
  }

  const mod2 = await prisma.module.upsert({
    where: { id: "mod-js-2" },
    update: {},
    create: {
      id: "mod-js-2",
      courseId: course1.id,
      title: "Работа с DOM",
      sortOrder: 1,
    },
  });

  for (const [i, title] of [
    "Что такое DOM",
    "Поиск элементов: querySelector",
    "События и обработчики",
  ].entries()) {
    await prisma.lesson.upsert({
      where: { id: `lesson-js-2-${i}` },
      update: {},
      create: {
        id: `lesson-js-2-${i}`,
        moduleId: mod2.id,
        title,
        sortOrder: i,
        isFree: false,
        duration: 720 + i * 90,
      },
    });
  }

  // Course 2 -- paid
  const course2 = await prisma.course.upsert({
    where: { slug: "react-s-nulya" },
    update: {},
    create: {
      slug: "react-s-nulya",
      title: "React с нуля до Pro",
      description: "Современный React: хуки, контекст, React Query, Next.js. Создадим реальное приложение с нуля.",
      price: 4900,
      isFree: false,
      published: true,
      level: "INTERMEDIATE",
      instructorId: instructor.id,
    },
  });

  const mod3 = await prisma.module.upsert({
    where: { id: "mod-react-1" },
    update: {},
    create: {
      id: "mod-react-1",
      courseId: course2.id,
      title: "Основы React",
      sortOrder: 0,
    },
  });

  for (const [i, title] of [
    "Компоненты и JSX",
    "Props и State",
    "Хуки: useState и useEffect",
    "Работа с формами",
  ].entries()) {
    await prisma.lesson.upsert({
      where: { id: `lesson-react-1-${i}` },
      update: {},
      create: {
        id: `lesson-react-1-${i}`,
        moduleId: mod3.id,
        title,
        sortOrder: i,
        isFree: i === 0,
        duration: 900 + i * 150,
      },
    });
  }

  // Course 3
  const course3 = await prisma.course.upsert({
    where: { slug: "typescript-dlya-razrabotchikov" },
    update: {},
    create: {
      slug: "typescript-dlya-razrabotchikov",
      title: "TypeScript для разработчиков",
      description: "Строгая типизация, интерфейсы, дженерики, декораторы. Переходим с JS на TS без боли.",
      price: 3500,
      isFree: false,
      published: true,
      level: "INTERMEDIATE",
      instructorId: instructor.id,
    },
  });

  const mod4 = await prisma.module.upsert({
    where: { id: "mod-ts-1" },
    update: {},
    create: {
      id: "mod-ts-1",
      courseId: course3.id,
      title: "Базовые типы",
      sortOrder: 0,
    },
  });

  for (const [i, title] of [
    "Зачем TypeScript",
    "Примитивные типы",
    "Интерфейсы и типы объектов",
    "Дженерики",
  ].entries()) {
    await prisma.lesson.upsert({
      where: { id: `lesson-ts-1-${i}` },
      update: {},
      create: {
        id: `lesson-ts-1-${i}`,
        moduleId: mod4.id,
        title,
        sortOrder: i,
        isFree: i === 0,
        duration: 750 + i * 100,
      },
    });
  }

  // Reviews
  const student = await prisma.user.upsert({
    where: { email: "student@example.com" },
    update: {},
    create: {
      email: "student@example.com",
      name: "Алексей Смирнов",
      role: "STUDENT",
    },
  });

  await prisma.review.upsert({
    where: { userId_courseId: { userId: student.id, courseId: course1.id } },
    update: {},
    create: {
      userId: student.id,
      courseId: course1.id,
      rating: 5,
      text: "Отличный курс! Всё объяснено доступно, примеры реальные. Рекомендую всем, кто начинает изучать JS.",
    },
  });

  await prisma.review.upsert({
    where: { userId_courseId: { userId: student.id, courseId: course2.id } },
    update: {},
    create: {
      userId: student.id,
      courseId: course2.id,
      rating: 5,
      text: "Лучший курс по React! После него сразу начал работать.",
    },
  });

  console.log("Seed complete -- courses, modules, lessons, reviews created.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
