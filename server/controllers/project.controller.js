import * as projectService from '../services/project.service.js';
import { success } from '../utils/response.js';

export const getProjects = async (req, res, next) => {
  try {
    const projects = await projectService.getProjects(req.query.workspaceId, req.user.id);
    res.json(success(projects));
  } catch (error) {
    if (error.message === 'Access denied') {
      return res.status(403).json({ success: false, message: error.message });
    }
    next(error);
  }
};

export const getProjectById = async (req, res, next) => {
  try {
    const project = await projectService.getProjectById(req.params.id, req.user.id);
    res.json(success(project));
  } catch (error) {
    if (error.message === 'Project not found') {
      return res.status(404).json({ success: false, message: error.message });
    }
    if (error.message === 'Access denied') {
      return res.status(403).json({ success: false, message: error.message });
    }
    next(error);
  }
};

export const createProject = async (req, res, next) => {
  try {
    const project = await projectService.createProject(req.body, req.user.id);
    
    const { io } = await import('../index.js');
    io.to(`workspace:${project.workspaceId}`).emit('project:created', project);
    
    res.status(201).json(success(project, 'Project created successfully'));
  } catch (error) {
    if (error.message === 'Access denied') {
      return res.status(403).json({ success: false, message: error.message });
    }
    next(error);
  }
};

export const updateProject = async (req, res, next) => {
  try {
    const project = await projectService.updateProject(req.params.id, req.body, req.user.id);
    
    const { io } = await import('../index.js');
    io.to(`workspace:${project.workspaceId}`).emit('project:updated', project);
    
    res.json(success(project, 'Project updated successfully'));
  } catch (error) {
    if (error.message.includes('not found') || error.message.includes('Only project')) {
      const status = error.message.includes('not found') ? 404 : 403;
      return res.status(status).json({ success: false, message: error.message });
    }
    next(error);
  }
};

export const deleteProject = async (req, res, next) => {
  try {
    const project = await projectService.getProjectById(req.params.id, req.user.id);
    const result = await projectService.deleteProject(req.params.id, req.user.id);
    
    const { io } = await import('../index.js');
    io.to(`workspace:${project.workspaceId}`).emit('project:deleted', { projectId: req.params.id });
    
    res.json(success(result));
  } catch (error) {
    if (error.message.includes('not found') || error.message.includes('Only project')) {
      const status = error.message.includes('not found') ? 404 : 403;
      return res.status(status).json({ success: false, message: error.message });
    }
    next(error);
  }
};

export const addProjectMember = async (req, res, next) => {
  try {
    const member = await projectService.addProjectMember(req.params.id, req.body.userId, req.user.id);
    
    const project = await projectService.getProjectById(req.params.id, req.user.id);
    const { io } = await import('../index.js');
    io.to(`workspace:${project.workspaceId}`).emit('project:member:added', {
      projectId: req.params.id,
      member,
    });
    
    res.status(201).json(success(member, 'Member added successfully'));
  } catch (error) {
    if (error.message.includes('not found') || error.message.includes('Only') || error.message.includes('already')) {
      const status = error.message.includes('not found') ? 404 : 403;
      return res.status(status).json({ success: false, message: error.message });
    }
    next(error);
  }
};

export const removeProjectMember = async (req, res, next) => {
  try {
    const project = await projectService.getProjectById(req.params.id, req.user.id);
    const result = await projectService.removeProjectMember(req.params.id, req.params.userId, req.user.id);
    
    const { io } = await import('../index.js');
    io.to(`workspace:${project.workspaceId}`).emit('project:member:removed', {
      projectId: req.params.id,
      userId: req.params.userId,
    });
    
    res.json(success(result));
  } catch (error) {
    if (error.message.includes('not found') || error.message.includes('Only') || error.message.includes('Cannot')) {
      const status = error.message.includes('not found') ? 404 : 403;
      return res.status(status).json({ success: false, message: error.message });
    }
    next(error);
  }
};
