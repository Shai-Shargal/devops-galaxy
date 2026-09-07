/**
 * ServicePlanet Component
 *
 * A single service represented as a small colored dot (planet).
 * Displays the service status visually and responds to user interactions.
 *
 * Position is managed by the parent Services component.
 * This component only handles rendering and user events.
 */

import React from 'react'

/**
 * Status to color mapping
 */
const STATUS_COLORS = {
  green: '#10b981',   // Healthy
  orange: '#f59e0b',  // Running
  red: '#ef4444'      // Failed
}

/**
 * ServicePlanet - Individual service dot in the galaxy
 *
 * @param {object} props
 * @param {object} props.service - Service data object
 * @param {boolean} props.isSelected - Whether this service is currently selected
 * @param {function} props.onSelect - Callback when service is clicked
 * @param {React.Ref} props.planetRef - Ref for DOM element (used by animation loop)
 */
function ServicePlanet({ service, isSelected, onSelect, planetRef }) {
  const statusColor = STATUS_COLORS[service.status] || '#64748b'

  React.useEffect(() => {
    console.log(`🪐 ServicePlanet rendered: ${service.name} (${service.id})`)
  }, [service.id, service.name])

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

export default ServicePlanet
