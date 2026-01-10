import prisma from '../config/prisma.js';

export const getProjects = async (workspaceId, userId) => {
  // Verify user has access to workspace
  const hasAccess = await prisma.workspaceMember.findFirst({
    where: { workspaceId, userId },
  });

  if (!hasAccess) {
    throw new Error('Access denied');
  }

  return await prisma.project.findMany({
    where: { workspaceId },
    include: {
      owner: { select: { id: true, name: true, email: true, image: true } },
      members: {
        include: {
          user: { select: { id: true, name: true, email: true, image: true } },
        },
      },
      _count: { select: { tasks: true, members: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const getProjectById = async (projectId, userId) => {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      owner: { select: { id: true, name: true, email: true, image: true } },
      workspace: true,
      members: {
        include: {
          user: { select: { id: true, name: true, email: true, image: true } },
        },
      },
      tasks: {
        include: {
          assignee: { select: { id: true, name: true, email: true, image: true } },
          _count: { select: { comments: true } },
        },
      },
    },
  });

  if (!project) {
    throw new Error('Project not found');
  }

  // Check access
  const hasAccess = await prisma.workspaceMember.findFirst({
    where: { workspaceId: project.workspaceId, userId },
  });

  if (!hasAccess) {
    throw new Error('Access denied');
  }

  return project;
};

export const createProject = async (data, userId) => {
  const { workspaceId, name, description, status, priority, start_date, end_date } = data;

  // Verify user has access to workspace
  const hasAccess = await prisma.workspaceMember.findFirst({
    where: { workspaceId, userId },
  });

  if (!hasAccess) {
    throw new Error('Access denied');
  }

  return await prisma.project.create({
    data: {
      name,
      description,
      status,
      priority,
      workspaceId,
      team_lead: userId,
      start_date: start_date ? new Date(start_date) : null,
      end_date: end_date ? new Date(end_date) : null,
    },
    include: {
      owner: { select: { id: true, name: true, email: true, image: true } },
      members: {
        include: {
          user: { select: { id: true, name: true, email: true, image: true } },
        },
      },
    },
  });
};

export const updateProject = async (projectId, data, userId) => {
  const project = await prisma.project.findUnique({ where: { id: projectId } });

  if (!project) {
    throw new Error('Project not found');
  }

  // Check if user is team lead or workspace admin
  const isTeamLead = project.team_lead === userId;
  const isWorkspaceAdmin = await prisma.workspaceMember.findFirst({
    where: { workspaceId: project.workspaceId, userId, role: 'ADMIN' },
  });

  if (!isTeamLead && !isWorkspaceAdmin) {
    throw new Error('Only project team lead or workspace admin can update project');
  }

  const { start_date, end_date, ...rest } = data;

  return await prisma.project.update({
    where: { id: projectId },
    data: {
      ...rest,
      ...(start_date && { start_date: new Date(start_date) }),
      ...(end_date && { end_date: new Date(end_date) }),
    },
    include: {
      owner: { select: { id: true, name: true, email: true, image: true } },
      members: {
        include: {
          user: { select: { id: true, name: true, email: true, image: true } },
        },
      },
    },
  });
};

export const deleteProject = async (projectId, userId) => {
  const project = await prisma.project.findUnique({ where: { id: projectId } });

  if (!project) {
    throw new Error('Project not found');
  }

  const isTeamLead = project.team_lead === userId;
  const isWorkspaceAdmin = await prisma.workspaceMember.findFirst({
    where: { workspaceId: project.workspaceId, userId, role: 'ADMIN' },
  });

  if (!isTeamLead && !isWorkspaceAdmin) {
    throw new Error('Only project team lead or workspace admin can delete project');
  }

  await prisma.project.delete({ where: { id: projectId } });
  return { message: 'Project deleted successfully' };
};

export const addProjectMember = async (projectId, memberUserId, userId) => {
  const project = await prisma.project.findUnique({ 
    where: { id: projectId },
    include: { members: true }
  });

  if (!project) {
    throw new Error('Project not found');
  }

  // Check if requester is a member of the project
  const isProjectMember = project.members.some(m => m.userId === userId);
  if (!isProjectMember && project.team_lead !== userId) {
    throw new Error('Only project members can add other members');
  }

  // Check if already a member
  const existing = await prisma.projectMember.findUnique({
    where: { userId_projectId: { userId: memberUserId, projectId } },
  });

  if (existing) {
    throw new Error('User is already a project member');
  }

  return await prisma.projectMember.create({
    data: { userId: memberUserId, projectId },
    include: {
      user: { select: { id: true, name: true, email: true, image: true } },
    },
  });
};

export const removeProjectMember = async (projectId, memberUserId, userId) => {
  const project = await prisma.project.findUnique({ where: { id: projectId } });

  if (!project) {
    throw new Error('Project not found');
  }

  const isTeamLead = project.team_lead === userId;
  if (!isTeamLead) {
    throw new Error('Only project team lead can remove members');
  }

  if (project.team_lead === memberUserId) {
    throw new Error('Cannot remove team lead');
  }

  await prisma.projectMember.delete({
    where: { userId_projectId: { userId: memberUserId, projectId } },
  });

  return { message: 'Member removed successfully' };
};
