import React, { useState, FC } from 'react'
import Galaxy from './components/Galaxy'
import Services from './components/Services/Services'
import AddServiceModal from './components/AddServiceModal'
import { useServices, useServiceStats } from './hooks/useServices'
import type { NewServiceInput } from './types'
import './App.css'

/**
 * App - Main application component
 *
 * Manages:
 * - Global service state (via useServices hook)
 * - Add service modal state
 * - Service stats calculation
 * - Main layout and header/footer
 */
const App: FC = () => {
  const {
    services,
    loading,
    error,
    addService,
    selectedService,
    selectService,
    clearSelection,
    updateService,
    getDependencies,
    getDependents
  } = useServices()
  const stats = useServiceStats(services)
  const [isAddServiceModalOpen, setIsAddServiceModalOpen] = useState<boolean>(false)

  /**
   * Handle adding a new service from the modal
   */
  const handleAddService = (newService: NewServiceInput): void => {
    addService(newService)
    setIsAddServiceModalOpen(false)
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
            <>
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

              <button
                className="btn-add-service"
                onClick={() => setIsAddServiceModalOpen(true)}
                title="Create a new mock service"
              >
                + Add Service
              </button>
            </>
          )}
        </div>
      </header>

      <main className="main">
        <Galaxy />
        {!loading && !error && (
          <Services
            services={services}
            selectedService={selectedService}
            selectService={selectService}
            clearSelection={clearSelection}
            updateService={updateService}
            getDependencies={getDependencies}
            getDependents={getDependents}
          />
        )}
        {loading && <div className="loading">Loading services...</div>}
        {error && <div className="error">Error loading services: {error}</div>}
      </main>

      <footer className="footer">
        <p>Level 1: Mock Data | Powered by GalaxyJS</p>
      </footer>

      <AddServiceModal
        isOpen={isAddServiceModalOpen}
        onClose={() => setIsAddServiceModalOpen(false)}
        onAddService={handleAddService}
      />
    </div>
  )
}

export default App
