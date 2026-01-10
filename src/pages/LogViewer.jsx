import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { logger } from '../utils/logger.js';
import './LogViewer.css';

function LogViewer() {
	const navigate = useNavigate();
	const [logs, setLogs] = useState({ server: [], client: [] });
	const [selectedType, setSelectedType] = useState('server');
	const [selectedFile, setSelectedFile] = useState(null);
	const [logContent, setLogContent] = useState('');
	const [autoRefresh, setAutoRefresh] = useState(true);
	const [refreshInterval, setRefreshInterval] = useState(2000); // 2 seconds
	const logContainerRef = useRef(null);
	const [isAutoScroll, setIsAutoScroll] = useState(false);

	// Function declarations before useEffect hooks
	const fetchLogContent = useCallback(async (type, filename) => {
		try {
			const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
			const response = await fetch(`${apiBaseUrl}/logs/read/${type}/${filename}`);
			const data = await response.json();
			setLogContent(data.content || '');
		} catch (err) {
			logger.error('LogViewer', 'Failed to fetch log content', { error: err.message });
		}
	}, []);

	const fetchLogList = useCallback(async () => {
		try {
			const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
			const response = await fetch(`${apiBaseUrl}/logs/list`);
			const data = await response.json();
			setLogs(data);

			// Auto-select most recent file
			if (!selectedFile) {
				const recentServer = data.server.sort((a, b) => 
					new Date(b.mtime) - new Date(a.mtime)
				)[0];
				if (recentServer) {
					setSelectedFile(recentServer.name);
					fetchLogContent('server', recentServer.name);
				}
			}
		} catch (err) {
			logger.error('LogViewer', 'Failed to fetch log list', { error: err.message });
		}
	}, [selectedFile, fetchLogContent]);

	const handleFileSelect = (type, filename) => {
		setSelectedType(type);
		setSelectedFile(filename);
		fetchLogContent(type, filename);
	};

	const formatFileSize = (bytes) => {
		if (bytes === 0) return '0 Bytes';
		const k = 1024;
		const sizes = ['Bytes', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
	};

	const formatDate = (date) => {
		return new Date(date).toLocaleString('de-DE');
	};

	// useEffect hooks after function declarations
	useEffect(() => {
		logger.route('/log-viewer', 'Log viewer page loaded');
		fetchLogList();
	}, [fetchLogList]);

	// Auto-refresh effect
	useEffect(() => {
		if (!autoRefresh || !selectedFile) return;

		const interval = setInterval(() => {
			fetchLogContent(selectedType, selectedFile);
		}, refreshInterval);

		return () => clearInterval(interval);
	}, [autoRefresh, selectedFile, selectedType, refreshInterval, fetchLogContent]);

	// Auto-scroll effect
	useEffect(() => {
		if (isAutoScroll && logContainerRef.current) {
			logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
		}
	}, [logContent, isAutoScroll]);

	return (
		<div className="log-viewer-container">
			<div className="log-viewer-header">
				<h1>📜 Log Viewer</h1>
				<button className="back-button-small" onClick={() => navigate('/')}>
					← Zurück
				</button>
			</div>

			<div className="log-viewer-content">
				<div className="log-sidebar">
					<div className="log-controls">
						<button onClick={fetchLogList} className="refresh-btn">
							🔄 Liste aktualisieren
						</button>
						
						<div className="auto-refresh-control">
							<label>
								<input
									type="checkbox"
									checked={autoRefresh}
									onChange={(e) => setAutoRefresh(e.target.checked)}
								/>
								Auto-Refresh
							</label>
							{autoRefresh && (
								<select
									value={refreshInterval}
									onChange={(e) => setRefreshInterval(Number(e.target.value))}
									className="refresh-interval"
								>
									<option value={1000}>1s</option>
									<option value={2000}>2s</option>
									<option value={5000}>5s</option>
									<option value={10000}>10s</option>
								</select>
							)}
						</div>

						<label className="auto-scroll-control">
							<input
								type="checkbox"
								checked={isAutoScroll}
								onChange={(e) => setIsAutoScroll(e.target.checked)}
							/>
							Auto-Scroll
						</label>
					</div>

					<div className="log-section">
						<h3>🖥️ Server Logs ({logs.server.length})</h3>
						<div className="log-file-list">
							{logs.server.map((file) => (
								<div
									key={file.name}
									className={`log-file-item ${selectedType === 'server' && selectedFile === file.name ? 'active' : ''}`}
									onClick={() => handleFileSelect('server', file.name)}
								>
									<div className="log-file-name">{file.name}</div>
									<div className="log-file-meta">
										<span>{formatFileSize(file.size)}</span>
										<span>{formatDate(file.mtime)}</span>
									</div>
								</div>
							))}
							{logs.server.length === 0 && (
								<div className="no-logs">Keine Server-Logs verfügbar</div>
							)}
						</div>
					</div>

					<div className="log-section">
						<h3>🌐 Client Logs ({logs.client.length})</h3>
						<div className="log-file-list">
							{logs.client.map((file) => (
								<div
									key={file.name}
									className={`log-file-item ${selectedType === 'client' && selectedFile === file.name ? 'active' : ''}`}
									onClick={() => handleFileSelect('client', file.name)}
								>
									<div className="log-file-name">{file.name}</div>
									<div className="log-file-meta">
										<span>{formatFileSize(file.size)}</span>
										<span>{formatDate(file.mtime)}</span>
									</div>
								</div>
							))}
							{logs.client.length === 0 && (
								<div className="no-logs">Keine Client-Logs verfügbar</div>
							)}
						</div>
					</div>
				</div>

				<div className="log-main">
					<div className="log-main-header">
						<div className="log-file-info">
							<span className="log-type-badge">{selectedType}</span>
							<span className="log-filename">{selectedFile || 'Keine Datei ausgewählt'}</span>
						</div>
						<div className="log-actions">
							{selectedFile && (
								<>
									<button 
										onClick={() => fetchLogContent(selectedType, selectedFile)}
										className="action-btn"
									>
										🔄 Aktualisieren
									</button>
									<span className="refresh-indicator">
										{autoRefresh && `⏱️ Auto: ${refreshInterval / 1000}s`}
									</span>
								</>
							)}
						</div>
					</div>

					<div className="log-content" ref={logContainerRef}>
						{logContent ? (
							<pre>{logContent}</pre>
						) : (
							<div className="log-empty">
								Wähle eine Log-Datei aus der Seitenleiste
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

export default LogViewer;
