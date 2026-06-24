import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";
import { getLayoutCourse } from "./layout-course";

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const seedUserPassword = process.env.SEED_USER_PASSWORD;
if (!seedUserPassword) {
  throw new Error("SEED_USER_PASSWORD is required to seed demo users.");
}
const DEMO_HASH = bcrypt.hashSync(seedUserPassword, 10);
const LAYOUT_IMAGE =
  "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800&h=450&fit=crop";

async function main() {
  const instructor = await prisma.user.upsert({
    where: { email: "maria@kurs.dev" },
    update: {
      role: "INSTRUCTOR",
      name: "Мария Соколова",
      passwordHash: DEMO_HASH,
      image:
        "https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop",
    },
    create: {
      email: "maria@kurs.dev",
      name: "Мария Соколова",
      role: "INSTRUCTOR",
      passwordHash: DEMO_HASH,
      image:
        "https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop",
    },
  });

  const { modules, ...courseFields } = getLayoutCourse(instructor.id, LAYOUT_IMAGE);

  const existing = await prisma.course.findUnique({ where: { slug: courseFields.slug } });
  if (existing) {
    await prisma.course.delete({ where: { slug: courseFields.slug } });
  }

  const course = await prisma.course.create({
    data: {
      ...courseFields,
      published: true,
    },
  });

  for (let moduleIndex = 0; moduleIndex < modules.length; moduleIndex++) {
    const moduleData = modules[moduleIndex];
    const module = await prisma.module.create({
      data: {
        courseId: course.id,
        title: moduleData.title,
        sortOrder: moduleIndex,
      },
    });

    for (let lessonIndex = 0; lessonIndex < moduleData.lessons.length; lessonIndex++) {
      const lesson = moduleData.lessons[lessonIndex];
      await prisma.lesson.create({
        data: {
          moduleId: module.id,
          title: lesson.title,
          duration: lesson.dur,
          content: lesson.content,
          isFree: true,
          sortOrder: lessonIndex,
        },
      });
    }
  }

  console.log(`Added course: ${course.title}`);
  console.log(`Slug: ${course.slug}`);
  console.log(`Modules: ${modules.length}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
