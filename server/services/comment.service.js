import prisma from '../config/prisma.js';

export const getComments = async (taskId, userId) => {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: { project: { include: { workspace: true } } },
  });

  if (!task) throw new Error('Task not found');

  const hasAccess = await prisma.workspaceMember.findFirst({
    where: { workspaceId: task.project.workspaceId, userId },
  });

  if (!hasAccess) throw new Error('Access denied');

  return await prisma.comment.findMany({
    where: { taskId },
    include: {
      user: { select: { id: true, name: true, email: true, image: true } },
    },
    orderBy: { createdAt: 'asc' },
  });
};

export const createComment = async (data, userId) => {
  const task = await prisma.task.findUnique({
    where: { id: data.taskId },
    include: { project: { include: { workspace: true } } },
  });

  if (!task) throw new Error('Task not found');

  const hasAccess = await prisma.workspaceMember.findFirst({
    where: { workspaceId: task.project.workspaceId, userId },
  });

  if (!hasAccess) throw new Error('Access denied');

  return await prisma.comment.create({
    data: {
      content: data.content,
      taskId: data.taskId,
      userId,
    },
    include: {
      user: { select: { id: true, name: true, email: true, image: true } },
      task: { select: { id: true, projectId: true, project: { select: { workspaceId: true } } } },
    },
  });
};

export const updateComment = async (commentId, content, userId) => {
  const comment = await prisma.comment.findUnique({ where: { id: commentId } });

  if (!comment) throw new Error('Comment not found');
  if (comment.userId !== userId) throw new Error('Not authorized to update this comment');

  return await prisma.comment.update({
    where: { id: commentId },
    data: { content },
    include: {
      user: { select: { id: true, name: true, email: true, image: true } },
    },
  });
};

export const deleteComment = async (commentId, userId) => {
  const comment = await prisma.comment.findUnique({ where: { id: commentId } });

  if (!comment) throw new Error('Comment not found');
  if (comment.userId !== userId) throw new Error('Not authorized to delete this comment');

  await prisma.comment.delete({ where: { id: commentId } });
  return { message: 'Comment deleted successfully' };
};
