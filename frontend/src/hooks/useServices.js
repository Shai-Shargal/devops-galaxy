/**
 * useServices Hook
 *
 * Manages DevOps Galaxy service state.
 *
 * Currently uses mock data (Level 1).
 * Future versions can switch to backend API without changing component code.
 *
 * Architecture:
 * - Data source abstraction (mock or API)
 * - Service state management
 * - CRUD operations
 * - Ready for user-specific data (Level 2)
 */

import { useState, useEffect, useCallback } from 'react'
import { MOCK_SERVICES } from '../data/mockServices'

/**
 * Custom hook for services state and operations
 *
 * Returns:
 * - services: Array of service objects
 * - selectedService: Currently selected service (for detail panel)
 * - selectService: Function to select a service
 * - clearSelection: Function to clear selection
 * - updateService: Function to update a service (future)
 * - addService: Function to add a service (future)
 * - deleteService: Function to delete a service (future)
 * - loading: Loading state
 * - error: Error state
 */
export function useServices() {
  const [services, setServices] = useState([])
  const [selectedService, setSelectedService] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Initialize services (currently from mock data)
  // Future: will fetch from backend API
  useEffect(() => {
    const loadServices = async () => {
      try {
        setLoading(true)
        // For now: use mock data
        // Future: const response = await fetch('/api/services')
        // Future: const data = await response.json()
        setServices(MOCK_SERVICES)
        setError(null)
      } catch (err) {
        setError(err.message)
        console.error('Error loading services:', err)
      } finally {
        setLoading(false)
      }
    }

    loadServices()
  }, [])

  // Select a service for detail view
  const selectService = useCallback((serviceId) => {
    const service = services.find(s => s.id === serviceId)
    setSelectedService(service || null)
  }, [services])

  // Clear service selection
  const clearSelection = useCallback(() => {
    setSelectedService(null)
  }, [])

  // Update a service (future implementation)
  const updateService = useCallback((serviceId, updates) => {
    setServices(prevServices =>
      prevServices.map(s =>
        s.id === serviceId ? { ...s, ...updates } : s
      )
    )
    // If the selected service was updated, update selection too
    if (selectedService?.id === serviceId) {
      setSelectedService(prev => ({ ...prev, ...updates }))
    }
  }, [selectedService])

  // Add a new service (future implementation)
  const addService = useCallback((newService) => {
    const serviceWithDefaults = {
      id: newService.id || `service-${Date.now()}`,
      status: newService.status || 'orange',
      lastUpdate: new Date().toISOString(),
      dependencies: newService.dependencies || [],
      pipeline: newService.pipeline || {
        latestRun: null,
        lastCommit: null
      },
      position: newService.position || { x: 0, y: 0, theta: 0 },
      ...newService
    }
    setServices(prev => [...prev, serviceWithDefaults])
  }, [])

  // Delete a service (future implementation)
  const deleteService = useCallback((serviceId) => {
    setServices(prev => prev.filter(s => s.id !== serviceId))
    if (selectedService?.id === serviceId) {
      setSelectedService(null)
    }
  }, [selectedService])

  // Get service by ID
  const getServiceById = useCallback((serviceId) => {
    return services.find(s => s.id === serviceId)
  }, [services])

  // Get dependencies for a service
  const getDependencies = useCallback((serviceId) => {
    const service = getServiceById(serviceId)
    if (!service) return []
    return service.dependencies.map(depId => getServiceById(depId)).filter(Boolean)
  }, [getServiceById])

  // Get dependents (services that depend on this one)
  const getDependents = useCallback((serviceId) => {
    return services.filter(s => s.dependencies.includes(serviceId))
  }, [services])

  return {
    // State
    services,
    selectedService,
    loading,
    error,

    // Selection methods
    selectService,
    clearSelection,

    // CRUD methods (for future use)
    updateService,
    addService,
    deleteService,

    // Query methods
    getServiceById,
    getDependencies,
    getDependents
  }
}

/**
 * Hook for getting service statistics
 */
export function useServiceStats(services) {
  return {
    total: services.length,
    healthy: services.filter(s => s.status === 'green').length,
    running: services.filter(s => s.status === 'orange').length,
    failed: services.filter(s => s.status === 'red').length
  }
}
