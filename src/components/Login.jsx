import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../services/api';
import { logger } from '../utils/logger.js';
import './Login.css';

export default function Login({ onLoginSuccess }) {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');
		setLoading(true);

		logger.component('Login', 'Login attempt started', { username });

		try {
			const result = await authApi.login(username, password);
			logger.auth('Login', 'Login successful', { username });
			
			if (onLoginSuccess) {
				onLoginSuccess(result.user);
			}
			
			// Redirect to HelloWorld page after successful login
			navigate('/hello');
		} catch (err) {
			const errorMessage = err.message || 'Login failed';
			logger.error('Login', 'Login failed', { username, error: errorMessage });
			setError(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="login-container">
			<div className="login-card">
				<h2>Login</h2>
				<p className="login-subtitle">Sign in to access API features</p>
				
				<form onSubmit={handleSubmit} className="login-form">
					<div className="form-group">
						<label htmlFor="username">Username</label>
						<input
							type="text"
							id="username"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							placeholder="developer"
							required
							disabled={loading}
							autoComplete="username"
						/>
					</div>

					<div className="form-group">
						<label htmlFor="password">Password</label>
						<input
							type="password"
							id="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="dev123"
							required
							disabled={loading}
							autoComplete="current-password"
						/>
					</div>

					{error && (
						<div className="error-message">
							<span className="error-icon">⚠️</span>
							{error}
						</div>
					)}

					<button 
						type="submit" 
						className="login-button"
						disabled={loading}
					>
						{loading ? 'Logging in...' : 'Login'}
					</button>
				</form>

				<div className="login-hint">
					<p><strong>Dev Credentials:</strong></p>
					<p>Username: <code>developer</code></p>
					<p>Password: <code>dev123</code></p>
				</div>
			</div>
		</div>
	);
}
