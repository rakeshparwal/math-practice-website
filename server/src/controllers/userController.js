// server/src/controllers/userController.js

const UserModel = require('../models/userModel');

// Get current user
exports.getCurrentUser = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const user = await UserModel.getById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        next(error);
    }
};

// Update user profile
exports.updateProfile = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { name } = req.body;

        const updatedUser = await UserModel.update(userId, { name });

        res.json({
            message: 'Profile updated successfully',
            user: updatedUser
        });
    } catch (error) {
        next(error);
    }
};

// Change password
exports.changePassword = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { currentPassword, newPassword } = req.body;

        // Validate input
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Current password and new password are required' });
        }

        // Get user
        const user = await UserModel.getById(userId);

        // Verify current password
        const isMatch = await UserModel.validatePassword(user, currentPassword);
        if (!isMatch) {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }

        // Validate new password strength
        if (newPassword.length < 8) {
            return res.status(400).json({ message: 'New password must be at least 8 characters' });
        }

        // Update password
        await UserModel.update(userId, { password: newPassword });

        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        next(error);
    }
};

// Get user progress by topic
exports.getProgressByTopic = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { topicId } = req.params;

        // This would typically query the sessions and answers tables to calculate progress
        // Simplified implementation for this example

        res.json({
            userId,
            topicId,
            totalProblems: 0,
            completedProblems: 0,
            correctAnswers: 0,
            accuracy: 0,
            lastActive: new Date().toISOString()
        });
    } catch (error) {
        next(error);
    }
};
