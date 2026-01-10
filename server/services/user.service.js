import prisma from '../config/prisma.js';
import { hashPassword, comparePassword } from '../utils/password.js';

export const updateProfile = async (userId, data) => {
  const { name, email } = data;

  // Check if email is being changed and if it's already taken
  if (email) {
    const existingUser = await prisma.user.findFirst({
      where: {
        email,
        NOT: { id: userId }
      }
    });

    if (existingUser) {
      throw new Error('Email is already in use by another account');
    }
  }

  // Update user
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(name && { name }),
      ...(email && { email }),
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      createdAt: true,
    },
  });

  return updatedUser;
};

export const changePassword = async (userId, currentPassword, newPassword) => {
  // Get user with password
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      password: true,
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  // Verify current password
  const isPasswordValid = await comparePassword(currentPassword, user.password);
  if (!isPasswordValid) {
    throw new Error('Current password is incorrect');
  }

  // Hash new password
  const hashedPassword = await hashPassword(newPassword);

  // Update password
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  return { message: 'Password updated successfully' };
};

export const updateAvatar = async (userId, imageUrl) => {
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { image: imageUrl },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      createdAt: true,
    },
  });

  return updatedUser;
};

export const getPreferences = async (userId) => {
  let preferences = await prisma.userPreferences.findUnique({
    where: { userId },
  });

  // Create default preferences if they don't exist
  if (!preferences) {
    preferences = await prisma.userPreferences.create({
      data: { userId },
    });
  }

  return preferences;
};

export const updatePreferences = async (userId, data) => {
  const {
    emailNotifications,
    browserNotifications,
    taskAssigned,
    taskCompleted,
    projectUpdates,
    teamInvites,
    theme,
  } = data;

  // Upsert preferences
  const preferences = await prisma.userPreferences.upsert({
    where: { userId },
    update: {
      ...(emailNotifications !== undefined && { emailNotifications }),
      ...(browserNotifications !== undefined && { browserNotifications }),
      ...(taskAssigned !== undefined && { taskAssigned }),
      ...(taskCompleted !== undefined && { taskCompleted }),
      ...(projectUpdates !== undefined && { projectUpdates }),
      ...(teamInvites !== undefined && { teamInvites }),
      ...(theme && { theme }),
    },
    create: {
      userId,
      ...(emailNotifications !== undefined && { emailNotifications }),
      ...(browserNotifications !== undefined && { browserNotifications }),
      ...(taskAssigned !== undefined && { taskAssigned }),
      ...(taskCompleted !== undefined && { taskCompleted }),
      ...(projectUpdates !== undefined && { projectUpdates }),
      ...(teamInvites !== undefined && { teamInvites }),
      ...(theme && { theme }),
    },
  });

  return preferences;
};
