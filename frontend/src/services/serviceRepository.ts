/**
 * Service Repository Interface
 *
 * Data access layer abstraction.
 * Defines the contract for service data operations.
 *
 * This interface allows swapping between mock and real implementations
 * without changing the consuming code.
 */

import type { Service } from '../types'

/**
 * Service Repository Interface
 *
 * All data access operations for services go through this interface.
 * Implementation can be swapped between mock and real API.
 */
export interface IServiceRepository {
  /**
   * Get all services
   */
  getServices(): Promise<Service[]>

  /**
   * Get a single service by ID
   */
  getServiceById(id: string): Promise<Service>

  /**
   * Add a new service
   */
  addService(service: Omit<Service, 'id' | 'position' | 'lastUpdate'>): Promise<Service>

  /**
   * Update an existing service
   */
  updateService(id: string, updates: Partial<Service>): Promise<Service>

  /**
   * Delete a service
   */
  deleteService(id: string): Promise<void>

  /**
   * Search services by name or team
   */
  searchServices(query: string): Promise<Service[]>

  /**
   * Get service dependencies
   */
  getServiceDependencies(serviceId: string): Promise<Service[]>

  /**
   * Get services that depend on this service
   */
  getServiceDependents(serviceId: string): Promise<Service[]>

  /**
   * Health check
   */
  healthCheck(): Promise<boolean>
}

/**
 * Abstract base repository
 */
export abstract class ServiceRepository implements IServiceRepository {
  abstract getServices(): Promise<Service[]>
  abstract getServiceById(id: string): Promise<Service>
  abstract addService(service: Omit<Service, 'id' | 'position' | 'lastUpdate'>): Promise<Service>
  abstract updateService(id: string, updates: Partial<Service>): Promise<Service>
  abstract deleteService(id: string): Promise<void>
  abstract searchServices(query: string): Promise<Service[]>
  abstract getServiceDependencies(serviceId: string): Promise<Service[]>
  abstract getServiceDependents(serviceId: string): Promise<Service[]>
  abstract healthCheck(): Promise<boolean>
}
