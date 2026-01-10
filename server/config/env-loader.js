import dotenv from 'dotenv';
import os from 'os';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Auto-detect environment based on OS and NODE_ENV
 * Automatically loads the correct .env file
 * 
 * Environment Detection Logic:
 * 1. Check NODE_ENV environment variable
 * 2. If not set, detect by OS:
 *    - Windows -> development
 *    - Darwin (Mac) -> testing
 *    - Linux -> production
 * 3. Load corresponding .env file (.env.development, .env.testing, .env.production)
 * 4. Fall back to .env if specific file not found
 */
export function loadEnvironment() {
	const platform = os.platform();
	let envFile = '.env';
	let detectedEnv = process.env.NODE_ENV;

	// Auto-detect environment if not explicitly set
	if (!detectedEnv) {
		if (platform === 'win32') {
			detectedEnv = 'development';
		} else if (platform === 'darwin') {
			detectedEnv = 'testing';
		} else if (platform === 'linux') {
			detectedEnv = 'production';
		} else {
			detectedEnv = 'development'; // default
		}
	}

	// Determine env file path
	const projectRoot = path.resolve(__dirname, '..', '..');
	const specificEnvFile = path.join(projectRoot, `.env.${detectedEnv}`);
	const defaultEnvFile = path.join(projectRoot, '.env');

	// Load specific env file if exists, otherwise fall back to .env
	if (fs.existsSync(specificEnvFile)) {
		envFile = `.env.${detectedEnv}`;
		dotenv.config({ path: specificEnvFile });
	} else if (fs.existsSync(defaultEnvFile)) {
		dotenv.config({ path: defaultEnvFile });
	}

	// Override NODE_ENV if it was auto-detected
	if (!process.env.NODE_ENV) {
		process.env.NODE_ENV = detectedEnv;
	}

	return {
		nodeEnv: process.env.NODE_ENV,
		osEnv: process.env.OS_ENV || platform,
		envFile,
		platform,
		config: {
			port: process.env.PORT || 5000,
			apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:5000',
			logLevelServer: process.env.LOG_LEVEL_SERVER || 'info',
			logLevelClient: process.env.LOG_LEVEL_CLIENT || 'info',
			enableSourceMaps: process.env.ENABLE_SOURCE_MAPS === 'true',
			jwtSecret: process.env.JWT_SECRET,
			jwtExpiry: process.env.JWT_EXPIRY || '24h',
		}
	};
}

/**
 * Get current environment info
 */
export function getEnvironmentInfo() {
	return {
		nodeEnv: process.env.NODE_ENV,
		platform: os.platform(),
		hostname: os.hostname(),
		nodeVersion: process.version,
		uptime: process.uptime(),
	};
}
