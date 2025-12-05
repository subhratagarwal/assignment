import prisma from "../prismaClient";

export async function createTask(userId: number, title: string, description?: string, dueDate?: string) {
  return prisma.task.create({
    data: { title, description, dueDate: dueDate ? new Date(dueDate) : null, userId },
  });
}

// params: userId, options = { page, pageSize, status, q }
// in src/services/task.service.ts
import prisma from "../prismaClient";

export async function createTask(userId: number, title: string, description?: string, dueDate?: string) {
  return prisma.task.create({
    data: { title, description, dueDate: dueDate ? new Date(dueDate) : null, userId },
  });
}

export async function listTasks(
  userId: number,
  options?: { page?: number; pageSize?: number; status?: string; q?: string }
) {
  const page = Math.max(1, Number(options?.page || 1));
  const pageSize = Math.min(100, Math.max(1, Number(options?.pageSize || 10)));

  const where: any = { userId };

  if (options?.status) {
    where.status = options.status;
  }

  if (options?.q) {
    // case-insensitive contains search for title
    where.title = { contains: options.q, mode: "insensitive" };
  }

  const [tasks, total] = await Promise.all([
    prisma.task.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.task.count({ where }),
  ]);

  return {
    tasks,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
  };
}

export async function getTask(userId: number, id: number) {
  return prisma.task.findFirst({ where: { userId, id } });
}

export async function updateTask(userId: number, id: number, data: Partial<{ title: string; description: string; status: string; dueDate?: string }>) {
  const update: any = {};
  if (data.title !== undefined) update.title = data.title;
  if (data.description !== undefined) update.description = data.description;
  if (data.status !== undefined) update.status = data.status;
  if (data.dueDate !== undefined) update.dueDate = data.dueDate ? new Date(data.dueDate) : null;
  return prisma.task.updateMany({ where: { userId, id }, data: update });
}

export async function deleteTask(userId: number, id: number) {
  return prisma.task.deleteMany({ where: { userId, id } });
}



export async function getTask(userId: number, id: number) {
  return prisma.task.findFirst({ where: { userId, id } });
}

export async function updateTask(userId: number, id: number, data: Partial<{ title: string; description: string; status: string; dueDate?: string }>) {
  const update: any = {};
  if (data.title !== undefined) update.title = data.title;
  if (data.description !== undefined) update.description = data.description;
  if (data.status !== undefined) update.status = data.status;
  if (data.dueDate !== undefined) update.dueDate = data.dueDate ? new Date(data.dueDate) : null;
  return prisma.task.updateMany({ where: { userId, id }, data: update });
}

export async function deleteTask(userId: number, id: number) {
  return prisma.task.deleteMany({ where: { userId, id } });
}