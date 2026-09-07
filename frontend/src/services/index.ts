/**
 * Service Repository Factory
 *
 * Central location to choose between mock and real implementations.
 * Change this single line to swap implementations:
 *
 * Development (mock):  import { mockServiceRepository }
 * Production (real):   import { realServiceRepository }
 */

import type { IServiceRepository } from './serviceRepository'
import { mockServiceRepository } from './mockServiceRepository'
// import { realServiceRepository } from './realServiceRepository'

/**
 * Environment-based repository selection
 *
 * In development: use mock
 * In production: use real API
 *
 * Can be overridden with query parameter: ?api=mock or ?api=real
 */
function getRepository(): IServiceRepository {
  // Check for query parameter override
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search)
    const apiMode = params.get('api')

    if (apiMode === 'mock') {
      return mockServiceRepository
    }
    if (apiMode === 'real') {
      // return realServiceRepository
    }
  }

  // Default to mock in development
  if (import.meta.env.DEV) {
    return mockServiceRepository
  }

  // Default to real in production
  // For now, fall back to mock if real is not available
  // return realServiceRepository
  return mockServiceRepository
}

/**
 * Global service repository instance
 * Use this throughout the application
 */
export const serviceRepository = getRepository()

export type { IServiceRepository } from './serviceRepository'
export { httpClient } from './client'
