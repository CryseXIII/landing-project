/**
 * Server-Side Logger with Icons, Colors, Timestamps, and Source Tracking
 * 
 * Log Levels: debug, info, success, warn, error, fatal
 * Each log includes: timestamp, level, icon, color, source, message
 * Log level controlled by LOG_LEVEL_SERVER environment variable
 */

// ANSI color codes for terminal
const colors = {
	reset: '\x1b[0m',
	bright: '\x1b[1m',
	dim: '\x1b[2m',
	
	// Text colors
	red: '\x1b[31m',
	green: '\x1b[32m',
	yellow: '\x1b[33m',
	blue: '\x1b[34m',
	magenta: '\x1b[35m',
	cyan: '\x1b[36m',
	white: '\x1b[37m',
	gray: '\x1b[90m',
	
	// Background colors
	bgRed: '\x1b[41m',
	bgGreen: '\x1b[42m',
	bgYellow: '\x1b[43m',
	bgBlue: '\x1b[44m',
};

// Log level hierarchy
const LOG_LEVELS = {
	debug: 0,
	info: 1,
	success: 2,
	warn: 3,
	error: 4,
	fatal: 5,
	none: 999,
};

// Icons for each log level
const ICONS = {
	debug: '🐛',
	info: 'ℹ️ ',
	success: '✅',
	warn: '⚠️ ',
	error: '❌',
	fatal: '💀',
	http: '🌐',
	auth: '🔐',
	db: '💾',
	api: '🔌',
};

// Color mapping for log levels
const LEVEL_COLORS = {
	debug: colors.gray,
	info: colors.blue,
	success: colors.green,
	warn: colors.yellow,
	error: colors.red,
	fatal: colors.bgRed + colors.white + colors.bright,
};

class ServerLogger {
	constructor() {
		this.logLevel = process.env.LOG_LEVEL_SERVER || 'info';
		this.minLevel = LOG_LEVELS[this.logLevel] || LOG_LEVELS.info;
		this.enableRequestLogging = process.env.ENABLE_REQUEST_LOGGING === 'true';
	}

	/**
	 * Format timestamp
	 */
	getTimestamp() {
		const now = new Date();
		return now.toISOString();
	}

	/**
	 * Core log function
	 * @param {string} level - Log level (debug, info, success, warn, error, fatal)
	 * @param {string} source - Source of the log (e.g., 'AuthController', 'API', 'Database')
	 * @param {string} message - Log message
	 * @param {object} data - Additional data to log
	 */
	log(level, source, message, data = null) {
		const levelValue = LOG_LEVELS[level];
		
		// Skip if below minimum log level
		if (levelValue < this.minLevel) {
			return;
		}

		const timestamp = this.getTimestamp();
		const icon = ICONS[level] || '📝';
		const color = LEVEL_COLORS[level] || colors.white;
		
		// Format the log message
		const logParts = [
			colors.dim + timestamp + colors.reset,
			color + icon + ' ' + level.toUpperCase().padEnd(7) + colors.reset,
			colors.cyan + '[' + source + ']' + colors.reset,
			message,
		];

		const logLine = logParts.join(' ');
		console.log(logLine);

		// Log additional data if provided
		if (data) {
			console.log(colors.gray + JSON.stringify(data, null, 2) + colors.reset);
		}
	}

	/**
	 * Debug level - detailed diagnostic info
	 */
	debug(source, message, data = null) {
		this.log('debug', source, message, data);
	}

	/**
	 * Info level - general informational messages
	 */
	info(source, message, data = null) {
		this.log('info', source, message, data);
	}

	/**
	 * Success level - successful operations
	 */
	success(source, message, data = null) {
		this.log('success', source, message, data);
	}

	/**
	 * Warn level - warning messages
	 */
	warn(source, message, data = null) {
		this.log('warn', source, message, data);
	}

	/**
	 * Error level - error messages
	 */
	error(source, message, data = null) {
		this.log('error', source, message, data);
	}

	/**
	 * Fatal level - critical errors that require immediate attention
	 */
	fatal(source, message, data = null) {
		this.log('fatal', source, message, data);
	}

	/**
	 * HTTP request logger
	 */
	http(method, path, status, duration) {
		if (!this.enableRequestLogging) return;

		const statusColor = status < 300 ? colors.green : status < 400 ? colors.yellow : colors.red;
		const message = `${method.padEnd(6)} ${path} ${statusColor}${status}${colors.reset} ${colors.dim}(${duration}ms)${colors.reset}`;
		
		this.log('info', 'HTTP', message);
	}

	/**
	 * API endpoint logger
	 */
	api(endpoint, operation, success, duration = null) {
		const level = success ? 'success' : 'error';
		const message = `${endpoint} - ${operation}${duration ? ` (${duration}ms)` : ''}`;
		this.log(level, 'API', message);
	}

	/**
	 * Authentication logger
	 */
	auth(event, username, success, details = null) {
		const level = success ? 'success' : 'warn';
		const message = `${event} - User: ${username} - ${success ? 'SUCCESS' : 'FAILED'}`;
		this.log(level, 'Auth', message, details);
	}
}

// Export singleton instance
export const logger = new ServerLogger();
export default logger;
