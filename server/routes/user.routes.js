import express from 'express';
import * as userController from '../controllers/user.controller.js';
import { authMiddleware } from '../middleware/auth.js';
import {
  validateUpdateProfile,
  validateChangePassword,
  validateUpdatePreferences,
} from '../validators/user.validator.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Profile routes
router.patch('/profile', validateUpdateProfile, userController.updateProfile);
router.patch('/password', validateChangePassword, userController.changePassword);
router.post('/avatar', userController.uploadAvatar);

// Preferences routes
router.get('/preferences', userController.getPreferences);
router.patch('/preferences', validateUpdatePreferences, userController.updatePreferences);

export default router;
