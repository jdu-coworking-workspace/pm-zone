import * as userService from '../services/user.service.js';

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Changed from req.user.userId
    const updatedUser = await userService.updateProfile(userId, req.body);
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser,
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update profile',
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id; // Changed from req.user.userId
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required',
      });
    }

    const result = await userService.changePassword(userId, currentPassword, newPassword);
    
    res.json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to change password',
    });
  }
};

export const uploadAvatar = async (req, res) => {
  try {
    const userId = req.user.id; // Changed from req.user.userId
    
    // TODO: Implement actual file upload with multer
    // For now, just accept a URL
    const { imageUrl } = req.body;
    
    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        message: 'Image URL is required',
      });
    }

    const updatedUser = await userService.updateAvatar(userId, imageUrl);
    
    res.json({
      success: true,
      message: 'Avatar updated successfully',
      data: updatedUser,
    });
  } catch (error) {
    console.error('Error uploading avatar:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to upload avatar',
    });
  }
};

export const getPreferences = async (req, res) => {
  try {
    const userId = req.user.id; // Changed from req.user.userId
    const preferences = await userService.getPreferences(userId);
    
    res.json({
      success: true,
      data: preferences,
    });
  } catch (error) {
    console.error('Error getting preferences:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get preferences',
    });
  }
};

export const updatePreferences = async (req, res) => {
  try {
    const userId = req.user.id; // Changed from req.user.userId
    const preferences = await userService.updatePreferences(userId, req.body);
    
    res.json({
      success: true,
      message: 'Preferences updated successfully',
      data: preferences,
    });
  } catch (error) {
    console.error('Error updating preferences:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update preferences',
    });
  }
};
