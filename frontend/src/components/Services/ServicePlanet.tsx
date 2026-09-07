/**
 * ServicePlanet Component
 *
 * A single service represented as a small colored dot (planet).
 * Displays the service status visually and responds to user interactions.
 *
 * Position is managed by the parent Services component.
 * This component only handles rendering and user events.
 */

import React, { FC, CSSProperties } from 'react'
import type { Service } from '../../types'

/**
 * Status to color mapping
 */
const STATUS_COLORS: Record<string, string> = {
  green: '#10b981',   // Healthy
  orange: '#f59e0b',  // Running
  red: '#ef4444'      // Failed
}

/**
 * Props for ServicePlanet component
 */
interface ServicePlanetProps {
  service: Service
  isSelected: boolean
  onSelect: (serviceId: string) => void
  planetRef: React.Ref<HTMLDivElement>
}

/**
 * ServicePlanet - Individual service dot in the galaxy
 *
 * Renders a small colored dot representing a service with status indication
 */
const ServicePlanet: FC<ServicePlanetProps> = ({ service, isSelected, onSelect, planetRef }) => {
  const statusColor = STATUS_COLORS[service.status] || '#64748b'

  const handleClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    e.stopPropagation()
    onSelect(service.id)
  }

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>): void => {
    e.currentTarget.classList.add('hovered')
  }

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>): void => {
    e.currentTarget.classList.remove('hovered')
  }

  const styles: CSSProperties = {
    left: '0px',
    top: '0px',
    '--status-color': statusColor
  } as CSSProperties

  return (
    <div
      ref={planetRef}
      className={`service-planet ${service.status} ${isSelected ? 'selected' : ''}`}
      style={styles}
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
