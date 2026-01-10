/**
 * Client-Side Logger with Icons, Colors, Timestamps, and Source Tracking
 * 
 * Log Levels: debug, info, success, warn, error
 * Each log includes: timestamp, level, icon, color, source, message
 * Log level controlled by VITE_LOG_LEVEL_CLIENT environment variable
 */

// Log level hierarchy
const LOG_LEVELS = {
	debug: 0,
	info: 1,
	success: 2,
	warn: 3,
	error: 4,
	none: 999,
};

// Icons for each log level
const ICONS = {
	debug: '🐛',
	info: 'ℹ️',
	success: '✅',
	warn: '⚠️',
	error: '❌',
	http: '🌐',
	auth: '🔐',
	api: '🔌',
	component: '⚛️',
	route: '🔀',
};

// Color styles for browser console
const STYLES = {
	debug: 'color: #9ca3af; font-weight: normal;',
	info: 'color: #3b82f6; font-weight: normal;',
	success: 'color: #10b981; font-weight: bold;',
	warn: 'color: #f59e0b; font-weight: bold;',
	error: 'color: #ef4444; font-weight: bold;',
	timestamp: 'color: #6b7280; font-size: 0.85em;',
	source: 'color: #06b6d4; font-weight: bold;',
	message: 'color: #e5e7eb;',
};

class ClientLogger {
	constructor() {
		// Get log level from Vite env variable
		const envLogLevel = import.meta.env.VITE_LOG_LEVEL_CLIENT || 'info';
		this.logLevel = envLogLevel;
		this.minLevel = LOG_LEVELS[this.logLevel] || LOG_LEVELS.info;
	}

	/**
	 * Format timestamp
	 */
	getTimestamp() {
		const now = new Date();
		const hours = String(now.getHours()).padStart(2, '0');
		const minutes = String(now.getMinutes()).padStart(2, '0');
		const seconds = String(now.getSeconds()).padStart(2, '0');
		const ms = String(now.getMilliseconds()).padStart(3, '0');
		return `${hours}:${minutes}:${seconds}.${ms}`;
	}

	/**
	 * Core log function
	 * @param {string} level - Log level (debug, info, success, warn, error)
	 * @param {string} source - Source of the log (e.g., 'Button', 'API', 'Auth')
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
		const style = STYLES[level] || STYLES.message;
		
		// Format log message with styles
		const logFormat = [
			`%c${timestamp}`,
			`%c ${icon} ${level.toUpperCase()}`,
			`%c [${source}]`,
			`%c ${message}`,
		];

		const logStyles = [
			STYLES.timestamp,
			style,
			STYLES.source,
			STYLES.message,
		];

		// Use appropriate console method
		const consoleMethod = level === 'error' ? console.error : 
		                      level === 'warn' ? console.warn : 
		                      console.log;

		if (data) {
			consoleMethod(logFormat.join(''), ...logStyles, '\nData:', data);
		} else {
			consoleMethod(logFormat.join(''), ...logStyles);
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
	 * HTTP/API request logger
	 */
	api(method, endpoint, status, duration = null) {
		const success = status >= 200 && status < 300;
		const level = success ? 'success' : 'error';
		const message = `${method} ${endpoint} - ${status}${duration ? ` (${duration}ms)` : ''}`;
		this.log(level, 'API', message);
	}

	/**
	 * Authentication event logger
	 */
	auth(event, success, details = null) {
		const level = success ? 'success' : 'error';
		const message = `${event} - ${success ? 'SUCCESS' : 'FAILED'}`;
		this.log(level, 'Auth', message, details);
	}

	/**
	 * Component lifecycle logger
	 */
	component(componentName, event, data = null) {
		this.debug('Component', `${componentName} - ${event}`, data);
	}

	/**
	 * Route navigation logger
	 */
	route(from, to) {
		this.info('Router', `Navigation: ${from} → ${to}`);
	}

	/**
	 * Performance measurement
	 */
	performance(operation, duration) {
		const level = duration > 1000 ? 'warn' : 'info';
		this.log(level, 'Performance', `${operation} took ${duration}ms`);
	}
}

// Export singleton instance
export const logger = new ClientLogger();
export default logger;
