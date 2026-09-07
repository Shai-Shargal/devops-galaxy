/**
 * Services Container Component
 *
 * Manages the service planets visualization.
 * Orchestrates:
 * - Service rendering (ServicePlanet components)
 * - Animation loop (useAnimation hook)
 * - Detail panel (ServiceDetailPanel component)
 * - Service selection and updates
 */

import React, { useCallback, useRef } from 'react'
import { useServices } from '../../hooks/useServices'
import { useAnimation } from '../../hooks/useAnimation'
import ServicePlanet from './ServicePlanet'
import ServiceDetailPanel from './ServiceDetailPanel'
import '../Services.css'

/**
 * Services - Main container for service planets
 *
 * @param {Array} props.services - Services array from parent (App.jsx)
 */
function Services({
  services,
  selectedService,
  selectService,
  clearSelection,
  updateService,
  getDependencies,
  getDependents
}) {
  const containerRef = React.useRef(null)
  const selectedServiceRef = useRef(null)
  const servicesRef = useRef([])
  const planetsRef = useRef({}) // Maps service.id → DOM element

  // Setup animation loop
  useAnimation(containerRef, servicesRef, selectedServiceRef, planetsRef)

  // Keep services ref in sync
  React.useEffect(() => {
    servicesRef.current = services
  }, [services])

  // Keep selected service ref in sync
  React.useEffect(() => {
    selectedServiceRef.current = selectedService
  }, [selectedService])

  // Get dependencies for selected service
  const selectedDependencies = React.useMemo(() => {
    if (!selectedService) return []
    return getDependencies(selectedService.id)
  }, [selectedService, getDependencies])

  const selectedDependents = React.useMemo(() => {
    if (!selectedService) return []
    return getDependents(selectedService.id)
  }, [selectedService, getDependents])

  // Handle clicking outside planets
  const handleContainerClick = (e) => {
    if (e.target === e.currentTarget) {
      clearSelection()
    }
  }

  // Store planet element refs
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
      {services.map((service) => (
        <ServicePlanet
          key={service.id}
          service={service}
          isSelected={selectedService?.id === service.id}
          onSelect={selectService}
          planetRef={(el) => setPlanetRef(service.id, el)}
        />
      ))}

      {/* Detail panel for selected service */}
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

export default Services
