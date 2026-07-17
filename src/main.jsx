import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import '@/index.css'

const root = document.getElementById('root')
// Remove the static crawler fallback text before React takes over
root.replaceChildren()

ReactDOM.createRoot(root).render(
  <App />
)