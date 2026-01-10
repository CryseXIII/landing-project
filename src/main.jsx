import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './styles/theme.css'
import './index.css'
import App from './App.jsx'
import HelloWorld from './pages/HelloWorld.jsx'
import ApiDocs from './pages/ApiDocs.jsx'

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<App />} />
				<Route path="/hello" element={<HelloWorld />} />
				<Route path="/api-docs" element={<ApiDocs />} />
			</Routes>
		</BrowserRouter>
	</StrictMode>,
)
