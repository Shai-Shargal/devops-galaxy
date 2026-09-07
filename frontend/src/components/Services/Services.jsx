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
import './Services.css'

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
  console.log(`🎬 Services MOUNTED - rendering ${services.length} services`)

  const containerRef = React.useRef(null)
  const selectedServiceRef = useRef(null)
  const servicesRef = useRef([])
  const planetsRef = useRef({}) // Maps service.id → DOM element

  // Setup animation loop
  useAnimation(containerRef, servicesRef, selectedServiceRef, planetsRef)

  // Keep services ref in sync
  React.useEffect(() => {
    console.log(`🔄 Services ref updated: ${services.length} services`)
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
      console.log(`📌 Registering ref for: ${serviceId}`)
      planetsRef.current[serviceId] = element
      console.log(`   Total refs now: ${Object.keys(planetsRef.current).length}`)
    } else {
      console.log(`🗑️ Removing ref for: ${serviceId}`)
      delete planetsRef.current[serviceId]
    }
  }, [])

  console.log(`🎨 About to render ${services.length} ServicePlanet components`)

  // EMERGENCY TEST: Does this div appear at all?
  return (
    <>
      <div style={{
        position: 'fixed',
        top: '20px',
        left: '20px',
        padding: '10px',
        backgroundColor: 'yellow',
        color: 'black',
        zIndex: 10000,
        fontSize: '14px',
        fontWeight: 'bold'
      }}>
        🟡 SERVICES COMPONENT IS RENDERING! ({services.length} services)
      </div>
      <div
        ref={containerRef}
        className="services-container"
        onClick={handleContainerClick}
      >
      {/* DEBUG: Show all services as simple divs first */}
      {services.map((service, idx) => (
        <div
          key={`debug-${service.id}`}
          style={{
            position: 'absolute',
            left: `${50 + idx * 30}px`,
            top: `${50 + idx * 20}px`,
            width: '20px',
            height: '20px',
            backgroundColor: service.status === 'green' ? 'lime' : service.status === 'orange' ? 'orange' : 'red',
            borderRadius: '50%',
            zIndex: 999
          }}
          title={`${service.id} (DEBUG)`}
        />
      ))}

      {/* Render all service planets */}
      {services.map((service) => {
        console.log(`  → Rendering planet: ${service.id}`)
        return (
          <ServicePlanet
            key={service.id}
            service={service}
            isSelected={selectedService?.id === service.id}
            onSelect={selectService}
            planetRef={(el) => setPlanetRef(service.id, el)}
          />
        )
      })}

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
    </>
  )
}

export default Services
