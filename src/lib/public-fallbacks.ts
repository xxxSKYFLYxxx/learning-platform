import type { CourseCard } from "../types";
import { getLayoutCourse } from "../../prisma/layout-course";
import { cmsCourses, cmsInstructors, cmsReviews } from "./cms-demo-data";

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

const instructorById = new Map(cmsInstructors.map((instructor) => [instructor.id, instructor]));

function getInstructor(id: string) {
  const instructor = instructorById.get(id) ?? cmsInstructors[0];

  return {
    id: instructor.id,
    name: instructor.name,
    image: instructor.image,
  };
}

export const fallbackCourses: CourseCard[] = cmsCourses
  .filter((course) => course.published)
  .map((course) => ({
    id: course.id,
    slug: course.slug,
    title: course.title,
    description: course.description,
    imageUrl: course.imageUrl,
    isFree: course.isFree,
    level: course.level,
    price: course.price,
    instructor: getInstructor(course.instructorId),
    _count: {
      enrollments: course.enrollments,
      reviews: course.reviews,
    },
    avgRating: course.rating,
  }));

export const fallbackHomeData = {
  courses: fallbackCourses,
  courseCount: fallbackCourses.length,
  enrollmentCount: fallbackCourses.reduce((sum, course) => sum + course._count.enrollments, 0),
  totalLessons: 96,
  instructors: cmsInstructors.map((instructor) => {
    const courses = cmsCourses
      .filter((course) => course.instructorId === instructor.id && course.published)
      .map((course) => ({
        id: course.id,
        _count: { enrollments: course.enrollments },
      }));

    return {
      id: instructor.id,
      email: instructor.email,
      name: instructor.name,
      image: instructor.image,
      courses,
      _count: { courses: courses.length },
    };
  }),
  reviews: cmsReviews.map((review) => ({
    id: review.id,
    rating: review.rating,
    text: review.text,
    user: { name: review.userName, image: null },
    course: { title: review.courseTitle },
  })),
  reviewCount: cmsReviews.length,
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

function buildSimpleModules(courseId: string, slug: string) {
  const moduleTitles = ["Старт", "Практика", "Финальный проект"];
  const lessonTitles = [
    ["Карта курса и рабочее окружение", "Базовые понятия", "Мини-практика"],
    ["Разбор интерфейса", "Сборка первого блока", "Проверка и исправления"],
    ["План проекта", "Реализация", "Публикация результата"],
  ];

  return moduleTitles.map((title, moduleIndex) => ({
    id: `${courseId}-module-${moduleIndex}`,
    courseId,
    title,
    sortOrder: moduleIndex,
    createdAt: new Date(0),
    updatedAt: new Date(0),
    lessons: lessonTitles[moduleIndex].map((lessonTitle, lessonIndex) => ({
      id: `${courseId}-lesson-${moduleIndex}-${lessonIndex}`,
      moduleId: `${courseId}-module-${moduleIndex}`,
      title: lessonTitle,
      content: `
# ${lessonTitle}

Это демо-урок курса **${slug}**. В полноценной базе здесь будет подробный материал, видео, практическое задание и чеклист проверки.

## Что сделать

1. Прочитать цель урока.
2. Повторить пример руками.
3. Изменить 2-3 параметра и посмотреть, как меняется результат.
4. Зафиксировать вопросы для преподавателя.
`.trim(),
      muxAssetId: null,
      muxPlaybackId: null,
      duration: 720 + lessonIndex * 120,
      sortOrder: lessonIndex,
      isFree: moduleIndex === 0 && lessonIndex === 0,
      createdAt: new Date(0),
      updatedAt: new Date(0),
    })),
  }));
}

export function getFallbackCourseBySlug(slug: string) {
  const card = fallbackCourses.find((course) => course.slug === slug);
  if (!card) return null;

  const cmsCourse = cmsCourses.find((course) => course.slug === slug);
  const modules =
    slug === "verstka-s-nulya"
      ? getLayoutCourse(card.instructor.id, card.imageUrl!).modules.map((module, moduleIndex) => ({
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
        }))
      : buildSimpleModules(card.id, card.slug);

  const reviews = cmsReviews
    .filter((review) => review.courseSlug === slug)
    .slice(0, 5)
    .map((review, index) => ({
      id: `${card.id}-review-${index}`,
      userId: `fallback-user-${index}`,
      courseId: card.id,
      rating: review.rating,
      text: review.text,
      createdAt: new Date(0),
      updatedAt: new Date(0),
      user: {
        id: `fallback-user-${index}`,
        name: review.userName,
        image: null,
      },
    }));

  return {
    id: card.id,
    slug: card.slug,
    title: card.title,
    description: card.description,
    imageUrl: card.imageUrl,
    price: card.price,
    isFree: card.isFree,
    level: card.level,
    instructor: card.instructor,
    modules,
    reviews,
    _count: {
      enrollments: cmsCourse?.enrollments ?? card._count.enrollments,
      reviews: Math.max(reviews.length, card._count.reviews),
    },
  };
}
