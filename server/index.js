import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { loadEnvironment, getEnvironmentInfo } from './config/env-loader.js';
import { logger } from './utils/logger.js';
import authRoutes from './routes/auth.js';
import apiRoutes from './routes/api.js';

// Load environment configuration
const env = loadEnvironment();
logger.success('Server', `Environment loaded: ${env.nodeEnv} (${env.platform})`, {
	envFile: env.envFile,
	config: env.config
});

const app = express();
const PORT = env.config.port;

// Middleware
app.use(cors({
	origin: `http://localhost:${process.env.VITE_CLIENT_PORT || 5173}`, // Vite dev server
	credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Request logging middleware
app.use((req, res, next) => {
	const start = Date.now();
	res.on('finish', () => {
		const duration = Date.now() - start;
		logger.http(req.method, req.path, res.statusCode, duration);
	});
	next();
});

// Routes
app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

// Health check
app.get('/health', (req, res) => {
	const envInfo = getEnvironmentInfo();
	logger.debug('Health', 'Health check requested');
	res.json({
		status: 'ok',
		timestamp: new Date().toISOString(),
		environment: envInfo
	});
});

// Error handling middleware
app.use((err, req, res, next) => {
	logger.error('Server', 'Unhandled error', {
		error: err.message,
		stack: err.stack,
		path: req.path,
		method: req.method
	});
	
	res.status(500).json({
		error: 'Internal Server Error',
		message: process.env.NODE_ENV === 'production' ? 'An error occurred' : err.message
	});
});

app.listen(PORT, () => {
	logger.success('Server', `🚀 Server running on http://localhost:${PORT}`);
	logger.info('Server', `📝 Environment: ${env.nodeEnv}`);
	logger.info('Server', `📊 Log level: ${env.config.logLevelServer}`);
	logger.debug('Server', 'Server configuration', env.config);
});
