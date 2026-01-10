import { useNavigate } from 'react-router-dom';
import { logger } from '../utils/logger.js';
import { useEffect } from 'react';
import './Documentation.css';

function Documentation() {
	const navigate = useNavigate();

	useEffect(() => {
		logger.route('/documentation', 'Documentation page loaded');
	}, []);

	return (
		<div className="docs-container">
			<div className="docs-content">
				<h1>📚 Projektdokumentation</h1>
				
				<section className="docs-section">
					<h2>🎯 Übersicht</h2>
					<p>
						Willkommen zur Dokumentation des Landing Projects! Diese Seite erklärt die vollständige 
						Architektur, Funktionen und Arbeitsabläufe des Projekts auf Deutsch.
					</p>
				</section>

				<section className="docs-section">
					<h2>🏗️ Projektstruktur</h2>
					<div className="code-block">
						<pre>{`landing-project/
├── src/                      # Client-Anwendung (Frontend)
│   ├── components/           # Wiederverwendbare UI-Komponenten
│   │   ├── Button.jsx       # Navigations-Button
│   │   └── Login.jsx        # Login-Formular
│   ├── pages/               # Seiten-Komponenten (Routen)
│   │   ├── HelloWorld.jsx   # API-Test Seite
│   │   ├── ApiDocs.jsx      # API-Dokumentation
│   │   └── Documentation.jsx # Diese Seite
│   ├── services/            # API-Service Layer
│   │   └── api.js          # Fetch-Wrapper für Backend
│   ├── styles/              # Globale Styles
│   │   └── theme.css       # CSS-Variablen (Dark Theme)
│   └── utils/               # Client-Utilities
│       └── logger.js        # Client-Logger
│
├── server/                   # Server-Anwendung (Backend)
│   ├── config/              # Konfiguration
│   │   └── env-loader.js   # Automatische Umgebungserkennung
│   ├── middleware/          # Express Middleware
│   │   └── auth.js         # JWT-Authentifizierung
│   ├── models/              # Datenmodelle
│   │   └── api.models.js   # Request/Response Modelle
│   ├── routes/              # API-Routen
│   │   ├── auth.js         # Login/Logout Endpunkte
│   │   └── api.js          # API-Endpunkte
│   └── utils/               # Server-Utilities
│       └── logger.js        # Server-Logger
│
├── public/                   # Statische Assets
├── .env.development          # Windows-Entwicklungsumgebung
├── .env.testing              # Mac-Testumgebung
├── .env.production           # Linux-Produktionsumgebung
└── package.json              # Abhängigkeiten & Scripts`}</pre>
					</div>
				</section>

				<section className="docs-section">
					<h2>💻 Client vs. Server</h2>
					
					<div className="info-card">
						<h3>Client-Anwendung (Frontend)</h3>
						<p><strong>Speicherort:</strong> <code>C:\Users\Vikto\Desktop\VSCode\landing-project\src\</code></p>
						<p><strong>Technologie:</strong> React 19 + Vite</p>
						<p><strong>Port:</strong> http://localhost:5173</p>
						<p><strong>Zweck:</strong> Benutzeroberfläche, die im Browser läuft</p>
						<ul>
							<li>React-Komponenten für UI-Elemente</li>
							<li>Client-seitiges Routing (React Router)</li>
							<li>API-Aufrufe an den Server</li>
							<li>Zustandsverwaltung (useState, useEffect)</li>
							<li>Browser-Console Logging mit Farben</li>
						</ul>
					</div>

					<div className="info-card">
						<h3>Server-Anwendung (Backend)</h3>
						<p><strong>Speicherort:</strong> <code>C:\Users\Vikto\Desktop\VSCode\landing-project\server\</code></p>
						<p><strong>Technologie:</strong> Node.js + Express</p>
						<p><strong>Port:</strong> http://localhost:5000</p>
						<p><strong>Zweck:</strong> API-Server, der auf dem Computer läuft</p>
						<ul>
							<li>RESTful API-Endpunkte</li>
							<li>JWT-Authentifizierung mit Cookies</li>
							<li>Datenverarbeitung und Geschäftslogik</li>
							<li>Berechtigungsprüfungen</li>
							<li>Terminal-Logging mit ANSI-Farben</li>
						</ul>
					</div>
				</section>

				<section className="docs-section">
					<h2>🔌 API-Endpunkte</h2>
					
					<div className="endpoint-card">
						<div className="endpoint-header">
							<span className="method post">POST</span>
							<code>/auth/login</code>
						</div>
						<p><strong>Zweck:</strong> Benutzer-Anmeldung mit JWT-Token</p>
						<p><strong>Authentifizierung:</strong> Nicht erforderlich</p>
						<p><strong>Request Body:</strong></p>
						<div className="code-block">
							<pre>{`{
  "username": "developer",
  "password": "dev123"
}`}</pre>
						</div>
						<p><strong>Response:</strong></p>
						<div className="code-block">
							<pre>{`{
  "message": "Login successful",
  "user": {
    "username": "developer",
    "permissions": ["api.increment", "api.read", "api.write"]
  }
}`}</pre>
						</div>
					</div>

					<div className="endpoint-card">
						<div className="endpoint-header">
							<span className="method post">POST</span>
							<code>/auth/logout</code>
						</div>
						<p><strong>Zweck:</strong> Benutzer-Abmeldung (Cookie löschen)</p>
						<p><strong>Authentifizierung:</strong> Nicht erforderlich</p>
						<p><strong>Response:</strong></p>
						<div className="code-block">
							<pre>{`{
  "message": "Logged out successfully"
}`}</pre>
						</div>
					</div>

					<div className="endpoint-card">
						<div className="endpoint-header">
							<span className="method get">GET</span>
							<code>/auth/me</code>
						</div>
						<p><strong>Zweck:</strong> Aktuelle Benutzerinformationen abrufen</p>
						<p><strong>Authentifizierung:</strong> ✅ Erforderlich (JWT-Cookie)</p>
						<p><strong>Response:</strong></p>
						<div className="code-block">
							<pre>{`{
  "user": {
    "username": "developer",
    "permissions": ["api.increment", "api.read", "api.write"]
  }
}`}</pre>
						</div>
					</div>

					<div className="endpoint-card">
						<div className="endpoint-header">
							<span className="method post">POST</span>
							<code>/api/increment</code>
						</div>
						<p><strong>Zweck:</strong> Zahl um 1 erhöhen</p>
						<p><strong>Authentifizierung:</strong> ✅ Erforderlich</p>
						<p><strong>Berechtigung:</strong> <code>api.increment</code></p>
						<p><strong>Request Body:</strong></p>
						<div className="code-block">
							<pre>{`{
  "number": 5
}`}</pre>
						</div>
						<p><strong>Response:</strong></p>
						<div className="code-block">
							<pre>{`{
  "result": 6,
  "timestamp": "2026-01-10T14:30:00.000Z"
}`}</pre>
						</div>
					</div>

					<div className="endpoint-card">
						<div className="endpoint-header">
							<span className="method get">GET</span>
							<code>/api/test</code>
						</div>
						<p><strong>Zweck:</strong> Test-Endpunkt ohne Authentifizierung</p>
						<p><strong>Authentifizierung:</strong> Nicht erforderlich</p>
						<p><strong>Response:</strong></p>
						<div className="code-block">
							<pre>{`{
  "message": "API is working!"
}`}</pre>
						</div>
					</div>
				</section>

				<section className="docs-section">
					<h2>🔐 Authentifizierung & Login</h2>
					<p>
						Das Projekt verwendet <strong>JWT (JSON Web Tokens)</strong> für die Authentifizierung. 
						Der Ablauf funktioniert wie folgt:
					</p>
					
					<div className="step-list">
						<div className="step">
							<div className="step-number">1</div>
							<div className="step-content">
								<h4>Benutzer gibt Anmeldedaten ein</h4>
								<p>Auf der Login-Seite (<code>/login</code>) gibt der Benutzer Username und Passwort ein.</p>
							</div>
						</div>

						<div className="step">
							<div className="step-number">2</div>
							<div className="step-content">
								<h4>Credentials werden an Server gesendet</h4>
								<p>Die Login-Komponente sendet eine POST-Anfrage an <code>/auth/login</code>.</p>
							</div>
						</div>

						<div className="step">
							<div className="step-number">3</div>
							<div className="step-content">
								<h4>Server validiert und erstellt JWT</h4>
								<p>Der Server prüft die Credentials (aktuell statischer Dev-User) und generiert einen JWT-Token mit Benutzerinformationen und Berechtigungen.</p>
							</div>
						</div>

						<div className="step">
							<div className="step-number">4</div>
							<div className="step-content">
								<h4>Token wird als httpOnly Cookie gespeichert</h4>
								<p>Der JWT wird in einem sicheren Cookie gespeichert, das JavaScript nicht lesen kann (XSS-Schutz).</p>
							</div>
						</div>

						<div className="step">
							<div className="step-number">5</div>
							<div className="step-content">
								<h4>Client-Status wird aktualisiert</h4>
								<p>Der Client speichert die Benutzerinformationen im React-State und zeigt den Benutzernamen an.</p>
							</div>
						</div>

						<div className="step">
							<div className="step-number">6</div>
							<div className="step-content">
								<h4>Folgende API-Anfragen enthalten Cookie</h4>
								<p>Alle weiteren Anfragen senden automatisch das Cookie mit. Der Server validiert das Token bei jeder geschützten Route.</p>
							</div>
						</div>
					</div>

					<div className="info-box">
						<strong>Entwicklungs-Credentials:</strong>
						<ul>
							<li>Username: <code>developer</code></li>
							<li>Password: <code>dev123</code></li>
							<li>Berechtigungen: <code>api.increment</code>, <code>api.read</code>, <code>api.write</code></li>
						</ul>
					</div>
				</section>

				<section className="docs-section">
					<h2>🎨 Conditional Rendering</h2>
					<p>
						<strong>Conditional Rendering</strong> bedeutet, dass UI-Elemente nur unter bestimmten Bedingungen angezeigt werden.
					</p>

					<h3>Beispiele im Projekt:</h3>

					<div className="example-card">
						<h4>1. Login-Button (App.jsx)</h4>
						<div className="code-block">
							<pre>{`{!user && <Button text="Login →" to="/login" />}`}</pre>
						</div>
						<p>➡️ Der Login-Button wird nur angezeigt, wenn kein Benutzer eingeloggt ist.</p>
					</div>

					<div className="example-card">
						<h4>2. Benutzer-Info (App.jsx)</h4>
						<div className="code-block">
							<pre>{`{user ? (
  <div className="user-info">
    <span>👤 {user.username}</span>
    <button onClick={handleLogout}>Logout</button>
  </div>
) : (
  <div className="guest-info">
    <span>🔒 Not logged in</span>
  </div>
)}`}</pre>
						</div>
						<p>➡️ Zeigt entweder Benutzername + Logout-Button oder "Not logged in" an.</p>
					</div>

					<div className="example-card">
						<h4>3. API-Funktionen (HelloWorld.jsx)</h4>
						<div className="code-block">
							<pre>{`const hasPermission = user && 
  user.permissions && 
  user.permissions.includes('api.increment');

{hasPermission && (
  <div className="api-test">
    {/* Increment-Funktion */}
  </div>
)}`}</pre>
						</div>
						<p>➡️ Die Increment-Funktion wird nur angezeigt, wenn der Benutzer die Berechtigung <code>api.increment</code> hat.</p>
					</div>

					<div className="example-card">
						<h4>4. Login-Aufforderung (HelloWorld.jsx)</h4>
						<div className="code-block">
							<pre>{`{!user && (
  <div className="login-prompt">
    <p>Please login to test API endpoints</p>
  </div>
)}`}</pre>
						</div>
						<p>➡️ Zeigt eine Login-Aufforderung, wenn kein Benutzer eingeloggt ist.</p>
					</div>
				</section>

				<section className="docs-section">
					<h2>📊 Logging-System</h2>
					<p>
						Das Projekt hat ein umfassendes Logging-System mit Icons, Farben und Zeitstempeln.
					</p>

					<div className="info-card">
						<h3>Log-Level</h3>
						<ul>
							<li>🐛 <code>debug</code> - Detaillierte Debugging-Informationen</li>
							<li>ℹ️ <code>info</code> - Allgemeine Informationen</li>
							<li>✅ <code>success</code> - Erfolgreiche Operationen</li>
							<li>⚠️ <code>warn</code> - Warnungen</li>
							<li>❌ <code>error</code> - Fehler</li>
							<li>💀 <code>fatal</code> - Kritische Fehler</li>
						</ul>
					</div>

					<div className="info-card">
						<h3>Verwendung</h3>
						<p><strong>Client (Browser Console):</strong></p>
						<div className="code-block">
							<pre>{`import { logger } from '../utils/logger.js';

logger.component('Button', 'Button clicked');
logger.auth('Login', 'User logged in');
logger.api('GET', '/api/test', 200, 45);`}</pre>
						</div>

						<p><strong>Server (Terminal):</strong></p>
						<div className="code-block">
							<pre>{`import { logger } from './utils/logger.js';

logger.http('GET', '/api/test', 200, 45);
logger.auth('Login', 'User authenticated');
logger.error('API', 'Request failed', { error });`}</pre>
						</div>
					</div>

					<div className="info-box">
						<strong>Log-Level-Steuerung:</strong>
						<ul>
							<li>Server: <code>LOG_LEVEL_SERVER</code> in .env-Datei</li>
							<li>Client: <code>VITE_LOG_LEVEL_CLIENT</code> in .env-Datei</li>
							<li>Entwicklung: <code>debug</code> (alle Logs)</li>
							<li>Produktion: <code>error</code> (nur Fehler)</li>
						</ul>
					</div>
				</section>

				<section className="docs-section">
					<h2>� Dateibasiertes Logging</h2>
					<p>
						Neben Console-Logging werden alle Logs auch in Dateien gespeichert für spätere Analyse und Debugging.
					</p>

					<div className="info-card">
						<h3>Log-Datei-Speicherorte</h3>
						<ul>
							<li>📂 <strong>Server-Logs:</strong> <code>logs/server/server-YYYY-MM-DD.log</code></li>
							<li>📂 <strong>Client-Logs:</strong> <code>logs/client/client-YYYY-MM-DD.log</code></li>
						</ul>
						<p>Logs werden täglich in separate Dateien geschrieben (automatisch nach Datum benannt).</p>
					</div>

					<div className="info-card">
						<h3>Log-Rotation & Cleanup</h3>
						<ul>
							<li>📏 <strong>Max. Dateigröße:</strong> 100 MB pro Log-Datei</li>
							<li>🔄 <strong>Automatische Rotation:</strong> Wenn eine Datei 100 MB erreicht, wird sie umbenannt (Zeitstempel angehängt) und eine neue Datei erstellt</li>
							<li>🗑️ <strong>Auto-Delete:</strong> Dateien älter als 30 Tage werden automatisch gelöscht</li>
							<li>📊 <strong>Max. Anzahl:</strong> Maximal 10 Log-Dateien werden behalten (älteste werden gelöscht)</li>
							<li>🔤 <strong>Encoding:</strong> UTF-8 (unterstützt alle Zeichen inkl. Umlaute, Emojis)</li>
						</ul>
					</div>

					<div className="info-card">
						<h3>Log Viewer Tool</h3>
						<p>Auf der <strong>Log Viewer</strong>-Seite (<code>/log-viewer</code>) können alle Logs in Echtzeit angesehen werden:</p>
						<ul>
							<li>📜 Liste aller Server- und Client-Log-Dateien</li>
							<li>📊 Dateigröße und letzte Änderungszeit</li>
							<li>🔍 Vollständiger Dateiinhalt mit Syntax-Highlighting</li>
							<li>🔄 Auto-Refresh (1s, 2s, 5s, 10s konfigurierbar)</li>
							<li>⬇️ Auto-Scroll zum Ende (immer neueste Logs sehen)</li>
						</ul>
					</div>

					<div className="example-card">
						<h4>Log-Datei-Format</h4>
						<div className="code-block">
							<pre>{`[2026-01-10T14:37:15.728Z] ✅ [SUCCESS] [Server] Environment loaded: development
[2026-01-10T14:37:15.738Z] ✅ [SUCCESS] [Server] 🚀 Server running on http://localhost:5000
[2026-01-10T14:37:16.367Z] ✅ [SUCCESS] [HTTP] POST /client 200 - 5ms
[2026-01-10T14:37:16.427Z] ⚠️ [WARN] [AuthController] Attempted to get user info without token`}</pre>
						</div>
					</div>

					<div className="info-box">
						<strong>Konfiguration:</strong>
						<p>Die Log-Einstellungen können in <code>server/utils/logger.js</code> und <code>server/routes/logs.js</code> angepasst werden:</p>
						<ul>
							<li><code>maxFileSize</code> - Maximale Dateigröße (Standard: 100 MB)</li>
							<li><code>maxFiles</code> - Maximale Anzahl Dateien (Standard: 10)</li>
							<li><code>maxAge</code> - Maximales Alter in Tagen (Standard: 30)</li>
						</ul>
					</div>
				</section>

				<section className="docs-section">
					<h2>�🚀 Neues Projekt erstellen</h2>
					
					<div className="step-list">
						<div className="step">
							<div className="step-number">1</div>
							<div className="step-content">
								<h4>Verzeichnis erstellen</h4>
								<div className="code-block">
									<pre>{`mkdir mein-neues-projekt
cd mein-neues-projekt`}</pre>
								</div>
							</div>
						</div>

						<div className="step">
							<div className="step-number">2</div>
							<div className="step-content">
								<h4>Vite + React initialisieren</h4>
								<div className="code-block">
									<pre>{`npm create vite@latest . -- --template react
npm install`}</pre>
								</div>
								<p>➡️ Erstellt ein React-Projekt mit Vite im aktuellen Verzeichnis</p>
							</div>
						</div>

						<div className="step">
							<div className="step-number">3</div>
							<div className="step-content">
								<h4>Git-Repository initialisieren</h4>
								<div className="code-block">
									<pre>{`git init
git config user.name "DeinName"
git config user.email "deine@email.com"`}</pre>
								</div>
							</div>
						</div>

						<div className="step">
							<div className="step-number">4</div>
							<div className="step-content">
								<h4>GitHub-Repository erstellen (optional)</h4>
								<div className="code-block">
									<pre>{`gh auth login
gh repo create mein-neues-projekt --public --source=. --remote=origin`}</pre>
								</div>
								<p>➡️ Erstellt automatisch ein GitHub-Repository und verbindet es</p>
							</div>
						</div>

						<div className="step">
							<div className="step-number">5</div>
							<div className="step-content">
								<h4>Abhängigkeiten installieren</h4>
								<div className="code-block">
									<pre>{`npm install react-router-dom express cors jsonwebtoken cookie-parser dotenv concurrently`}</pre>
								</div>
							</div>
						</div>

						<div className="step">
							<div className="step-number">6</div>
							<div className="step-content">
								<h4>Projektstruktur erstellen</h4>
								<p>Erstelle Ordner für <code>server/</code>, <code>src/components/</code>, <code>src/pages/</code>, etc.</p>
							</div>
						</div>

						<div className="step">
							<div className="step-number">7</div>
							<div className="step-content">
								<h4>Erster Commit</h4>
								<div className="code-block">
									<pre>{`git add .
git commit -m "chore: initial project setup"
git push -u origin master`}</pre>
								</div>
							</div>
						</div>
					</div>

					<div className="info-box">
						<strong>Was passiert beim Erstellen?</strong>
						<ul>
							<li>✅ Vite erstellt eine optimierte Entwicklungsumgebung</li>
							<li>✅ React 19 wird als Haupt-UI-Library installiert</li>
							<li>✅ Git-Repository wird initialisiert (lokale Versionskontrolle)</li>
							<li>✅ GitHub CLI erstellt Remote-Repository (online sichtbar)</li>
							<li>✅ package.json wird mit Projekt-Metadaten erstellt</li>
							<li>✅ node_modules/ Ordner enthält alle Abhängigkeiten</li>
							<li>✅ Entwicklungsserver startet auf Port 5173</li>
						</ul>
					</div>
				</section>

				<section className="docs-section">
					<h2>🌍 Umgebungsverwaltung</h2>
					<p>
						Das Projekt erkennt automatisch die Betriebssystem-Plattform und lädt die entsprechende .env-Datei:
					</p>

					<div className="env-table">
						<div className="env-row header">
							<div>Betriebssystem</div>
							<div>Datei</div>
							<div>Umgebung</div>
							<div>Log-Level</div>
						</div>
						<div className="env-row">
							<div>Windows</div>
							<div><code>.env.development</code></div>
							<div>Development</div>
							<div>debug</div>
						</div>
						<div className="env-row">
							<div>macOS</div>
							<div><code>.env.testing</code></div>
							<div>Testing</div>
							<div>debug</div>
						</div>
						<div className="env-row">
							<div>Linux</div>
							<div><code>.env.production</code></div>
							<div>Production</div>
							<div>error</div>
						</div>
					</div>

					<p><strong>Automatische Erkennung in:</strong> <code>server/config/env-loader.js</code></p>
				</section>

				<section className="docs-section">
					<h2>📦 Semantic Versioning</h2>
					<p>Das Projekt verwendet <strong>X.Y.Z Versionierung:</strong></p>

					<div className="version-card">
						<div className="version-part">
							<div className="version-number">X</div>
							<div className="version-info">
								<h4>Major Version</h4>
								<p>Breaking Changes, große neue Features</p>
								<p className="example">1.5.3 → 2.0.0</p>
							</div>
						</div>

						<div className="version-part">
							<div className="version-number">Y</div>
							<div className="version-info">
								<h4>Minor Version</h4>
								<p>Neue Features, Verbesserungen (abwärtskompatibel)</p>
								<p className="example">1.5.3 → 1.6.0</p>
							</div>
						</div>

						<div className="version-part">
							<div className="version-number">Z</div>
							<div className="version-info">
								<h4>Patch Version</h4>
								<p>Bugfixes, kleine Updates</p>
								<p className="example">1.5.3 → 1.5.4</p>
							</div>
						</div>
					</div>

					<p><strong>Aktuelle Version:</strong> <code>0.2.1</code></p>
				</section>

				<button className="back-button" onClick={() => navigate('/')}>
					← Zurück zur Startseite
				</button>
			</div>
		</div>
	);
}

export default Documentation;
