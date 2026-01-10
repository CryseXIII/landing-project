/**
 * Client-Side Logger with Console Styling, Icons, Timestamps, and File Logging
 * 
 * Logs to both browser console and server-side log files
 * Log level controlled by VITE_LOG_LEVEL_CLIENT environment variable
 */

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
	info: 'ℹ️',
	success: '✅',
	warn: '⚠️',
	error: '❌',
	fatal: '💀',
};

// Colors for console styling
const COLORS = {
	debug: '#00bcd4',    // Cyan
	info: '#2196f3',     // Blue
	success: '#4caf50',  // Green
	warn: '#ff9800',     // Orange
	error: '#f44336',    // Red
	fatal: '#9c27b0',    // Purple
	timestamp: '#9e9e9e', // Gray
	source: '#673ab7',   // Deep Purple
};

// Get current log level from environment
const currentLogLevel = import.meta.env.VITE_LOG_LEVEL_CLIENT || 'debug';

// Format timestamp
function formatTimestamp() {
	const now = new Date();
	const hours = String(now.getHours()).padStart(2, '0');
	const minutes = String(now.getMinutes()).padStart(2, '0');
	const seconds = String(now.getSeconds()).padStart(2, '0');
	const ms = String(now.getMilliseconds()).padStart(3, '0');
	return `${hours}:${minutes}:${seconds}.${ms}`;
}

// Send log to server for file storage
async function sendToServer(level, source, message, data) {
	try {
		const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
		await fetch(`${apiBaseUrl}/logs/client`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				level,
				source,
				message,
				data,
				timestamp: new Date().toISOString(),
				userAgent: navigator.userAgent,
				url: window.location.href,
			}),
		});
	} catch (err) {
		// Silently fail to avoid infinite loops
		console.error('Failed to send log to server:', err.message);
	}
}

// Main log function
function log(level, source, message, data = null) {
	const levelPriority = LOG_LEVELS[level];
	const currentPriority = LOG_LEVELS[currentLogLevel];

	if (levelPriority < currentPriority) return;

	const timestamp = formatTimestamp();
	const icon = ICONS[level];
	const color = COLORS[level];

	// Console output with styling
	const styles = [
		`color: ${COLORS.timestamp}; font-weight: normal;`,
		`color: ${color}; font-weight: bold;`,
		`color: ${COLORS.source}; font-weight: bold;`,
		`color: ${color}; font-weight: normal;`,
	];

	console.log(
		`%c[${timestamp}] %c${icon} [${level.toUpperCase()}] %c[${source}] %c${message}`,
		...styles
	);

	if (data) {
		console.log(data);
	}

	// Send to server for file storage
	sendToServer(level, source, message, data);
}

// Convenience methods
const logger = {
	debug: (source, message, data) => log('debug', source, message, data),
	info: (source, message, data) => log('info', source, message, data),
	success: (source, message, data) => log('success', source, message, data),
	warn: (source, message, data) => log('warn', source, message, data),
	error: (source, message, data) => log('error', source, message, data),
	fatal: (source, message, data) => log('fatal', source, message, data),

	// Specialized loggers
	api: (method, endpoint, status, duration) => {
		const level = status >= 500 ? 'error' : status >= 400 ? 'warn' : 'success';
		log(level, 'API', `${method} ${endpoint} → ${status} (${duration}ms)`);
	},

	auth: (action, message, data) => {
		const level = message.toLowerCase().includes('fail') ? 'error' : 'success';
		log(level, 'Auth', `${action}: ${message}`, data);
	},

	component: (name, message, data) => {
		log('debug', `Component:${name}`, message, data);
	},

	route: (path, message, data) => {
		log('info', 'Router', `${path} - ${message}`, data);
	},

	performance: (operation, duration) => {
		log('debug', 'Performance', `${operation} took ${duration}ms`);
	},
};

export { logger };
