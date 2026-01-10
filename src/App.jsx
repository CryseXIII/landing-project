import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Button from './components/Button'
import { authApi } from './services/api'
import { logger } from './utils/logger.js'
import './App.css'

function App() {
	const [count, setCount] = useState(0)
	const [user, setUser] = useState(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		checkAuth();
	}, []);

	const checkAuth = async () => {
		try {
			const result = await authApi.getCurrentUser();
			setUser(result.user);
			logger.auth('App', 'User authenticated', { username: result.user.username });
		} catch (error) {
			logger.debug('App', 'No active session');
		} finally {
			setLoading(false);
		}
	};

	const handleLogout = async () => {
		try {
			await authApi.logout();
			setUser(null);
			logger.auth('App', 'User logged out');
		} catch (error) {
			logger.error('App', 'Logout failed', { error: error.message });
		}
	};

	if (loading) {
		return <div className="loading">Loading...</div>;
	}

	return (
		<>
			<div className="auth-status">
				{user ? (
					<div className="user-info">
						<span className="user-icon">👤</span>
						<span className="username">{user.username}</span>
						<button onClick={handleLogout} className="logout-button">
							Logout
						</button>
					</div>
				) : (
					<div className="guest-info">
						<span className="guest-icon">🔒</span>
						<span className="guest-text">Not logged in</span>
					</div>
				)}
			</div>
			<div>
				<a href="https://vite.dev" target="_blank">
					<img src={viteLogo} className="logo" alt="Vite logo" />
				</a>
				<a href="https://react.dev" target="_blank">
					<img src={reactLogo} className="logo react" alt="React logo" />
				</a>
			</div>
			<h1>Vite + React</h1>
			<div className="card">
				<button onClick={() => setCount((count) => count + 1)}>
					count is {count}
				</button>
				<p>
					Edit <code>src/App.jsx</code> and save to test HMR
				</p>
			</div>
			<div style={{ marginTop: '20px', display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
				{!user && <Button text="Login →" to="/login" />}
				<Button text="Go to Hello World →" to="/hello" />
				<Button text="API Documentation →" to="/api-docs" />
				<Button text="📚 Dokumentation (DE) →" to="/documentation" />
				<Button text="📜 Log Viewer →" to="/log-viewer" />
			</div>
			<p className="read-the-docs">
				Click on the Vite and React logos to learn more
			</p>
		</>
	)
}

export default App
