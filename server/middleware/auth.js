import jwt from 'jsonwebtoken';

/**
 * Authentication middleware
 * Validates JWT token from httpOnly cookie
 * Used on all protected API endpoints
 * 
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const authenticate = (req, res, next) => {
	try {
		const token = req.cookies.token;

		if (!token) {
			return res.status(401).json({
				error: 'Unauthorized',
				message: 'No authentication token provided'
			});
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = decoded;
		next();
	} catch (error) {
		return res.status(401).json({
			error: 'Unauthorized',
			message: 'Invalid or expired token'
		});
	}
};

/**
 * Permission check middleware
 * Verifies user has required permission
 * 
 * @param {string} permission - Required permission name
 * @returns {Function} Express middleware function
 */
export const requirePermission = (permission) => {
	return (req, res, next) => {
		if (!req.user || !req.user.permissions || !req.user.permissions.includes(permission)) {
			return res.status(403).json({
				error: 'Forbidden',
				message: `Missing required permission: ${permission}`
			});
		}
		next();
	};
};
