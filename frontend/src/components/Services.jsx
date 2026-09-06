/**
 * Services Component
 *
 * Renders interactive service planets on the galaxy.
 * Planets are application-controlled elements overlaid on the GalaxyJS visualization.
 *
 * Architecture:
 * - Galaxy remains pure visualization (background)
 * - Services are application state (React components)
 * - Can be rendered with any visualization backend
 */

import React, { useMemo } from 'react'
import { useServices } from '../hooks/useServices'
import './Services.css'

/**
 * Single Service Planet Component
 */
function ServicePlanet({ service, isSelected, onSelect }) {
  const statusColor = {
    green: '#10b981',   // Emerald
    orange: '#f59e0b',  // Amber
    red: '#ef4444'      // Red
  }[service.status] || '#64748b' // Gray for unknown

  const handleClick = (e) => {
    e.stopPropagation()
    onSelect(service.id)
  }

  const handleMouseEnter = (e) => {
    e.currentTarget.classList.add('hovered')
  }

  const handleMouseLeave = (e) => {
    e.currentTarget.classList.remove('hovered')
  }

  return (
    <div
      className={`service-planet ${service.status} ${isSelected ? 'selected' : ''}`}
      style={{
        left: `${service.position.x}px`,
        top: `${service.position.y}px`,
        '--status-color': statusColor
      }}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="button"
      tabIndex={0}
      aria-label={`${service.name} - Status: ${service.status}`}
    >
      {/* Glow effect */}
      <div className="planet-glow" />

      {/* Main circle */}
      <div className="planet-circle" />

      {/* Status indicator icon */}
      <div className="planet-icon">
        {service.status === 'green' && '✓'}
        {service.status === 'orange' && '⏳'}
        {service.status === 'red' && '✕'}
      </div>

      {/* Service name label */}
      <div className="planet-label">{service.name}</div>
    </div>
  )
}

/**
 * Services Container Component
 *
 * Manages all service planets and their interactions
 */
