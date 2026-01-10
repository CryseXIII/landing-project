/**
 * Request model for increment endpoint
 * Validates incoming increment requests
 */
export class IncrementRequest {
	constructor(data) {
		this.number = data.number;
	}

	validate() {
		if (typeof this.number !== 'number') {
			throw new Error('number must be a valid number');
		}
		return true;
	}
}

/**
 * Response model for increment endpoint
 * Standardizes API responses
 */
export class IncrementResponse {
	constructor(original, incremented) {
		this.original = original;
		this.incremented = incremented;
		this.timestamp = new Date().toISOString();
	}
}

/**
 * Login request model
 */
export class LoginRequest {
	constructor(data) {
		this.username = data.username;
		this.password = data.password;
	}

	validate() {
		if (!this.username || !this.password) {
			throw new Error('username and password are required');
		}
		return true;
	}
}

/**
 * Login response model
 */
export class LoginResponse {
	constructor(user, token) {
		this.user = {
			username: user.username,
			permissions: user.permissions
		};
		this.token = token;
		this.expiresIn = '24h';
	}
}
