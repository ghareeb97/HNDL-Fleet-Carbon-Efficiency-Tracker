import React from 'react'
import ReactDOM from 'react-dom/client'
import FleetCarbonTracker from './FleetCarbonTracker.tsx'
import './storage'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <FleetCarbonTracker />
  </React.StrictMode>,
)
