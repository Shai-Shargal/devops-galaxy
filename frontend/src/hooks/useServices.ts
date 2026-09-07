/**
 * useServices Hook
 *
 * Manages DevOps Galaxy service state.
 *
 * Uses data layer abstraction for:
 * - Development: mock data (in-memory)
 * - Production: real API backend
 *
 * Architecture:
 * - Data source abstraction via serviceRepository
 * - Service state management
 * - CRUD operations with proper error handling
 * - Can be swapped between mock/real without changing component code
 */

import { useState, useEffect, useCallback } from 'react'
import { serviceRepository } from '@services'
import { handleErrorWithMessage } from '@errors'
import { SPIRAL_CONFIG } from '@config'
import type { Service, NewServiceInput, UseServicesReturn, ServiceStats } from '@types'

/**
 * Custom hook for services state and operations
 *
 * Returns:
 * - services: Array of service objects
 * - selectedService: Currently selected service (for detail panel)
 * - selectService: Function to select a service
 * - clearSelection: Function to clear selection
 * - updateService: Function to update a service
 * - addService: Function to add a service
 * - deleteService: Function to delete a service
 * - loading: Loading state
 * - error: Error state
 */
export function useServices(): UseServicesReturn {
  const [services, setServices] = useState<Service[]>([])
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Initialize services from data layer
  useEffect(() => {
    const loadServices = async (): Promise<void> => {
      try {
        setLoading(true)
        const data = await serviceRepository.getServices()
        setServices(data)
        setError(null)
      } catch (err) {
        const errorMessage = handleErrorWithMessage(
          err instanceof Error ? err : new Error(String(err)),
          'useServices:loadServices'
        )
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    loadServices()
  }, [])

  // Select a service for detail view
  const selectService = useCallback((serviceId: string): void => {
    const service = services.find((s) => s.id === serviceId)
    setSelectedService(service || null)
  }, [services])

  // Clear service selection
  const clearSelection = useCallback((): void => {
    setSelectedService(null)
  }, [])

  // Update a service
  const updateService = useCallback((serviceId: string, updates: Partial<Service>): void => {
    setServices((prevServices) =>
      prevServices.map((s) => (s.id === serviceId ? { ...s, ...updates } : s))
    )
    // If the selected service was updated, update selection too
    if (selectedService?.id === serviceId) {
      setSelectedService((prev) => (prev ? { ...prev, ...updates } : null))
    }
  }, [selectedService])

  // Add a new service with proper defaults
  const addService = useCallback(
    (newService: NewServiceInput): void => {
      // Generate a theta position spread around the spiral
      // Find the max theta from existing services and add increment
      const maxTheta =
        services.length > 0 ? Math.max(...services.map((s) => s.position?.theta || 0)) : 0
      const newTheta = (maxTheta + SPIRAL_CONFIG.THETA_INCREMENT) % SPIRAL_CONFIG.MAX_THETA

      // Create a unique ID - use name + timestamp to avoid duplicates
      const serviceId =
        newService.id ||
        `${newService.name?.toLowerCase().replace(/\s+/g, '-') || 'service'}-${Date.now()}`

      // Default pipeline data for new services
      const defaultPipeline = {
        latestRun: {
          number: Math.floor(Math.random() * 300) + 1,
          branch: 'main',
          status:
            newService.status === 'green'
              ? 'passed'
              : newService.status === 'red'
                ? 'failed'
                : 'running',
          triggeredBy: 'Demo User',
          triggeredAt: new Date().toISOString(),
          completedAt: newService.status === 'orange' ? null : new Date().toISOString(),
          duration: newService.status === 'orange' ? null : Math.floor(Math.random() * 1500) + 600,
          stages: {
            build: {
              status: 'passed',
              duration: Math.floor(Math.random() * 400) + 250
            },
            test: {
              status: newService.status === 'red' ? 'failed' : 'passed',
              duration: Math.floor(Math.random() * 700) + 400
            },
            deploy: {
              status: newService.status === 'red' ? 'skipped' : 'passed',
              duration:
                newService.status === 'red' ? 0 : Math.floor(Math.random() * 600) + 300
            }
          }
        },
        lastCommit: {
          hash: Math.random().toString(36).substring(2, 14),
          message: 'Initial mock service commit',
          author: 'Demo User',
          authorEmail: 'demo@company.com',
          url: '#',
          pushedAt: new Date().toISOString()
        }
      }

      const serviceWithDefaults: Service = {
        id: serviceId,
        name: newService.name || 'Untitled Service',
        description: newService.description || 'Mock service created for demonstration',
        team: newService.team || 'Demo Team',
        repository: newService.repository || '#',
        dataSource: 'github',
        position: {
          theta: newTheta
        },
        dependencies: newService.dependencies || [],
        status: newService.status || 'orange',
        lastUpdate: new Date().toISOString(),
        pipeline: newService.pipeline || defaultPipeline
      }

      setServices((prev) => [...prev, serviceWithDefaults])
    },
    [services]
  )

  // Delete a service
  const deleteService = useCallback(
    (serviceId: string): void => {
      setServices((prev) => prev.filter((s) => s.id !== serviceId))
      if (selectedService?.id === serviceId) {
        setSelectedService(null)
      }
    },
    [selectedService]
  )

  // Get service by ID
  const getServiceById = useCallback(
    (serviceId: string): Service | undefined => {
      return services.find((s) => s.id === serviceId)
    },
    [services]
  )

  // Get dependencies for a service
  const getDependencies = useCallback(
    (serviceId: string): Service[] => {
      const service = getServiceById(serviceId)
      if (!service) return []
      return service.dependencies
        .map((depId) => getServiceById(depId))
        .filter((service): service is Service => service !== undefined)
    },
    [getServiceById]
  )

  // Get dependents (services that depend on this one)
  const getDependents = useCallback(
    (serviceId: string): Service[] => {
      return services.filter((s) => s.dependencies.includes(serviceId))
    },
    [services]
  )

  return {
    // State
    services,
    selectedService,
    loading,
    error,

    // Selection methods
    selectService,
    clearSelection,

    // CRUD methods
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
export function useServiceStats(services: Service[]): ServiceStats {
  return {
    total: services.length,
    healthy: services.filter(s => s.status === 'green').length,
    running: services.filter(s => s.status === 'orange').length,
    failed: services.filter(s => s.status === 'red').length
  }
}
