import prisma from "../prismaClient";

export async function createTask(userId: number, title: string, description?: string, dueDate?: string) {
  return prisma.task.create({
    data: { title, description, dueDate: dueDate ? new Date(dueDate) : null, userId },
  });
}

export async function listTasks(userId: number) {
  return prisma.task.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
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