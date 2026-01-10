import * as commentService from '../services/comment.service.js';
import { success } from '../utils/response.js';

export const getComments = async (req, res, next) => {
  try {
    const comments = await commentService.getComments(req.query.taskId, req.user.id);
    res.json(success(comments));
  } catch (error) {
    if (error.message.includes('not found') || error.message === 'Access denied') {
      const status = error.message.includes('not found') ? 404 : 403;
      return res.status(status).json({ success: false, message: error.message });
    }
    next(error);
  }
};

export const createComment = async (req, res, next) => {
  try {
    const comment = await commentService.createComment(req.body, req.user.id);
    
    const { io } = await import('../index.js');
    io.to(`workspace:${comment.task.project.workspaceId}`).emit('comment:created', comment);
    
    res.status(201).json(success(comment, 'Comment created successfully'));
  } catch (error) {
    if (error.message.includes('not found') || error.message === 'Access denied') {
      const status = error.message.includes('not found') ? 404 : 403;
      return res.status(status).json({ success: false, message: error.message });
    }
    next(error);
  }
};

export const updateComment = async (req, res, next) => {
  try {
    const comment = await commentService.updateComment(req.params.id, req.body.content, req.user.id);
    res.json(success(comment, 'Comment updated successfully'));
  } catch (error) {
    if (error.message.includes('not found') || error.message.includes('Not authorized')) {
      const status = error.message.includes('not found') ? 404 : 403;
      return res.status(status).json({ success: false, message: error.message });
    }
    next(error);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const result = await commentService.deleteComment(req.params.id, req.user.id);
    res.json(success(result));
  } catch (error) {
    if (error.message.includes('not found') || error.message.includes('Not authorized')) {
      const status = error.message.includes('not found') ? 404 : 403;
      return res.status(status).json({ success: false, message: error.message });
    }
    next(error);
  }
};
