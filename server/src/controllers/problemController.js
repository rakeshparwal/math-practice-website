// server/src/controllers/problemController.js

const ProblemModel = require('../models/problemModel');

// Get problems (with optional filtering)
exports.getProblems = async (req, res, next) => {
    try {
        const { topicId, difficulty, sessionId, limit = 10 } = req.query;

        let problems;

        if (sessionId) {
            // Get problems for a specific session
            // This would typically use a session model to get problems assigned to a session
            problems = await ProblemModel.getByTopic(topicId || 'algebra', limit);
        } else if (topicId) {
            // Get problems by topic
            problems = await ProblemModel.getByTopic(topicId, limit);

            // Filter by difficulty if specified
            if (difficulty) {
                problems = problems.filter(p => p.difficulty === difficulty);
            }
        } else {
            // Return 400 if no filtering criteria
            return res.status(400).json({ message: 'Topic ID or session ID is required' });
        }

        res.json(problems);
    } catch (error) {
        next(error);
    }
};

// Get problem by ID
exports.getProblemById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const problem = await ProblemModel.getById(id);

        if (!problem) {
            return res.status(404).json({ message: 'Problem not found' });
        }

        res.json(problem);
    } catch (error) {
        next(error);
    }
};

// Create new problem (admin only)
exports.createProblem = async (req, res, next) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized: Admin access required' });
        }

        const { topicId, text, answer, solution, hint, difficulty, tags } = req.body;

        // Validate input
        if (!topicId || !text || !answer) {
            return res.status(400).json({ message: 'Topic ID, problem text, and answer are required' });
        }

        // Create problem
        const problem = await ProblemModel.create({
            topicId,
            text,
            answer,
            solution,
            hint,
            difficulty,
            tags
        });

        res.status(201).json({
            message: 'Problem created successfully',
            problem
        });
    } catch (error) {
        next(error);
    }
};

// Update problem (admin only)
exports.updateProblem = async (req, res, next) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized: Admin access required' });
        }

        const { id } = req.params;
        const updateData = req.body;

        // Update problem
        const problem = await ProblemModel.update(id, updateData);

        if (!problem) {
            return res.status(404).json({ message: 'Problem not found' });
        }

        res.json({
            message: 'Problem updated successfully',
            problem
        });
    } catch (error) {
        next(error);
    }
};

// Delete problem (admin only)
exports.deleteProblem = async (req, res, next) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized: Admin access required' });
        }

        const { id } = req.params;

        // Delete problem
        const problem = await ProblemModel.delete(id);

        if (!problem) {
            return res.status(404).json({ message: 'Problem not found' });
        }

        res.json({
            message: 'Problem deleted successfully',
            problem
        });
    } catch (error) {
        next(error);
    }
};
