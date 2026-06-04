import Link from "next/link";
import Image from "next/image";
import { Star, Users, BookOpen } from "lucide-react";
import type { CourseCard as CourseCardType } from "@/types";
import { formatPrice } from "@/lib/utils";

interface Props {
  course: CourseCardType;
}

const LEVEL_LABELS: Record<string, string> = {
  BEGINNER: "Начальный",
  INTERMEDIATE: "Средний",
  ADVANCED: "Продвинутый",
};

export function CourseCard({ course }: Props) {
  return (
    <Link
      href={`/courses/${course.slug}`}
      className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
    >
      <div className="relative aspect-video bg-gray-100 overflow-hidden">
        {course.imageUrl ? (
          <Image
            src={course.imageUrl}
            alt={course.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen className="w-10 h-10 text-gray-300" />
          </div>
        )}
        {course.isFree && (
          <span className="absolute top-3 left-3 bg-success text-white text-xs font-semibold px-2 py-1 rounded-full">
            Бесплатно
          </span>
        )}
        <span className="absolute top-3 right-3 bg-white/90 text-xs text-muted px-2 py-1 rounded-full">
          {LEVEL_LABELS[course.level] ?? course.level}
        </span>
      </div>

      <div className="flex flex-col flex-1 p-4 gap-2">
        <h3 className="font-semibold text-text line-clamp-2 group-hover:text-primary transition-colors">
          {course.title}
        </h3>

        {course.description && (
          <p className="text-sm text-muted line-clamp-2">{course.description}</p>
        )}

        <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-muted">
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              {course._count.enrollments}
            </span>
            {course._count.reviews > 0 && (
              <span className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-secondary fill-secondary" />
                {course.avgRating?.toFixed(1) ?? "—"}
              </span>
            )}
          </div>
          <span className="font-bold text-primary">
            {formatPrice(Number(course.price))}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {course.instructor.image && (
            <Image
              src={course.instructor.image}
              alt={course.instructor.name ?? ""}
              width={20}
              height={20}
              className="rounded-full"
            />
          )}
          <span className="text-xs text-muted">{course.instructor.name}</span>
        </div>
      </div>
    </Link>
  );
}
