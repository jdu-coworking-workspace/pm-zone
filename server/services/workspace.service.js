import prisma from '../config/prisma.js';

export const getUserWorkspaces = async (userId) => {
  const workspaces = await prisma.workspace.findMany({
    where: {
      OR: [
        { ownerId: userId },
        {
          members: {
            some: {
              userId: userId,
            },
          },
        },
      ],
    },
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      members: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      },
      _count: {
        select: {
          projects: true,
          members: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return workspaces;
};

export const getWorkspaceById = async (workspaceId, userId) => {
  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      members: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      },
      projects: {
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
          _count: {
            select: {
              tasks: true,
              members: true,
            },
          },
        },
      },
    },
  });

  if (!workspace) {
    throw new Error('Workspace not found');
  }

  // Check if user has access to this workspace
  const hasAccess = workspace.ownerId === userId || 
    workspace.members.some(member => member.userId === userId);

  if (!hasAccess) {
    throw new Error('Access denied');
  }

  return workspace;
};

export const createWorkspace = async (data, userId) => {
  const { name, slug, description, image_url } = data;

  // Check if slug already exists
  const existingWorkspace = await prisma.workspace.findUnique({
    where: { slug },
  });

  if (existingWorkspace) {
    throw new Error('Workspace with this slug already exists');
  }

  // Create workspace and add owner as admin member
  const workspace = await prisma.workspace.create({
    data: {
      id: `workspace_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      slug,
      description,
      image_url: image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`,
      ownerId: userId,
      members: {
        create: {
          userId: userId,
          role: 'ADMIN',
          message: 'Workspace owner',
        },
      },
    },
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      members: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      },
    },
  });

  return workspace;
};

export const updateWorkspace = async (workspaceId, data, userId) => {
  // Check if user is owner
  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
  });

  if (!workspace) {
    throw new Error('Workspace not found');
  }

  if (workspace.ownerId !== userId) {
    throw new Error('Only workspace owner can update workspace');
  }

  const updated = await prisma.workspace.update({
    where: { id: workspaceId },
    data,
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      members: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      },
    },
  });

  return updated;
};

export const deleteWorkspace = async (workspaceId, userId) => {
  // Check if user is owner
  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
  });

  if (!workspace) {
    throw new Error('Workspace not found');
  }

  if (workspace.ownerId !== userId) {
    throw new Error('Only workspace owner can delete workspace');
  }

  await prisma.workspace.delete({
    where: { id: workspaceId },
  });

  return { message: 'Workspace deleted successfully' };
};

export const addMember = async (workspaceId, data, userId) => {
  const { userId: memberId, role = 'MEMBER', message = '' } = data;

  // Check if user is workspace admin
  const membership = await prisma.workspaceMember.findFirst({
    where: {
      workspaceId,
      userId,
      role: 'ADMIN',
    },
  });

  if (!membership) {
    throw new Error('Only workspace admins can add members');
  }

  // Check if member already exists
  const existingMember = await prisma.workspaceMember.findUnique({
    where: {
      userId_workspaceId: {
        userId: memberId,
        workspaceId,
      },
    },
  });

  if (existingMember) {
    throw new Error('User is already a member of this workspace');
  }

  // Add member
  const newMember = await prisma.workspaceMember.create({
    data: {
      userId: memberId,
      workspaceId,
      role,
      message,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
  });

  return newMember;
};

export const removeMember = async (workspaceId, memberId, userId) => {
  // Check if user is workspace admin
  const membership = await prisma.workspaceMember.findFirst({
    where: {
      workspaceId,
      userId,
      role: 'ADMIN',
    },
  });

  if (!membership) {
    throw new Error('Only workspace admins can remove members');
  }

  // Cannot remove workspace owner
  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
  });

  if (workspace.ownerId === memberId) {
    throw new Error('Cannot remove workspace owner');
  }

  // Remove member
  await prisma.workspaceMember.delete({
    where: {
      userId_workspaceId: {
        userId: memberId,
        workspaceId,
      },
    },
  });

  return { message: 'Member removed successfully' };
};

export const updateMemberRole = async (workspaceId, memberId, role, userId) => {
  // Check if user is workspace admin
  const membership = await prisma.workspaceMember.findFirst({
    where: {
      workspaceId,
      userId,
      role: 'ADMIN',
    },
  });

  if (!membership) {
    throw new Error('Only workspace admins can update member roles');
  }

  // Cannot change owner's role
  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
  });

  if (workspace.ownerId === memberId) {
    throw new Error('Cannot change workspace owner role');
  }

  // Update role
  const updated = await prisma.workspaceMember.update({
    where: {
      userId_workspaceId: {
        userId: memberId,
        workspaceId,
      },
    },
    data: { role },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
  });

  return updated;
};

export const getMembers = async (workspaceId, userId) => {
  // Check if user has access to this workspace
  const hasAccess = await prisma.workspaceMember.findFirst({
    where: {
      workspaceId,
      userId,
    },
  });

  if (!hasAccess) {
    throw new Error('Access denied');
  }

  const members = await prisma.workspaceMember.findMany({
    where: { workspaceId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
  });

  return members;
};
