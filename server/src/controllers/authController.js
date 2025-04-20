// server/src/controllers/authController.js

const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'math-practice-secret-key';

// Handle user login
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Find user by email
        const user = await UserModel.getByEmail(email);
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Verify password
        const isMatch = await UserModel.validatePassword(user, password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Create JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Remove password from response
        const userResponse = { ...user };
        delete userResponse.password;

        res.json({
            message: 'Login successful',
            token,
            user: userResponse
        });
    } catch (error) {
        next(error);
    }
};

// Handle user registration
exports.signup = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email, and password are required' });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        // Validate password strength
        if (password.length < 8) {
            return res.status(400).json({ message: 'Password must be at least 8 characters' });
        }

        // Create new user
        const user = await UserModel.create({ name, email, password });

        // Create JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email, role: 'user' },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: 'User created successfully',
            token,
            user
        });
    } catch (error) {
        if (error.message === 'User with this email already exists') {
            return res.status(409).json({ message: error.message });
        }
        next(error);
    }
};

// Verify token
exports.verifyToken = (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Authorization token required' });
        }

        // Verify token
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Invalid or expired token' });
            }

            // Add user data to request
            req.user = decoded;
            next();
        });
    } catch (error) {
        next(error);
    }
};