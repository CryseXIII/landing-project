import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONFIG = {
	clientLogsDir: path.join(__dirname, '../../logs/client'),
	maxFileSize: 100 * 1024 * 1024, // 100MB
	maxFiles: 10,
	maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
	encoding: 'utf8',
};

// Ensure client logs directory exists
function ensureClientLogsDirectory() {
	if (!fs.existsSync(CONFIG.clientLogsDir)) {
		fs.mkdirSync(CONFIG.clientLogsDir, { recursive: true });
	}
}

// Get current client log file
function getCurrentClientLogFile() {
	const date = new Date().toISOString().split('T')[0];
	return path.join(CONFIG.clientLogsDir, `client-${date}.log`);
}

// Get file size
function getFileSize(filePath) {
	try {
		const stats = fs.statSync(filePath);
		return stats.size;
	} catch (err) {
		return 0;
	}
}

// Rotate log file
function rotateClientLogFile(filePath) {
	const size = getFileSize(filePath);
	if (size >= CONFIG.maxFileSize) {
		const timestamp = new Date().toISOString().replace(/:/g, '-').replace(/\./g, '-');
		const ext = path.extname(filePath);
		const base = path.basename(filePath, ext);
		const newPath = path.join(CONFIG.clientLogsDir, `${base}-${timestamp}${ext}`);
		
		try {
			fs.renameSync(filePath, newPath);
			return true;
		} catch (err) {
			console.error('Failed to rotate client log file:', err);
			return false;
		}
	}
	return false;
}

// Clean old client logs
function cleanOldClientLogs() {
	try {
		const files = fs.readdirSync(CONFIG.clientLogsDir);
		const logFiles = files
			.filter(file => file.endsWith('.log'))
			.map(file => ({
				name: file,
				path: path.join(CONFIG.clientLogsDir, file),
				age: Date.now() - fs.statSync(path.join(CONFIG.clientLogsDir, file)).mtime.getTime(),
				mtime: fs.statSync(path.join(CONFIG.clientLogsDir, file)).mtime.getTime(),
			}))
			.sort((a, b) => b.mtime - a.mtime);

		// Delete old files
		logFiles.forEach(file => {
			if (file.age > CONFIG.maxAge) {
				try {
					fs.unlinkSync(file.path);
				} catch (err) {
					console.error(`Failed to delete old client log file ${file.name}:`, err);
				}
			}
		});

		// Keep only maxFiles
		if (logFiles.length > CONFIG.maxFiles) {
			const filesToDelete = logFiles.slice(CONFIG.maxFiles);
			filesToDelete.forEach(file => {
				try {
					fs.unlinkSync(file.path);
				} catch (err) {
					console.error(`Failed to delete excess client log file ${file.name}:`, err);
				}
			});
		}
	} catch (err) {
		console.error('Failed to clean old client logs:', err);
	}
}

// Write to client log file
function writeToClientLogFile(message) {
	try {
		ensureClientLogsDirectory();
		const logFile = getCurrentClientLogFile();
		
		rotateClientLogFile(logFile);
		
		fs.appendFileSync(logFile, message + '\n', { encoding: CONFIG.encoding });
		
		if (Math.random() < 0.01) {
			cleanOldClientLogs();
		}
	} catch (err) {
		console.error('Failed to write to client log file:', err);
	}
}

// Icons map
const ICONS = {
	debug: '🐛',
	info: 'ℹ️',
	success: '✅',
	warn: '⚠️',
	error: '❌',
	fatal: '💀',
};

// POST /logs/client - Receive client logs
router.post('/client', (req, res) => {
	const { level, source, message, data, timestamp, userAgent, url } = req.body;
	
	const icon = ICONS[level] || 'ℹ️';
	const fileMessage = `${icon} [${timestamp}] [${level.toUpperCase()}] [CLIENT:${source}] ${message}`;
	
	writeToClientLogFile(fileMessage);
	
	if (data) {
		writeToClientLogFile(JSON.stringify(data, null, 2));
	}
	
	// Add metadata
	writeToClientLogFile(`  URL: ${url}`);
	writeToClientLogFile(`  User-Agent: ${userAgent}`);
	
	res.json({ success: true });
});

// GET /logs/list - List all log files
router.get('/list', (req, res) => {
	try {
		const serverLogs = fs.existsSync(path.join(__dirname, '../../logs/server'))
			? fs.readdirSync(path.join(__dirname, '../../logs/server'))
				.filter(f => f.endsWith('.log'))
				.map(f => ({
					name: f,
					type: 'server',
					size: getFileSize(path.join(__dirname, '../../logs/server', f)),
					mtime: fs.statSync(path.join(__dirname, '../../logs/server', f)).mtime,
				}))
			: [];

		const clientLogs = fs.existsSync(CONFIG.clientLogsDir)
			? fs.readdirSync(CONFIG.clientLogsDir)
				.filter(f => f.endsWith('.log'))
				.map(f => ({
					name: f,
					type: 'client',
					size: getFileSize(path.join(CONFIG.clientLogsDir, f)),
					mtime: fs.statSync(path.join(CONFIG.clientLogsDir, f)).mtime,
				}))
			: [];

		res.json({
			server: serverLogs,
			client: clientLogs,
		});
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// GET /logs/read/:type/:filename - Read log file content
router.get('/read/:type/:filename', (req, res) => {
	const { type, filename } = req.params;
	const logsDir = type === 'server' 
		? path.join(__dirname, '../../logs/server')
		: CONFIG.clientLogsDir;
	
	const filePath = path.join(logsDir, filename);
	
	// Security check: ensure file is within logs directory
	if (!filePath.startsWith(logsDir)) {
		return res.status(403).json({ error: 'Access denied' });
	}
	
	try {
		const content = fs.readFileSync(filePath, CONFIG.encoding);
		res.json({ content });
	} catch (err) {
		res.status(404).json({ error: 'File not found' });
	}
});

// GET /logs/tail/:type/:filename - Tail log file (last N lines)
router.get('/tail/:type/:filename', (req, res) => {
	const { type, filename } = req.params;
	const lines = parseInt(req.query.lines) || 100;
	
	const logsDir = type === 'server'
		? path.join(__dirname, '../../logs/server')
		: CONFIG.clientLogsDir;
	
	const filePath = path.join(logsDir, filename);
	
	if (!filePath.startsWith(logsDir)) {
		return res.status(403).json({ error: 'Access denied' });
	}
	
	try {
		const content = fs.readFileSync(filePath, CONFIG.encoding);
		const allLines = content.split('\n');
		const lastLines = allLines.slice(-lines).join('\n');
		res.json({ content: lastLines, totalLines: allLines.length });
	} catch (err) {
		res.status(404).json({ error: 'File not found' });
	}
});

// Initialize
ensureClientLogsDirectory();
cleanOldClientLogs();

export default router;
