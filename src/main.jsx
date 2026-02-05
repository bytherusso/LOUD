import React from 'react'
import ReactDOM from 'react-dom/client'
// CAMBIO AQUÍ: Usamos HashRouter en lugar de BrowserRouter
import { HashRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>,
)