/**
 * Mock Service Repository Implementation
 *
 * In-memory implementation for development and testing.
 * Can be swapped for real API implementation without changing consuming code.
 */

import { ServiceRepository } from './serviceRepository'
import { NotFoundError, ConflictError } from '../errors'
import { MOCK_SERVICES } from '../data/mockServices'
import type { Service } from '../types'

/**
 * Mock implementation of service repository
 */
export class MockServiceRepository extends ServiceRepository {
  private services: Service[] = []

  constructor() {
    super()
    // Initialize with mock data
    this.services = JSON.parse(JSON.stringify(MOCK_SERVICES)) as Service[]
  }

  /**
   * Get all services
   */
  async getServices(): Promise<Service[]> {
    // Simulate network delay
    await this.delay(100)
    return JSON.parse(JSON.stringify(this.services)) as Service[]
  }

  /**
   * Get a single service by ID
   */
  async getServiceById(id: string): Promise<Service> {
    await this.delay(50)
    const service = this.services.find((s) => s.id === id)
    if (!service) {
      throw new NotFoundError('Service', id)
    }
    return JSON.parse(JSON.stringify(service)) as Service
  }

  /**
   * Add a new service
   */
  async addService(serviceData: Omit<Service, 'id' | 'position' | 'lastUpdate'>): Promise<Service> {
    await this.delay(100)

    // Check for duplicates
    const exists = this.services.some((s) => s.name === serviceData.name)
    if (exists) {
      throw new ConflictError('Service', `${serviceData.name} already exists`)
    }

    // Generate unique ID
    const id = `${serviceData.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`

    // Calculate position (simple approach - append to end)
    const maxTheta = Math.max(...this.services.map((s) => s.position?.theta || 0))
    const position = {
      theta: maxTheta + 0.6,
      x: 0,
      y: 0
    }

    const newService: Service = {
      ...serviceData,
      id,
      position,
      lastUpdate: new Date().toISOString()
    }

    this.services.push(newService)
    return JSON.parse(JSON.stringify(newService)) as Service
  }

  /**
   * Update an existing service
   */
  async updateService(id: string, updates: Partial<Service>): Promise<Service> {
    await this.delay(100)

    const service = this.services.find((s) => s.id === id)
    if (!service) {
      throw new NotFoundError('Service', id)
    }

    Object.assign(service, {
      ...updates,
      id, // Don't allow ID change
      lastUpdate: new Date().toISOString()
    })

    return JSON.parse(JSON.stringify(service)) as Service
  }

  /**
   * Delete a service
   */
  async deleteService(id: string): Promise<void> {
    await this.delay(100)

    const index = this.services.findIndex((s) => s.id === id)
    if (index === -1) {
      throw new NotFoundError('Service', id)
    }

    this.services.splice(index, 1)
  }

  /**
   * Search services by name or team
   */
  async searchServices(query: string): Promise<Service[]> {
    await this.delay(100)

    const lowerQuery = query.toLowerCase()
    return this.services.filter(
      (s) =>
        s.name.toLowerCase().includes(lowerQuery) ||
        s.team.toLowerCase().includes(lowerQuery)
    )
  }

  /**
   * Get service dependencies
   */
  async getServiceDependencies(serviceId: string): Promise<Service[]> {
    await this.delay(50)

    const service = this.services.find((s) => s.id === serviceId)
    if (!service) {
      throw new NotFoundError('Service', serviceId)
    }

    if (!service.dependencies || service.dependencies.length === 0) {
      return []
    }

    return this.services.filter((s) => service.dependencies?.includes(s.id))
  }

  /**
   * Get services that depend on this service
   */
  async getServiceDependents(serviceId: string): Promise<Service[]> {
    await this.delay(50)

    const service = this.services.find((s) => s.id === serviceId)
    if (!service) {
      throw new NotFoundError('Service', serviceId)
    }

    return this.services.filter((s) => s.dependencies?.includes(serviceId) || false)
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<boolean> {
    await this.delay(50)
    return true
  }

  /**
   * Helper: simulate network delay
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}

/**
 * Create and export global mock repository instance
 */
export const mockServiceRepository = new MockServiceRepository()
