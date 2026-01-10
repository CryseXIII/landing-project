import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, authApi } from '../services/api';
import { logger } from '../utils/logger.js';
import './HelloWorld.css';

function HelloWorld() {
	const navigate = useNavigate();
	const [user, setUser] = useState(null);
	const [number, setNumber] = useState(0);
	const [result, setResult] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		logger.route('/hello', 'HelloWorld page loaded');
		// Check if user is authenticated
		authApi.getCurrentUser()
			.then(data => {
				setUser(data.user);
				logger.component('HelloWorld', 'User authenticated', { username: data.user.username });
			})
			.catch(() => {
				setUser(null);
				logger.debug('HelloWorld', 'No user session found');
			});
	}, []);

	const handleIncrement = async () => {
		setLoading(true);
		setError(null);
		
		logger.component('HelloWorld', 'Increment button clicked', { number });
		
		try {
			const response = await api.increment(number);
			setResult(response);
			logger.success('HelloWorld', 'Increment successful', { result: response });
		} catch (err) {
			setError(err.message);
			logger.error('HelloWorld', 'Increment failed', { error: err.message });
		} finally {
			setLoading(false);
		}
	};

	const hasPermission = user && user.permissions && user.permissions.includes('api.increment');

	return (
		<div className="hello-container">
			<div className="hello-content">
				<h1 className="hello-title">Hello World!</h1>
				<p className="hello-text">Welcome to your first route in React Router.</p>
				
				{user && (
					<div className="user-info">
						<p>Logged in as: <strong>{user.username}</strong></p>
					</div>
				)}

				{hasPermission && (
					<div className="api-test">
						<h2>API Test: Increment</h2>
						<div className="input-group">
							<input
								type="number"
								value={number}
								onChange={(e) => setNumber(Number(e.target.value))}
								placeholder="Enter a number"
								className="number-input"
							/>
							<button
								onClick={handleIncrement}
								disabled={loading}
								className="increment-button"
							>
								{loading ? 'Processing...' : 'Increment +1'}
							</button>
						</div>
						
						{result && (
							<div className="result">
								<p>Original: <strong>{result.original}</strong></p>
								<p>Incremented: <strong>{result.incremented}</strong></p>
								<p className="timestamp">{new Date(result.timestamp).toLocaleString()}</p>
							</div>
						)}
						
						{error && (
							<div className="error">
								Error: {error}
							</div>
						)}
					</div>
				)}

				{!user && (
					<div className="login-prompt">
						<p>Please login to test API endpoints</p>
						<p className="hint">Username: developer | Password: dev123</p>
					</div>
				)}

				<button className="back-button" onClick={() => navigate('/')}>
					← Back to Home
				</button>
			</div>
		</div>
	);
}

export default HelloWorld;
