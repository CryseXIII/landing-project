import express from 'express';
import jwt from 'jsonwebtoken';
import { LoginRequest, LoginResponse } from '../models/api.models.js';

const router = express.Router();

// Static user for development (no database)
const DEV_USER = {
	username: process.env.DEV_USER_USERNAME || 'developer',
	password: process.env.DEV_USER_PASSWORD || 'dev123',
	permissions: ['api.increment', 'api.read', 'api.write']
};

/**
 * POST /auth/login
 * Authenticate user and issue JWT token
 * 
 * @route POST /auth/login
 * @param {string} username - Username (body)
 * @param {string} password - Password (body)
 * @returns {LoginResponse} User info and JWT token
 * @example POST http://localhost:5000/auth/login
 * Body: { "username": "developer", "password": "dev123" }
 */
router.post('/login', (req, res) => {
	try {
		const loginReq = new LoginRequest(req.body);
		loginReq.validate();

		// Verify credentials (static user for dev)
		if (loginReq.username !== DEV_USER.username || loginReq.password !== DEV_USER.password) {
			return res.status(401).json({
				error: 'Invalid credentials',
				message: 'Username or password is incorrect'
			});
		}

		// Generate JWT token
		const token = jwt.sign(
			{
				username: DEV_USER.username,
				permissions: DEV_USER.permissions
			},
			process.env.JWT_SECRET,
			{ expiresIn: '24h' }
		);

		// Set httpOnly cookie
		res.cookie('token', token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			maxAge: 24 * 60 * 60 * 1000 // 24 hours
		});

		const response = new LoginResponse(DEV_USER, token);
		res.json(response);
	} catch (error) {
		res.status(400).json({
			error: 'Bad Request',
			message: error.message
		});
	}
});

/**
 * POST /auth/logout
 * Clear authentication token
 * 
 * @route POST /auth/logout
 * @returns {object} Success message
 * @example POST http://localhost:5000/auth/logout
 */
router.post('/logout', (req, res) => {
	res.clearCookie('token');
	res.json({ message: 'Logged out successfully' });
});

/**
 * GET /auth/me
 * Get current user info
 * 
 * @route GET /auth/me
 * @returns {object} Current user information
 * @example GET http://localhost:5000/auth/me
 */
router.get('/me', (req, res) => {
	const token = req.cookies.token;
	
	if (!token) {
		return res.status(401).json({ error: 'Not authenticated' });
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		res.json({ user: decoded });
	} catch (error) {
		res.status(401).json({ error: 'Invalid token' });
	}
});

export default router;
