import type { CourseCard } from "../types";
import { getLayoutCourse } from "../../prisma/layout-course";

export const DB_FALLBACK_TIMEOUT_MS = 2500;

export async function withDbFallback<T>(query: Promise<T>, fallback: T): Promise<T> {
  try {
    return await Promise.race([
      query,
      new Promise<T>((resolve) => {
        setTimeout(() => resolve(fallback), DB_FALLBACK_TIMEOUT_MS);
      }),
    ]);
  } catch {
    return fallback;
  }
}

const instructor = {
  id: "fallback-instructor-layout",
  name: "Мария Соколова",
  image:
    "https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop",
};

export const fallbackCourses: CourseCard[] = [
  {
    id: "fallback-layout",
    slug: "verstka-s-nulya",
    title: "Верстка с нуля: HTML, CSS, Flexbox и макеты",
    description:
      "Подробный курс для новичков: HTML-структура, CSS, Flexbox, Grid, адаптив, чтение макетов и финальный лендинг.",
    imageUrl:
      "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800&h=450&fit=crop",
    isFree: true,
    level: "BEGINNER",
    price: null,
    instructor,
    _count: { enrollments: 0, reviews: 0 },
    avgRating: 5,
  },
  {
    id: "fallback-css",
    slug: "css-i-tailwind",
    title: "Современный CSS и Tailwind",
    description: "CSS-фундамент, Flexbox, Grid, адаптивные интерфейсы и компонентный подход.",
    imageUrl:
      "https://images.pexels.com/photos/270404/pexels-photo-270404.jpeg?auto=compress&cs=tinysrgb&w=800&h=450&fit=crop",
    isFree: true,
    level: "BEGINNER",
    price: null,
    instructor,
    _count: { enrollments: 0, reviews: 0 },
    avgRating: 4.9,
  },
  {
    id: "fallback-js",
    slug: "osnovy-javascript",
    title: "Основы JavaScript",
    description: "Первый язык для интерактивных страниц: переменные, функции, DOM и практика.",
    imageUrl:
      "https://images.pexels.com/photos/1972464/pexels-photo-1972464.jpeg?auto=compress&cs=tinysrgb&w=800&h=450&fit=crop",
    isFree: true,
    level: "BEGINNER",
    price: null,
    instructor: { ...instructor, id: "fallback-instructor-js", name: "Иван Петров" },
    _count: { enrollments: 0, reviews: 0 },
    avgRating: 4.8,
  },
];

export const fallbackHomeData = {
  courses: fallbackCourses,
  courseCount: fallbackCourses.length,
  enrollmentCount: 0,
  totalLessons: 36,
  instructors: [
    {
      ...instructor,
      email: "maria@kurs.dev",
      courses: [{ id: "fallback-layout", _count: { enrollments: 0 } }],
      _count: { courses: 2 },
    },
    {
      id: "fallback-instructor-js",
      email: "ivan@kurs.dev",
      name: "Иван Петров",
      image:
        "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop",
      courses: [{ id: "fallback-js", _count: { enrollments: 0 } }],
      _count: { courses: 1 },
    },
  ],
  reviews: [
    {
      id: "fallback-review-layout",
      rating: 5,
      text: "Понравилось, что верстку объясняют через реальные блоки: header, карточки, сетки и адаптив.",
      user: { name: "Анна", image: null },
      course: { title: "Верстка с нуля" },
    },
    {
      id: "fallback-review-css",
      rating: 5,
      text: "После уроков по Flexbox наконец стало понятно, почему элементы ведут себя именно так.",
      user: { name: "Алексей", image: null },
      course: { title: "Современный CSS" },
    },
    {
      id: "fallback-review-project",
      rating: 5,
      text: "Финальный проект помог собрать все вместе: HTML, CSS, Grid и мобильную версию.",
      user: { name: "Дмитрий", image: null },
      course: { title: "Верстка с нуля" },
    },
  ],
  reviewCount: 3,
};

export function getFallbackCourses(filters: { level?: string; isFree?: string; q?: string }) {
  const query = filters.q?.trim().toLowerCase();

  return fallbackCourses.filter((course) => {
    if (filters.level && course.level !== filters.level) return false;
    if (filters.isFree === "true" && !course.isFree) return false;
    if (!query) return true;

    return (
      course.title.toLowerCase().includes(query) ||
      (course.description?.toLowerCase().includes(query) ?? false)
    );
  });
}

export function getFallbackCourseBySlug(slug: string) {
  if (slug !== "verstka-s-nulya") return null;

  const source = getLayoutCourse(instructor.id, fallbackCourses[0].imageUrl!);

  return {
    id: "fallback-layout",
    slug: source.slug,
    title: source.title,
    description: source.description,
    imageUrl: source.imageUrl,
    price: source.price,
    isFree: source.isFree,
    level: source.level,
    instructor,
    modules: source.modules.map((module, moduleIndex) => ({
      id: `fallback-layout-module-${moduleIndex}`,
      courseId: "fallback-layout",
      title: module.title,
      sortOrder: moduleIndex,
      createdAt: new Date(0),
      updatedAt: new Date(0),
      lessons: module.lessons.map((lesson, lessonIndex) => ({
        id: `fallback-layout-lesson-${moduleIndex}-${lessonIndex}`,
        moduleId: `fallback-layout-module-${moduleIndex}`,
        title: lesson.title,
        content: lesson.content,
        muxAssetId: null,
        muxPlaybackId: null,
        duration: lesson.dur,
        sortOrder: lessonIndex,
        isFree: lesson.free ?? true,
        createdAt: new Date(0),
        updatedAt: new Date(0),
      })),
    })),
    reviews: fallbackHomeData.reviews.slice(0, 2).map((review, index) => ({
      id: `fallback-layout-review-${index}`,
      userId: `fallback-user-${index}`,
      courseId: "fallback-layout",
      rating: review.rating,
      text: review.text,
      createdAt: new Date(0),
      updatedAt: new Date(0),
      user: {
        id: `fallback-user-${index}`,
        name: review.user.name,
        image: review.user.image,
      },
    })),
    _count: {
      enrollments: 0,
      reviews: 2,
    },
  };
}
