/**
 * DevOps Galaxy Type Definitions
 *
 * Central location for all TypeScript types and interfaces used throughout the application.
 */

/**
 * Service Status - represents the current state of a CI/CD pipeline
 */
export type ServiceStatus = 'green' | 'orange' | 'red'

/**
 * Pipeline Stage Status - represents the status of individual build stages
 */
export type StageStatus = 'passed' | 'failed' | 'running' | 'skipped'

/**
 * Position on the Archimedean spiral
 */
export interface Position {
  theta: number  // Angle position on spiral (0 to 20π)
}

/**
 * A single pipeline stage (build, test, deploy, etc.)
 */
export interface PipelineStage {
  status: StageStatus
  duration: number  // in milliseconds
}

/**
 * Pipeline stages grouped by name
 */
export interface Stages {
  build: PipelineStage
  test: PipelineStage
  deploy: PipelineStage
}

/**
 * Latest pipeline run information
 */
export interface LatestRun {
  number: number
  branch: string
  status: StageStatus
  triggeredBy: string
  triggeredAt: string
  completedAt: string | null
  duration: number | null
  stages: Stages
}

/**
 * Last commit information
 */
export interface LastCommit {
  hash: string
  message: string
  author: string
  authorEmail: string
  url: string
  pushedAt: string
}

/**
 * Complete pipeline information
 */
export interface Pipeline {
  latestRun: LatestRun
  lastCommit: LastCommit
}

/**
 * Core Service object - represents a microservice in the DevOps Galaxy
 */
export interface Service {
  id: string
  name: string
  description: string
  team: string
  repository: string
  dataSource: 'github' | 'gitlab' | 'bitbucket'
  position: Position
  dependencies: string[]  // IDs of services this depends on
  status: ServiceStatus
  lastUpdate: string
  pipeline: Pipeline
}

/**
 * New service input (for adding services)
 */
export interface NewServiceInput {
  id?: string
  name: string
  team: string
  description?: string
  repository?: string
  dependencies?: string[]
  status: ServiceStatus
  pipeline?: Pipeline
}

/**
 * Service statistics
 */
export interface ServiceStats {
  total: number
  healthy: number
  running: number
  failed: number
}

/**
 * Return type of useServices hook
 */
export interface UseServicesReturn {
  // State
  services: Service[]
  selectedService: Service | null
  loading: boolean
  error: string | null

  // Selection methods
  selectService: (serviceId: string) => void
  clearSelection: () => void

  // CRUD methods
  updateService: (serviceId: string, updates: Partial<Service>) => void
  addService: (newService: NewServiceInput) => void
  deleteService: (serviceId: string) => void

  // Query methods
  getServiceById: (serviceId: string) => Service | undefined
  getDependencies: (serviceId: string) => Service[]
  getDependents: (serviceId: string) => Service[]
}

/**
 * Animation configuration
 */
export interface AnimationConfig {
  rotationSpeed: number  // Radians per frame
}

/**
 * Spiral configuration
 */
export interface SpiralConfig {
  baseRadius: number          // Starting distance from center
  maxRadialDistance: number   // Total radial growth
  maxTheta: number           // Maximum angle extent
}

/**
 * Position on the spiral (calculated)
 */
export interface CalculatedPosition {
  x: number
  y: number
  r: number      // Radius
  angle: number  // Current angle with rotation applied
}

/**
 * Container center coordinates
 */
export interface ContainerCenter {
  x: number
  y: number
}
