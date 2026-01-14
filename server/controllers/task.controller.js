import * as taskService from '../services/task.service.js';
import { success } from '../utils/response.js';

export const getTasks = async (req, res, next) => {
  try {
    const { projectId, workspaceId } = req.query;
    
    let tasks;
    if (workspaceId) {
      tasks = await taskService.getWorkspaceTasks(workspaceId, req.user.id);
    } else if (projectId) {
      tasks = await taskService.getTasks(projectId, req.user.id);
    } else {
      return res.status(400).json({ success: false, message: 'Either projectId or workspaceId is required' });
    }
    
    res.json(success(tasks));
  } catch (error) {
    if (error.message.includes('not found') || error.message === 'Access denied') {
      const status = error.message.includes('not found') ? 404 : 403;
      return res.status(status).json({ success: false, message: error.message });
    }
    next(error);
  }
};

export const getTaskById = async (req, res, next) => {
  try {
    const task = await taskService.getTaskById(req.params.id, req.user.id);
    res.json(success(task));
  } catch (error) {
    if (error.message.includes('not found') || error.message === 'Access denied') {
      const status = error.message.includes('not found') ? 404 : 403;
      return res.status(status).json({ success: false, message: error.message });
    }
    next(error);
  }
};

export const createTask = async (req, res, next) => {
  try {
    const task = await taskService.createTask(req.body, req.user.id);
    
    const { io } = await import('../index.js');
    io.to(`workspace:${task.project.workspaceId}`).emit('task:created', task);
    
    res.status(201).json(success(task, 'Task created successfully'));
  } catch (error) {
    if (error.message.includes('not found') || error.message === 'Access denied') {
      const status = error.message.includes('not found') ? 404 : 403;
      return res.status(status).json({ success: false, message: error.message });
    }
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const task = await taskService.updateTask(req.params.id, req.body, req.user.id);
    
    const { io } = await import('../index.js');
    const workspaceRoom = `workspace:${task.project.workspaceId}`;
    console.log(`🔔 [SOCKET] Emitting task:updated to room ${workspaceRoom}`, { taskId: task.id, status: task.status });
    io.to(workspaceRoom).emit('task:updated', task);
    
    res.json(success(task, 'Task updated successfully'));
  } catch (error) {
    if (error.message.includes('not found') || error.message === 'Access denied') {
      const status = error.message.includes('not found') ? 404 : 403;
      return res.status(status).json({ success: false, message: error.message });
    }
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const task = await taskService.getTaskById(req.params.id, req.user.id);
    const result = await taskService.deleteTask(req.params.id, req.user.id);
    
    const { io } = await import('../index.js');
    io.to(`workspace:${task.project.workspaceId}`).emit('task:deleted', { taskId: req.params.id });
    
    res.json(success(result));
  } catch (error) {
    if (error.message.includes('not found') || error.message === 'Access denied') {
      const status = error.message.includes('not found') ? 404 : 403;
      return res.status(status).json({ success: false, message: error.message });
    }
    next(error);
  }
};
