import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONFIG = {
	logsDir: path.join(__dirname, '../../logs/server'),
	maxFileSize: 100 * 1024 * 1024, // 100MB in bytes
	maxFiles: 10, // Maximum number of log files to keep
	maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
	encoding: 'utf8',
};

// Log levels with icons and colors
const LOG_LEVELS = {
	debug: { priority: 0, icon: '🐛', color: '\x1b[36m' },
	info: { priority: 1, icon: 'ℹ️', color: '\x1b[34m' },
	success: { priority: 2, icon: '✅', color: '\x1b[32m' },
	warn: { priority: 3, icon: '⚠️', color: '\x1b[33m' },
	error: { priority: 4, icon: '❌', color: '\x1b[31m' },
	fatal: { priority: 5, icon: '💀', color: '\x1b[35m' },
};

const RESET = '\x1b[0m';
const currentLogLevel = process.env.LOG_LEVEL_SERVER || 'debug';

// Ensure logs directory exists
function ensureLogsDirectory() {
	if (!fs.existsSync(CONFIG.logsDir)) {
		fs.mkdirSync(CONFIG.logsDir, { recursive: true });
	}
}

// Get current log file path
function getCurrentLogFile() {
	const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
	return path.join(CONFIG.logsDir, `server-${date}.log`);
}

// Get log file size
function getFileSize(filePath) {
	try {
		const stats = fs.statSync(filePath);
		return stats.size;
	} catch (error) {
		return 0;
	}
}

// Get log file age
function getFileAge(filePath) {
	try {
		const stats = fs.statSync(filePath);
		return Date.now() - stats.mtime.getTime();
	} catch (error) {
		return 0;
	}
}

// Rotate log file if needed
function rotateLogFile(filePath) {
	const size = getFileSize(filePath);
	if (size >= CONFIG.maxFileSize) {
		const timestamp = new Date().toISOString().replace(/:/g, '-').replace(/\./g, '-');
		const ext = path.extname(filePath);
		const base = path.basename(filePath, ext);
		const newPath = path.join(CONFIG.logsDir, `${base}-${timestamp}${ext}`);
		
		try {
			fs.renameSync(filePath, newPath);
			return true;
		} catch (error) {
			console.error('Failed to rotate log file:', error);
			return false;
		}
	}
	return false;
}

// Clean old log files
function cleanOldLogs() {
	try {
		const files = fs.readdirSync(CONFIG.logsDir);
		const logFiles = files
			.filter(file => file.endsWith('.log'))
			.map(file => ({
				name: file,
				path: path.join(CONFIG.logsDir, file),
				age: getFileAge(path.join(CONFIG.logsDir, file)),
				mtime: fs.statSync(path.join(CONFIG.logsDir, file)).mtime.getTime(),
			}))
			.sort((a, b) => b.mtime - a.mtime); // Sort by modification time (newest first)

		// Delete files older than maxAge
		logFiles.forEach(file => {
			if (file.age > CONFIG.maxAge) {
				try {
					fs.unlinkSync(file.path);
					console.log(`🗑️  Deleted old log file: ${file.name}`);
				} catch (error) {
					console.error(`Failed to delete old log file ${file.name}:`, error);
				}
			}
		});

		// Keep only maxFiles newest files
		if (logFiles.length > CONFIG.maxFiles) {
			const filesToDelete = logFiles.slice(CONFIG.maxFiles);
			filesToDelete.forEach(file => {
				try {
					fs.unlinkSync(file.path);
					console.log(`🗑️  Deleted excess log file: ${file.name} (max ${CONFIG.maxFiles} files)`);
				} catch (error) {
					console.error(`Failed to delete excess log file ${file.name}:`, error);
				}
			});
		}
	} catch (error) {
		console.error('Failed to clean old logs:', error);
	}
}

// Write to log file
function writeToFile(message) {
	try {
		ensureLogsDirectory();
		const logFile = getCurrentLogFile();
		
		// Rotate if needed
		rotateLogFile(logFile);
		
		// Append to file with UTF-8 encoding
		fs.appendFileSync(logFile, message + '\n', { encoding: CONFIG.encoding });
		
		// Clean old logs periodically (every write is too frequent, so we do it randomly)
		if (Math.random() < 0.01) { // 1% chance per write
			cleanOldLogs();
		}
	} catch (error) {
		console.error('Failed to write to log file:', error);
	}
}

// Format timestamp
function formatTimestamp() {
	const now = new Date();
	return now.toISOString();
}

// Main log function
function log(level, source, message, data = null) {
	const levelInfo = LOG_LEVELS[level];
	if (!levelInfo) return;

	const currentLevel = LOG_LEVELS[currentLogLevel];
	if (levelInfo.priority < currentLevel.priority) return;

	const timestamp = formatTimestamp();
	const icon = levelInfo.icon;
	const color = levelInfo.color;

	// Console output (with colors)
	const consoleMessage = `${color}${icon} [${timestamp}] [${level.toUpperCase()}] [${source}]${RESET} ${message}`;
	console.log(consoleMessage);
	if (data) {
		console.log(`${color}${JSON.stringify(data, null, 2)}${RESET}`);
	}

	// File output (without ANSI colors)
	const fileMessage = `${icon} [${timestamp}] [${level.toUpperCase()}] [${source}] ${message}`;
	writeToFile(fileMessage);
	if (data) {
		writeToFile(JSON.stringify(data, null, 2));
	}
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
	http: (method, path, status, duration) => {
		const level = status >= 500 ? 'error' : status >= 400 ? 'warn' : 'success';
		log(level, 'HTTP', `${method} ${path} ${status} - ${duration}ms`);
	},

	api: (method, endpoint, status, duration) => {
		const level = status >= 500 ? 'error' : status >= 400 ? 'warn' : 'success';
		log(level, 'API', `${method} ${endpoint} → ${status} (${duration}ms)`);
	},

	auth: (action, message, data) => {
		const level = message.toLowerCase().includes('fail') ? 'error' : 'success';
		log(level, 'Auth', `${action}: ${message}`, data);
	},

	// Get configuration
	getConfig: () => ({ ...CONFIG }),

	// Manual cleanup trigger
	cleanup: () => {
		cleanOldLogs();
	},
};

// Initialize: ensure directory exists and clean old logs on startup
ensureLogsDirectory();
cleanOldLogs();

export { logger };
