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
// ✅ All imports present: useState, useMemo, useCallback, useRef, useEffect
import { useServices } from '../hooks/useServices'
import './Services.css'

/**
 * Spiral math constants
 * Services positioned along tight spiral arms, perfectly centered with galaxy
 *
 * The spiral is tuned so services appear AS PART OF the galaxy,
 * not scattered outside it. All services stay within ~180px of center.
 *
 * Formula: r = baseRadius + (theta / maxTheta) * maxRadialDistance
 */
const SPIRAL_CONFIG = {
  baseRadius: 70,          // Start this far from center (60-80px is sweet spot)
  maxRadialDistance: 100,  // Grow outward by this much across full rotation
  maxTheta: 8 * Math.PI
}

/**
 * Calculate position on spiral given theta and rotation angle
 *
 * Positions services along logarithmic spiral arms.
 * All services stay within 160-170px from center to integrate with galaxy.
 */
function getSpirralPosition(theta, rotation, centerX, centerY) {
  // Linear radial growth: keeps spiral tight and centered
  const r = SPIRAL_CONFIG.baseRadius + (theta / SPIRAL_CONFIG.maxTheta) * SPIRAL_CONFIG.maxRadialDistance
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
 *
 * Position updates come from animation loop via direct DOM manipulation,
 * NOT from React props. This keeps animation decoupled from React rendering.
 */
function ServicePlanet({
  service,
  isSelected,
  onSelect,
  planetRef
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
      ref={planetRef}
      className={`service-planet ${service.status} ${isSelected ? 'selected' : ''}`}
      style={{
        left: '0px',
        top: '0px',
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
  const rotationRef = useRef(0)
  const animationIdRef = useRef(null)
  const selectedServiceRef = useRef(null)
  const servicesRef = useRef([])
  const planetsRef = useRef({})  // Maps service.id → DOM element ref

  const {
    services,
    selectedService,
    selectService,
    clearSelection,
    updateService,
    getDependencies,
    getDependents
  } = useServices()

  // Keep services ref in sync
  React.useEffect(() => {
    servicesRef.current = services
  }, [services])

  // Track selected service in ref (so animation loop doesn't restart)
  React.useEffect(() => {
    selectedServiceRef.current = selectedService
  }, [selectedService])

  // Smooth animation loop - runs once at mount, never stops
  // Pauses rotation when detail panel is open, resumes when closed
  // ⚠️  CRITICAL: No state updates! Only direct DOM manipulation.
  useEffect(() => {
    const animate = () => {
      // Only animate if no service is selected (detail panel is closed)
      if (!selectedServiceRef.current) {
        // Very slow rotation (synchronized with galaxy particle movement)
        // Rotation speed tuned to match GalaxyJS animation
        rotationRef.current += 0.0005
      }

      // Calculate center directly from container (no state = no re-renders)
      if (containerRef.current && servicesRef.current.length > 0) {
        const centerX = containerRef.current.offsetWidth / 2
        const centerY = containerRef.current.offsetHeight / 2

        // Only proceed if center coordinates are valid
        if (centerX > 0 && centerY > 0) {
          servicesRef.current.forEach(service => {
            const planetElement = planetsRef.current[service.id]

            // Only update if element exists and hasn't been removed
            if (planetElement && planetElement.isConnected) {
              // Use exact theta position - no jitter (eliminates shaking)
              const theta = service.position.theta
              const pos = getSpirralPosition(theta, rotationRef.current, centerX, centerY)

              // Direct DOM update - NO React render triggered
              planetElement.style.left = `${pos.x}px`
              planetElement.style.top = `${pos.y}px`
            }
          })
        }
      }

      // Continue animation loop (NEVER stops)
      animationIdRef.current = requestAnimationFrame(animate)
    }

    // Start the animation once on mount
    animationIdRef.current = requestAnimationFrame(animate)

    // Cleanup only on unmount
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
    }
  }, []) // NO dependencies - animation runs once and continues forever

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

  // Callback to store planet element refs
  // Called when each ServicePlanet mounts
  const setPlanetRef = useCallback((serviceId, element) => {
    if (element) {
      planetsRef.current[serviceId] = element
    } else {
      delete planetsRef.current[serviceId]
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="services-container"
      onClick={handleContainerClick}
    >
      {/* Render all service planets */}
      {/* Position updates come from animation loop, not React props */}
      {services.map(service => (
        <ServicePlanet
          key={service.id}
          service={service}
          isSelected={selectedService?.id === service.id}
          onSelect={selectService}
          planetRef={(el) => setPlanetRef(service.id, el)}
        />
      ))}

      {/* Service Detail Panel */}
      {selectedService && (
        <ServiceDetailPanel
          service={selectedService}
          dependencies={selectedDependencies}
          dependents={selectedDependents}
          onClose={clearSelection}
          onUpdateService={updateService}
        />
      )}
    </div>
  )
}

/**
 * Service Detail Panel Component
 *
 * Displays service info and pipeline data.
 * Supports edit mode for mock pipeline experimentation (Level 1).
 */
function ServiceDetailPanel({ service, dependencies, dependents, onClose, onUpdateService }) {
  const [isEditMode, setIsEditMode] = React.useState(false)
  const [editData, setEditData] = React.useState(null)

  // Initialize edit data from service
  const initEditMode = () => {
    setEditData({
      branch: service.pipeline?.latestRun?.branch || 'main',
      status: service.pipeline?.latestRun?.status || 'passed',
      commitMessage: service.pipeline?.lastCommit?.message || '',
      stages: service.pipeline?.latestRun?.stages
        ? { ...service.pipeline.latestRun.stages }
        : { build: { status: 'passed', duration: 300 }, test: { status: 'passed', duration: 600 }, deploy: { status: 'passed', duration: 300 } }
    })
    setIsEditMode(true)
  }

  const cancelEdit = () => {
    setEditData(null)
    setIsEditMode(false)
  }

  const saveEdit = () => {
    // Update service with edited pipeline data
    const updatedService = {
      ...service,
      pipeline: {
        ...service.pipeline,
        latestRun: {
          ...service.pipeline.latestRun,
          branch: editData.branch,
          status: editData.status,
          stages: editData.stages
        },
        lastCommit: {
          ...service.pipeline.lastCommit,
          message: editData.commitMessage
        }
      },
      // Update service status based on pipeline result
      status: editData.status === 'failed' ? 'red' : editData.status === 'running' ? 'orange' : 'green',
      lastUpdate: new Date().toISOString()
    }

    onUpdateService(service.id, updatedService)
    setEditData(null)
    setIsEditMode(false)
  }

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
        <div className="detail-actions">
          {!isEditMode && (
            <button className="btn-edit" onClick={initEditMode} title="Edit pipeline data">
              ✎ Edit
            </button>
          )}
          <button className="close-button" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>
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
            <h3>Latest Pipeline {isEditMode && <span className="edit-badge">Editing</span>}</h3>

            {isEditMode ? (
              <div className="edit-mode">
                <div className="form-group">
                  <label>Pipeline Result</label>
                  <select
                    value={editData.status}
                    onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                  >
                    <option value="passed">✓ Passed</option>
                    <option value="running">⏳ Running</option>
                    <option value="failed">✕ Failed</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Branch</label>
                  <input
                    type="text"
                    value={editData.branch}
                    onChange={(e) => setEditData({ ...editData, branch: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Stages</label>
                  {Object.entries(editData.stages).map(([stageName, stageData]) => (
                    <div key={stageName} className="stage-edit">
                      <span className="stage-name">{stageName.charAt(0).toUpperCase() + stageName.slice(1)}</span>
                      <select
                        value={stageData.status}
                        onChange={(e) => {
                          const updatedStages = { ...editData.stages }
                          updatedStages[stageName].status = e.target.value
                          setEditData({ ...editData, stages: updatedStages })
                        }}
                      >
                        <option value="passed">✓ Passed</option>
                        <option value="failed">✕ Failed</option>
                        <option value="running">⏳ Running</option>
                        <option value="skipped">⊘ Skipped</option>
                      </select>
                      <div className="duration-input">
                        <input
                          type="number"
                          min="0"
                          value={stageData.duration}
                          onChange={(e) => {
                            const updatedStages = { ...editData.stages }
                            updatedStages[stageName].duration = parseInt(e.target.value)
                            setEditData({ ...editData, stages: updatedStages })
                          }}
                        />
                        <span>seconds</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="edit-actions">
                  <button className="btn-save" onClick={saveEdit}>Save Changes</button>
                  <button className="btn-cancel" onClick={cancelEdit}>Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <div className="detail-row">
                  <span className="label">Run:</span>
                  <span className="value">#{latestRun.number}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Branch:</span>
                  <span className="value">{latestRun.branch}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Status:</span>
                  <span className="value">{latestRun.status.charAt(0).toUpperCase() + latestRun.status.slice(1)}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Triggered by:</span>
                  <span className="value">{latestRun.triggeredBy}</span>
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
              </>
            )}
          </section>
        )}

        {/* Last Commit Section */}
        {lastCommit && !isEditMode && (
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

        {/* Commit Message Edit Section (in edit mode) */}
        {isEditMode && editData && (
          <section className="detail-section">
            <h3>Commit Message</h3>
            <div className="form-group">
              <label>Message</label>
              <textarea
                value={editData.commitMessage}
                onChange={(e) => setEditData({ ...editData, commitMessage: e.target.value })}
                rows="3"
              />
            </div>
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
