/**
 * Services Component
 *
 * Renders interactive service planets that rotate WITH the galaxy.
 * Uses its own animation loop for smooth, synchronized movement.
 *
 * Architecture:
 * - Services maintains its own animation state
 * - Calculates positions in animation loop (not React state)
 * - Updates DOM directly for smooth 60fps movement
 * - Stays perfectly synchronized with GalaxyJS
 */

import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { useServices } from '../hooks/useServices'
import './Services.css'

/**
 * Spiral math constants
 * Must match GalaxyJS spiral parameters
 */
const SPIRAL_CONFIG = {
  a: 50,            // Inner radius
  b: 80,            // Spacing between arms
  maxTheta: 8 * Math.PI
}

/**
 * Calculate position on spiral given theta and rotation angle
 */
function getSpirralPosition(theta, rotation, centerX, centerY) {
  const r = SPIRAL_CONFIG.a + SPIRAL_CONFIG.b * (theta / SPIRAL_CONFIG.maxTheta) * 10
  const angle = theta + rotation

  return {
    x: centerX + r * Math.cos(angle),
    y: centerY + r * Math.sin(angle),
    r: r,
    angle: angle
  }
}

/**
 * Single Service Planet Component
 */
function ServicePlanet({
  service,
  position,
  isSelected,
  onSelect
}) {
  const statusColor = {
    green: '#10b981',
    orange: '#f59e0b',
    red: '#ef4444'
  }[service.status] || '#64748b'

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
        left: `${position.x}px`,
        top: `${position.y}px`,
        '--status-color': statusColor
      }}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="button"
      tabIndex={0}
      aria-label={`${service.name} - Status: ${service.status}`}
    >
      <div className="planet-glow" />
      <div className="planet-circle" />
      <div className="planet-icon" />
      <div className="planet-label">{service.name}</div>
    </div>
  )
}

/**
 * Services Container Component
 *
 * Manages service planets with smooth animation synchronized to galaxy
 */
export default function Services() {
  const containerRef = React.useRef(null)
  const [containerDims, setContainerDims] = React.useState({ width: 0, height: 0 })
  const rotationRef = useRef(0)
  const animationIdRef = useRef(null)
  const [planetPositions, setPlanetPositions] = React.useState({})

  const {
    services,
    selectedService,
    selectService,
    clearSelection,
    getDependencies,
    getDependents
  } = useServices()

  // Get center coordinates
  const centerX = containerDims.width / 2
  const centerY = containerDims.height / 2

  // Update container dimensions
  React.useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setContainerDims({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        })
      }
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  // Smooth animation loop - synchronized with GalaxyJS
  useEffect(() => {
    if (services.length === 0 || centerX === 0 || centerY === 0) return

    const animate = () => {
      // Increment rotation to match GalaxyJS speed
      rotationRef.current += 0.005

      // Calculate all planet positions
      const newPositions = {}
      services.forEach(service => {
        const theta = service.position.theta
        const pos = getSpirralPosition(theta, rotationRef.current, centerX, centerY)
        newPositions[service.id] = {
          x: pos.x,
          y: pos.y,
          r: pos.r,
          angle: pos.angle
        }
      })

      // Update state with new positions
      setPlanetPositions(newPositions)

      // Continue animation loop
      animationIdRef.current = requestAnimationFrame(animate)
    }

    // Start the animation
    animationIdRef.current = requestAnimationFrame(animate)

    // Cleanup
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
    }
  }, [services, centerX, centerY])

  // Get dependencies
  const selectedDependencies = React.useMemo(() => {
    if (!selectedService) return []
    return getDependencies(selectedService.id)
  }, [selectedService, getDependencies])

  const selectedDependents = React.useMemo(() => {
    if (!selectedService) return []
    return getDependents(selectedService.id)
  }, [selectedService, getDependents])

  // Handle clicking outside
  const handleContainerClick = (e) => {
    if (e.target === e.currentTarget) {
      clearSelection()
    }
  }

  return (
    <div
      ref={containerRef}
      className="services-container"
      onClick={handleContainerClick}
    >
      {/* Render all service planets */}
      {services.map(service => (
        <ServicePlanet
          key={service.id}
          service={service}
          position={planetPositions[service.id] || { x: 0, y: 0 }}
          isSelected={selectedService?.id === service.id}
          onSelect={selectService}
        />
      ))}

      {/* Service Detail Panel */}
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
