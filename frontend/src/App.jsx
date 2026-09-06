import React, { useState } from 'react'
import Galaxy from './components/Galaxy'
import Services from './components/Services'
import { useServices, useServiceStats } from './hooks/useServices'
import './App.css'

export default function App() {
  const [rotation, setRotation] = useState(0)
  const { services, loading, error } = useServices()
  const stats = useServiceStats(services)

  const handleRotationUpdate = (newRotation) => {
    setRotation(newRotation)
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="header-title">
            <h1>DevOps Galaxy</h1>
            <p>Interactive DevOps Pipeline Visualization</p>
          </div>

          {!loading && !error && (
            <div className="header-stats">
              <div className="stat-item green">
                <span className="stat-count">{stats.healthy}</span>
                <span className="stat-label">Healthy</span>
              </div>
              <div className="stat-item orange">
                <span className="stat-count">{stats.running}</span>
                <span className="stat-label">Running</span>
              </div>
              <div className="stat-item red">
                <span className="stat-count">{stats.failed}</span>
                <span className="stat-label">Failed</span>
              </div>
              <div className="stat-item">
                <span className="stat-count">{stats.total}</span>
                <span className="stat-label">Total</span>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="main">
        <Galaxy onRotationUpdate={handleRotationUpdate} />
        {!loading && !error && <Services rotation={rotation} />}
        {loading && <div className="loading">Loading services...</div>}
        {error && <div className="error">Error loading services: {error}</div>}
      </main>

      <footer className="footer">
        <p>Level 1: Mock Data | Powered by GalaxyJS</p>
      </footer>
    </div>
  )
}
