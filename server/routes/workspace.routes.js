import express from 'express';
import * as workspaceController from '../controllers/workspace.controller.js';
import { authMiddleware } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validation.js';
import {
  createWorkspaceSchema,
  updateWorkspaceSchema,
  addMemberSchema,
  updateMemberRoleSchema,
} from '../validators/workspace.validator.js';

const router = express.Router();

// All workspace routes require authentication
router.use(authMiddleware);

// Workspace CRUD
router.get('/', workspaceController.getUserWorkspaces);
router.post('/', validateRequest(createWorkspaceSchema), workspaceController.createWorkspace);
router.get('/:id', workspaceController.getWorkspaceById);
router.put('/:id', validateRequest(updateWorkspaceSchema), workspaceController.updateWorkspace);
router.delete('/:id', workspaceController.deleteWorkspace);

// Workspace members
router.get('/:id/members', workspaceController.getMembers);
router.post('/:id/members', validateRequest(addMemberSchema), workspaceController.addMember);
router.delete('/:id/members/:userId', workspaceController.removeMember);
router.put('/:id/members/:userId', validateRequest(updateMemberRoleSchema), workspaceController.updateMemberRole);

export default router;
