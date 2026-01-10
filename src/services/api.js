/**
 * API Service Layer
 * Handles all HTTP requests to the backend API
 * Includes authentication, error handling, request cancellation, and logging
 */

import { logger } from '../utils/logger.js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

logger.info('API', `API Base URL: ${API_BASE_URL}`);

/**
 * Base fetch wrapper with authentication, error handling, and logging
 * @param {string} endpoint - API endpoint path
 * @param {object} options - Fetch options
 * @param {AbortSignal} signal - AbortController signal for cancellation
 * @returns {Promise} Response data
 */
async function apiFetch(endpoint, options = {}, signal = null) {
	const config = {
		...options,
		headers: {
			'Content-Type': 'application/json',
			...options.headers,
		},
		credentials: 'include', // Include cookies
		signal,
	};

	const startTime = performance.now();
	const method = options.method || 'GET';
	
	logger.debug('API', `${method} ${endpoint}`, { options: config });

	try {
		const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
		const duration = Math.round(performance.now() - startTime);
		
		if (!response.ok) {
			const error = await response.json();
			logger.api(method, endpoint, response.status, duration);
			logger.error('API', `Request failed: ${method} ${endpoint}`, {
				status: response.status,
				error: error.message
			});
			throw new Error(error.message || 'API request failed');
		}

		logger.api(method, endpoint, response.status, duration);
		logger.success('API', `${method} ${endpoint} succeeded (${duration}ms)`);
		
		return await response.json();
	} catch (error) {
		if (error.name === 'AbortError') {
			logger.warn('API', `Request cancelled: ${method} ${endpoint}`);
			throw error;
		}
		logger.error('API', `Request error: ${method} ${endpoint}`, {
			error: error.message,
			stack: error.stack
		});
		throw error;
	}
}

/**
 * Authentication API
 */
export const authApi = {
	/**
	 * Login user
	 * @param {string} username - Username
	 * @param {string} password - Password
	 * @returns {Promise} Login response with user and token
	 */
	login: async (username, password) => {
		return apiFetch('/auth/login', {
			method: 'POST',
			body: JSON.stringify({ username, password }),
		});
	},

	/**
	 * Logout user
	 * @returns {Promise} Logout confirmation
	 */
	logout: async () => {
		return apiFetch('/auth/logout', { method: 'POST' });
	},

	/**
	 * Get current user
	 * @returns {Promise} Current user data
	 */
	getCurrentUser: async () => {
		return apiFetch('/auth/me');
	},
};

/**
 * API Endpoints
 */
export const api = {
	/**
	 * Increment a number by 1
	 * @param {number} number - Number to increment
	 * @param {AbortSignal} signal - Optional cancellation signal
	 * @returns {Promise} Incremented result
	 */
	increment: async (number, signal = null) => {
		return apiFetch('/api/increment', {
			method: 'POST',
			body: JSON.stringify({ number }),
		}, signal);
	},

	/**
	 * Test endpoint
	 * @returns {Promise} Test response
	 */
	test: async () => {
		return apiFetch('/api/test');
	},
};
