import prisma from '../config/prisma.js';

export const getTasks = async (projectId, userId) => {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { workspace: true },
  });

  if (!project) throw new Error('Project not found');

  const hasAccess = await prisma.workspaceMember.findFirst({
    where: { workspaceId: project.workspaceId, userId },
  });

  if (!hasAccess) throw new Error('Access denied');

  return await prisma.task.findMany({
    where: { projectId },
    include: {
      assignee: { select: { id: true, name: true, email: true, image: true } },
      project: { select: { id: true, name: true, workspaceId: true } },
      _count: { select: { comments: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const getTaskById = async (taskId, userId) => {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      assignee: { select: { id: true, name: true, email: true, image: true } },
      project: { include: { workspace: true } },
      comments: {
        include: {
          user: { select: { id: true, name: true, email: true, image: true } },
        },
        orderBy: { createdAt: 'asc' },
      },
    },
  });

  if (!task) throw new Error('Task not found');

  const hasAccess = await prisma.workspaceMember.findFirst({
    where: { workspaceId: task.project.workspaceId, userId },
  });

  if (!hasAccess) throw new Error('Access denied');

  return task;
};

export const createTask = async (data, userId) => {
  const { workspaceId, projectId, due_date, assigneeId, ...rest } = data;
  
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { workspace: true },
  });

  if (!project) throw new Error('Project not found');

  const hasAccess = await prisma.workspaceMember.findFirst({
    where: { workspaceId: project.workspaceId, userId },
  });

  if (!hasAccess) throw new Error('Access denied');

  return await prisma.task.create({
    data: {
      ...rest,
      projectId,
      assigneeId: assigneeId || null,
      due_date: due_date ? new Date(due_date) : null,
    },
    include: {
      assignee: { select: { id: true, name: true, email: true, image: true } },
      project: { select: { id: true, name: true, workspaceId: true } },
    },
  });
};

export const updateTask = async (taskId, data, userId) => {
  const task = await getTaskById(taskId, userId);
  const { due_date, ...rest } = data;

  return await prisma.task.update({
    where: { id: taskId },
    data: {
      ...rest,
      ...(due_date && { due_date: new Date(due_date) }),
    },
    include: {
      assignee: { select: { id: true, name: true, email: true, image: true } },
      project: { select: { id: true, name: true, workspaceId: true } },
    },
  });
};

export const deleteTask = async (taskId, userId) => {
  await getTaskById(taskId, userId);
  await prisma.task.delete({ where: { id: taskId } });
  return { message: 'Task deleted successfully' };
};
