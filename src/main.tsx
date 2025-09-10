import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './app'
import './styles/tailwind.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<BrowserRouter
			basename={
				(import.meta as unknown as { env: { BASE_URL: string } }).env.BASE_URL
			}
		>
			<App />
		</BrowserRouter>
	</React.StrictMode>,
)
