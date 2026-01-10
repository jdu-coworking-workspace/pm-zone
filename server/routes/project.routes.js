import express from 'express';
import * as projectController from '../controllers/project.controller.js';
import { authMiddleware } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validation.js';
import { createProjectSchema, updateProjectSchema } from '../validators/project.validator.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', projectController.getProjects);
router.post('/', validateRequest(createProjectSchema), projectController.createProject);
router.get('/:id', projectController.getProjectById);
router.put('/:id', validateRequest(updateProjectSchema), projectController.updateProject);
router.delete('/:id', projectController.deleteProject);

router.post('/:id/members', projectController.addProjectMember);
router.delete('/:id/members/:userId', projectController.removeProjectMember);

export default router;
