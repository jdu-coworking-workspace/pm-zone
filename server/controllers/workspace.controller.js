import * as workspaceService from '../services/workspace.service.js';
import { success } from '../utils/response.js';

export const getUserWorkspaces = async (req, res, next) => {
  try {
    const workspaces = await workspaceService.getUserWorkspaces(req.user.id);
    res.json(success(workspaces));
  } catch (error) {
    next(error);
  }
};

export const getWorkspaceById = async (req, res, next) => {
  try {
    const workspace = await workspaceService.getWorkspaceById(req.params.id, req.user.id);
    res.json(success(workspace));
  } catch (error) {
    if (error.message === 'Workspace not found') {
      return res.status(404).json({ success: false, message: error.message });
    }
    if (error.message === 'Access denied') {
      return res.status(403).json({ success: false, message: error.message });
    }
    next(error);
  }
};

export const createWorkspace = async (req, res, next) => {
  try {
    const workspace = await workspaceService.createWorkspace(req.body, req.user.id);
    
    // Emit socket event
    const { io } = await import('../index.js');
    io.to(`workspace:${workspace.id}`).emit('workspace:created', workspace);
    
    res.status(201).json(success(workspace, 'Workspace created successfully'));
  } catch (error) {
    if (error.message === 'Workspace with this slug already exists') {
      return res.status(409).json({ success: false, message: error.message });
    }
    next(error);
  }
};

export const updateWorkspace = async (req, res, next) => {
  try {
    const workspace = await workspaceService.updateWorkspace(req.params.id, req.body, req.user.id);
    
    // Emit socket event
    const { io } = await import('../index.js');
    io.to(`workspace:${workspace.id}`).emit('workspace:updated', workspace);
    
    res.json(success(workspace, 'Workspace updated successfully'));
  } catch (error) {
    if (error.message === 'Workspace not found') {
      return res.status(404).json({ success: false, message: error.message });
    }
    if (error.message === 'Only workspace owner can update workspace') {
      return res.status(403).json({ success: false, message: error.message });
    }
    next(error);
  }
};

export const deleteWorkspace = async (req, res, next) => {
  try {
    const result = await workspaceService.deleteWorkspace(req.params.id, req.user.id);
    
    // Emit socket event
    const { io } = await import('../index.js');
    io.to(`workspace:${req.params.id}`).emit('workspace:deleted', { workspaceId: req.params.id });
    
    res.json(success(result));
  } catch (error) {
    if (error.message === 'Workspace not found') {
      return res.status(404).json({ success: false, message: error.message });
    }
    if (error.message === 'Only workspace owner can delete workspace') {
      return res.status(403).json({ success: false, message: error.message });
    }
    next(error);
  }
};

export const addMember = async (req, res, next) => {
  try {
    const member = await workspaceService.addMember(req.params.id, req.body, req.user.id);
    
    // Emit socket event
    const { io } = await import('../index.js');
    io.to(`workspace:${req.params.id}`).emit('workspace:member:added', {
      workspaceId: req.params.id,
      member,
    });
    
    res.status(201).json(success(member, 'Member added successfully'));
  } catch (error) {
    if (error.message.includes('Only workspace admins') || error.message.includes('already a member')) {
      return res.status(403).json({ success: false, message: error.message });
    }
    next(error);
  }
};

export const removeMember = async (req, res, next) => {
  try {
    const result = await workspaceService.removeMember(req.params.id, req.params.userId, req.user.id);
    
    // Emit socket event
    const { io } = await import('../index.js');
    io.to(`workspace:${req.params.id}`).emit('workspace:member:removed', {
      workspaceId: req.params.id,
      userId: req.params.userId,
    });
    
    res.json(success(result));
  } catch (error) {
    if (error.message.includes('Only workspace admins') || error.message.includes('Cannot remove')) {
      return res.status(403).json({ success: false, message: error.message });
    }
    next(error);
  }
};

export const updateMemberRole = async (req, res, next) => {
  try {
    const member = await workspaceService.updateMemberRole(
      req.params.id,
      req.params.userId,
      req.body.role,
      req.user.id
    );
    
    // Emit socket event
    const { io } = await import('../index.js');
    io.to(`workspace:${req.params.id}`).emit('workspace:member:role', {
      workspaceId: req.params.id,
      member,
    });
    
    res.json(success(member, 'Member role updated successfully'));
  } catch (error) {
    if (error.message.includes('Only workspace admins') || error.message.includes('Cannot change')) {
      return res.status(403).json({ success: false, message: error.message });
    }
    next(error);
  }
};

export const getMembers = async (req, res, next) => {
  try {
    const members = await workspaceService.getMembers(req.params.id, req.user.id);
    res.json(success(members));
  } catch (error) {
    if (error.message === 'Access denied') {
      return res.status(403).json({ success: false, message: error.message });
    }
    next(error);
  }
};
