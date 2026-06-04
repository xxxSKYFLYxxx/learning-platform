import type { Course, Module, Lesson, User, Enrollment, LessonProgress, Review, Certificate } from "@prisma/client";

export type CourseWithRelations = Course & {
  instructor: Pick<User, "id" | "name" | "image">;
  modules: (Module & {
    lessons: Lesson[];
  })[];
  enrollments?: Enrollment[];
  reviews?: (Review & { user: Pick<User, "id" | "name" | "image"> })[];
  _count?: {
    enrollments: number;
    reviews: number;
  };
};

export type CourseCard = Pick<Course, "id" | "slug" | "title" | "description" | "imageUrl" | "isFree" | "level"> & {
  price: number | null;
  instructor: Pick<User, "id" | "name" | "image">;
  _count: {
    enrollments: number;
    reviews: number;
  };
  avgRating?: number;
};

export type LessonWithProgress = Lesson & {
  progress?: LessonProgress | null;
};

export type ModuleWithLessons = Module & {
  lessons: LessonWithProgress[];
};

export type EnrollmentWithCourse = Enrollment & {
  course: CourseCard & {
    modules: (Module & { lessons: Pick<Lesson, "id" | "duration">[] })[];
  };
  progress?: number;
};

export type CertificateWithCourse = Certificate & {
  course: Pick<Course, "id" | "title" | "slug" | "imageUrl">;
  user: Pick<User, "id" | "name">;
};
