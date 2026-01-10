import express from 'express';
import * as taskController from '../controllers/task.controller.js';
import { authMiddleware } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validation.js';
import { createTaskSchema, updateTaskSchema } from '../validators/task.validator.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', taskController.getTasks);
router.post('/', validateRequest(createTaskSchema), taskController.createTask);
router.get('/:id', taskController.getTaskById);
router.put('/:id', validateRequest(updateTaskSchema), taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

export default router;
