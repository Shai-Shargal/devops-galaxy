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

import React, { useCallback, useRef, FC, useMemo, useEffect } from 'react'
import type { Service } from '../../types'
import { useAnimation } from '../../hooks/useAnimation'
import ServicePlanet from './ServicePlanet'
import ServiceDetailPanel from './ServiceDetailPanel'
import '../Services.css'

/**
 * Props for Services component
 */
interface ServicesProps {
  services: Service[]
  selectedService: Service | null
  selectService: (serviceId: string) => void
  clearSelection: () => void
  updateService: (serviceId: string, updates: Partial<Service>) => void
  getDependencies: (serviceId: string) => Service[]
  getDependents: (serviceId: string) => Service[]
}

/**
 * Services - Main container for service planets
 *
 * Receives all state and methods as props from App component
 * Manages animation loop and service planet rendering
 */
const Services: FC<ServicesProps> = ({
  services,
  selectedService,
  selectService,
  clearSelection,
  updateService,
  getDependencies,
  getDependents
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const selectedServiceRef = useRef<Service | null>(null)
  const servicesRef = useRef<Service[]>([])
  const planetsRef = useRef<Record<string, HTMLElement>>({})

  // Setup animation loop
  useAnimation(containerRef, servicesRef, selectedServiceRef, planetsRef)

  // Keep services ref in sync
  useEffect(() => {
    servicesRef.current = services
  }, [services])

  // Keep selected service ref in sync
  useEffect(() => {
    selectedServiceRef.current = selectedService
  }, [selectedService])

  // Get dependencies for selected service
  const selectedDependencies = useMemo((): Service[] => {
    if (!selectedService) return []
    return getDependencies(selectedService.id)
  }, [selectedService, getDependencies])

  const selectedDependents = useMemo((): Service[] => {
    if (!selectedService) return []
    return getDependents(selectedService.id)
  }, [selectedService, getDependents])

  // Handle clicking outside planets
  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (e.target === e.currentTarget) {
      clearSelection()
    }
  }

  // Store planet element refs
  const setPlanetRef = useCallback((serviceId: string, element: HTMLElement | null): void => {
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
