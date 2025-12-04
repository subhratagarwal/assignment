// src/prisma/seed.ts
import prisma from "../prismaClient";
import { hashPassword } from "../utils/hash";

async function main() {
  const pwd = "password123";
  const hashed = await hashPassword(pwd);

  // upsert demo user
  const user = await prisma.user.upsert({
    where: { email: "demo@example.com" },
    update: {},
    create: {
      email: "demo@example.com",
      name: "Demo",
      passwordHash: hashed,
    },
  });

  // create sample tasks (skip duplicates)
  await prisma.task.createMany({
    data: [
      { title: "Buy groceries", description: "Milk, eggs, veggies", status: "PENDING", userId: user.id },
      { title: "Read assignment PDF", description: "Study the requirements", status: "IN_PROGRESS", userId: user.id },
      { title: "Push to GitHub", description: "Complete repo push", status: "PENDING", userId: user.id },
    ],
    skipDuplicates: true,
  });

  console.log("Seed complete. Demo credentials: demo@example.com / password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
