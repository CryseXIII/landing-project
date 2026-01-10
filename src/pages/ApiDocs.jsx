import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ApiDocs.css';

function ApiDocs() {
	const navigate = useNavigate();
	const [selectedEndpoint, setSelectedEndpoint] = useState(null);

	const endpoints = [
		{
			id: 'increment',
			method: 'POST',
			path: '/api/increment',
			auth: 'Required',
			permission: 'api.increment',
			description: 'Increments a number by 1',
			usedIn: ['HelloWorld page (/hello)'],
			exampleUrl: 'http://localhost:5000/api/increment',
			parameters: [
				{
					name: 'number',
					type: 'number',
					location: 'body',
					required: true,
					description: 'The number to increment'
				}
			],
			exampleRequest: {
				number: 5
			},
			exampleResponse: {
				original: 5,
				incremented: 6,
				timestamp: '2026-01-10T12:00:00.000Z'
			},
			cancellable: true
		},
		{
			id: 'test',
			method: 'GET',
			path: '/api/test',
			auth: 'Not required',
			permission: null,
			description: 'Simple test endpoint to verify API is working',
			usedIn: ['Testing and health checks'],
			exampleUrl: 'http://localhost:5000/api/test',
			parameters: [],
			exampleRequest: null,
			exampleResponse: {
				message: 'API is working',
				timestamp: '2026-01-10T12:00:00.000Z'
			},
			cancellable: false
		},
		{
			id: 'login',
			method: 'POST',
			path: '/auth/login',
			auth: 'Not required',
			permission: null,
			description: 'Authenticate user and receive JWT token',
			usedIn: ['Login functionality'],
			exampleUrl: 'http://localhost:5000/auth/login',
			parameters: [
				{
					name: 'username',
					type: 'string',
					location: 'body',
					required: true,
					description: 'User username'
				},
				{
					name: 'password',
					type: 'string',
					location: 'body',
					required: true,
					description: 'User password'
				}
			],
			exampleRequest: {
				username: 'developer',
				password: 'dev123'
			},
			exampleResponse: {
				user: {
					username: 'developer',
					permissions: ['api.increment', 'api.read', 'api.write']
				},
				token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
				expiresIn: '24h'
			},
			cancellable: false
		}
	];

	return (
		<div className="api-docs-container">
			<div className="api-docs-content">
				<h1>API Documentation</h1>
				<p className="subtitle">Test and explore all available API endpoints</p>

				<div className="endpoints-grid">
					{endpoints.map(endpoint => (
						<div
							key={endpoint.id}
							className={`endpoint-card ${selectedEndpoint?.id === endpoint.id ? 'active' : ''}`}
							onClick={() => setSelectedEndpoint(endpoint)}
						>
							<div className="endpoint-header">
								<span className={`method method-${endpoint.method.toLowerCase()}`}>
									{endpoint.method}
								</span>
								<code className="path">{endpoint.path}</code>
							</div>
							<p className="description">{endpoint.description}</p>
							<div className="tags">
								<span className={`tag ${endpoint.auth === 'Required' ? 'auth-required' : 'auth-optional'}`}>
									{endpoint.auth}
								</span>
								{endpoint.permission && (
									<span className="tag permission">{endpoint.permission}</span>
								)}
							</div>
						</div>
					))}
				</div>

				{selectedEndpoint && (
					<div className="endpoint-details">
						<h2>{selectedEndpoint.method} {selectedEndpoint.path}</h2>
						<p>{selectedEndpoint.description}</p>

						<div className="detail-section">
							<h3>Usage</h3>
							<ul>
								{selectedEndpoint.usedIn.map((usage, i) => (
									<li key={i}>{usage}</li>
								))}
							</ul>
						</div>

						<div className="detail-section">
							<h3>Example URL</h3>
							<code className="code-block">{selectedEndpoint.exampleUrl}</code>
						</div>

						{selectedEndpoint.parameters.length > 0 && (
							<div className="detail-section">
								<h3>Parameters</h3>
								<table className="params-table">
									<thead>
										<tr>
											<th>Name</th>
											<th>Type</th>
											<th>Location</th>
											<th>Required</th>
											<th>Description</th>
										</tr>
									</thead>
									<tbody>
										{selectedEndpoint.parameters.map((param, i) => (
											<tr key={i}>
												<td><code>{param.name}</code></td>
												<td>{param.type}</td>
												<td><span className="location-badge">{param.location}</span></td>
												<td>{param.required ? 'Yes' : 'No'}</td>
												<td>{param.description}</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						)}

						{selectedEndpoint.exampleRequest && (
							<div className="detail-section">
								<h3>Example Request</h3>
								<pre className="code-block">
									{JSON.stringify(selectedEndpoint.exampleRequest, null, 2)}
								</pre>
							</div>
						)}

						<div className="detail-section">
							<h3>Example Response</h3>
							<pre className="code-block">
								{JSON.stringify(selectedEndpoint.exampleResponse, null, 2)}
							</pre>
						</div>

						{selectedEndpoint.cancellable && (
							<div className="detail-section">
								<div className="info-box">
									<strong>Cancellable:</strong> This request supports AbortController for cancellation
								</div>
							</div>
						)}
					</div>
				)}

				<button className="back-button" onClick={() => navigate('/')}>
					← Back to Home
				</button>
			</div>
		</div>
	);
}

export default ApiDocs;
