import express from 'express';
import { authenticate, requirePermission } from '../middleware/auth.js';
import { IncrementRequest, IncrementResponse } from '../models/api.models.js';

const router = express.Router();

/**
 * POST /api/increment
 * Increments a number by 1
 * 
 * @route POST /api/increment
 * @authentication Required - JWT token in httpOnly cookie
 * @permission api.increment
 * @param {number} number - Number to increment (body)
 * @returns {IncrementResponse} Original and incremented number
 * @usage Used in: HelloWorld page (/hello)
 * @example POST http://localhost:5000/api/increment
 * Body: { "number": 5 }
 * Response: { "original": 5, "incremented": 6, "timestamp": "2026-01-10T..." }
 * @cancellable Yes - supports AbortController
 */
router.post('/increment', authenticate, requirePermission('api.increment'), (req, res) => {
	try {
		const incrementReq = new IncrementRequest(req.body);
		incrementReq.validate();

		const result = incrementReq.number + 1;
		const response = new IncrementResponse(incrementReq.number, result);

		res.json(response);
	} catch (error) {
		res.status(400).json({
			error: 'Bad Request',
			message: error.message
		});
	}
});

/**
 * GET /api/test
 * Simple test endpoint (no auth required)
 * 
 * @route GET /api/test
 * @returns {object} Test response
 * @example GET http://localhost:5000/api/test
 */
router.get('/test', (req, res) => {
	res.json({
		message: 'API is working',
		timestamp: new Date().toISOString()
	});
});

export default router;