export default function Services() {
  const {
    services,
    selectedService,
    selectService,
    clearSelection,
    getDependencies,
    getDependents
  } = useServices()

  // Get dependencies and dependents for the selected service
  const selectedDependencies = useMemo(() => {
    if (!selectedService) return []
    return getDependencies(selectedService.id)
  }, [selectedService, getDependencies])

  const selectedDependents = useMemo(() => {
    if (!selectedService) return []
    return getDependents(selectedService.id)
  }, [selectedService, getDependents])

  // Handle clicking outside planets to deselect
  const handleContainerClick = (e) => {
    if (e.target === e.currentTarget) {
      clearSelection()
    }
  }

  return (
    <div className="services-container" onClick={handleContainerClick}>
      {/* Render all service planets */}
      {services.map(service => (
        <ServicePlanet
          key={service.id}
          service={service}
          isSelected={selectedService?.id === service.id}
          onSelect={selectService}
        />
      ))}

      {/* Highlight dependencies when service is selected */}
      {selectedService && (
        <div className="dependency-highlight">
          {/* Services this one depends on */}
          {selectedDependencies.length > 0 && (
            <div className="depends-on">
              {selectedDependencies.map(dep => (
                <div
                  key={dep.id}
                  className="dependency-arrow"
                  style={{
                    left: `${selectedService.position.x}px`,
                    top: `${selectedService.position.y}px`,
                    '--target-x': `${dep.position.x}px`,
                    '--target-y': `${dep.position.y}px`
                  }}
                />
              ))}
            </div>
          )}

          {/* Services that depend on this one */}
          {selectedDependents.length > 0 && (
            <div className="depended-on">
              {selectedDependents.map(dependent => (
                <div
                  key={dependent.id}
                  className="dependency-arrow reverse"
                  style={{
                    left: `${dependent.position.x}px`,
                    top: `${dependent.position.y}px`,
                    '--target-x': `${selectedService.position.x}px`,
                    '--target-y': `${selectedService.position.y}px`
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Service Detail Panel (when selected) */}
      {selectedService && (
        <ServiceDetailPanel
          service={selectedService}
          dependencies={selectedDependencies}
          dependents={selectedDependents}
          onClose={clearSelection}
        />
      )}
    </div>
  )
}

/**
 * Service Detail Panel Component
 *
 * Shows detailed information about the selected service
 */
function ServiceDetailPanel({ service, dependencies, dependents, onClose }) {
  const statusText = {
    green: 'Healthy',
    orange: 'Running',
    red: 'Failed'
  }[service.status] || 'Unknown'

  const latestRun = service.pipeline?.latestRun
  const lastCommit = service.pipeline?.lastCommit

  return (
    <div className="service-detail-panel">
      <div className="detail-header">
        <div className="detail-title">
          <div className="status-badge" data-status={service.status} />
          <h2>{service.name}</h2>
        </div>
        <button className="close-button" onClick={onClose} aria-label="Close">
          ✕
        </button>
      </div>

      <div className="detail-content">
        {/* Overview Section */}
        <section className="detail-section">
          <h3>Overview</h3>
          <div className="detail-row">
            <span className="label">Status:</span>
            <span className="value">{statusText}</span>
          </div>
          <div className="detail-row">
            <span className="label">Team:</span>
            <span className="value">{service.team}</span>
          </div>
          {service.repository && (
            <div className="detail-row">
              <span className="label">Repository:</span>
              <a href={service.repository} target="_blank" rel="noopener noreferrer">
                {service.repository.split('/').pop()}
              </a>
            </div>
          )}
          {service.description && (
            <div className="detail-row">
              <span className="label">Description:</span>
              <span className="value">{service.description}</span>
            </div>
          )}
        </section>

        {/* Latest Pipeline Section */}
        {latestRun && (
          <section className="detail-section">
            <h3>Latest Pipeline</h3>
            <div className="detail-row">
              <span className="label">Run:</span>
              <span className="value">#{latestRun.number}</span>
            </div>
            <div className="detail-row">
              <span className="label">Branch:</span>
              <span className="value">{latestRun.branch}</span>
            </div>
            <div className="detail-row">
              <span className="label">Triggered by:</span>
              <span className="value">{latestRun.triggeredBy}</span>
            </div>
            <div className="detail-row">
              <span className="label">Started:</span>
              <span className="value">
                {new Date(latestRun.triggeredAt).toLocaleString()}
              </span>
            </div>

            {/* Pipeline Stages */}
            <div className="stages">
              <h4>Stages:</h4>
              {Object.entries(latestRun.stages).map(([stageName, stageData]) => (
                <div key={stageName} className="stage">
                  <span className="stage-name">{stageName.charAt(0).toUpperCase() + stageName.slice(1)}</span>
                  <span className={`stage-status ${stageData.status}`}>
                    {stageData.status === 'passed' && '✓'}
                    {stageData.status === 'failed' && '✕'}
                    {stageData.status === 'running' && '⏳'}
                    {stageData.status === 'skipped' && '⊘'}
                  </span>
                  <span className="stage-duration">({Math.round(stageData.duration / 60)}m)</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Last Commit Section */}
        {lastCommit && (
          <section className="detail-section">
            <h3>Last Commit</h3>
            <div className="detail-row">
              <span className="label">Hash:</span>
              <span className="value monospace">{lastCommit.hash.substring(0, 8)}</span>
            </div>
            <div className="detail-row">
              <span className="label">Message:</span>
              <span className="value">{lastCommit.message}</span>
            </div>
            <div className="detail-row">
              <span className="label">Author:</span>
              <span className="value">{lastCommit.author}</span>
            </div>
            {lastCommit.url && (
              <div className="detail-row">
                <a href={lastCommit.url} target="_blank" rel="noopener noreferrer">
                  View on GitHub
                </a>
              </div>
            )}
          </section>
        )}

        {/* Dependencies Section */}
        {(dependencies.length > 0 || dependents.length > 0) && (
          <section className="detail-section">
            <h3>Dependencies</h3>
            {dependencies.length > 0 && (
              <div className="dependency-list">
                <h4>Depends on:</h4>
                {dependencies.map(dep => (
                  <div key={dep.id} className="dependency-item">
                    <span className="arrow">→</span>
                    <span>{dep.name}</span>
                  </div>
                ))}
              </div>
            )}
            {dependents.length > 0 && (
              <div className="dependency-list">
                <h4>Depended on by:</h4>
                {dependents.map(dependent => (
                  <div key={dependent.id} className="dependency-item">
                    <span className="arrow">←</span>
                    <span>{dependent.name}</span>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Last Updated */}
        <div className="detail-footer">
          <small>Last updated: {new Date(service.lastUpdate).toLocaleString()}</small>
        </div>
      </div>
    </div>
  )
}
