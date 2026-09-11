/**
 * Mock Service Data - E-Commerce Microservices Architecture
 *
 * 6 core services representing a realistic microservices system.
 *
 * Data structure is designed for future replacement with backend API (Level 2):
 * - Mock data (current)
 * - Backend API with real Jenkins/GitHub Actions data (future)
 * - User-specific integrations (future)
 *
 * Users can edit mock pipeline data to experiment with different scenarios.
 */

import type { Service, Stages, ServiceStatus as StageStatusType, StageStatus } from '../types'

/**
 * Generate deterministic random number based on a string
 * Same input always produces same output (for consistent jitter across renders)
 */
function seededRandom(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash % 1000) / 1000 // Returns 0-1
}

/**
 * Generate theta jitter for natural, random service placement
 * Range: ±0.15 radians = ±8.6 degrees (subtle, not shaky)
 * Deterministic: same service ID always produces same jitter
 */
export function getThetaJitter(serviceId: string): number {
  const randomValue = seededRandom(serviceId)
  return (randomValue - 0.5) * 0.3 // ±0.15 radians (subtle jitter)
}

export const MOCK_SERVICES: Service[] = [
  {
    id: 'frontend-service',
    name: 'Frontend Service',
    description: 'React web application - user-facing UI',
    team: 'Frontend Team',
    repository: 'https://github.com/company/frontend-service',
    dataSource: 'github',
    position: {
      theta: 0.8
    },
    dependencies: ['api-gateway'],
    status: 'green',
    lastUpdate: '2026-09-06T10:35:45Z',
    pipeline: {
      latestRun: {
        number: 156,
        branch: 'main',
        status: 'passed',
        triggeredBy: 'Alice Chen',
        triggeredAt: '2026-09-06T10:00:00Z',
        completedAt: '2026-09-06T10:25:00Z',
        duration: 1500,
        stages: {
          build: { status: 'passed', duration: 330 },
          test: { status: 'passed', duration: 615 },
          deploy: { status: 'passed', duration: 555 }
        }
      },
      lastCommit: {
        hash: 'a1b2c3d4e5f6',
        message: 'Add product filtering UI',
        author: 'Alice Chen',
        authorEmail: 'alice@company.com',
        url: 'https://github.com/company/frontend-service/commit/a1b2c3',
        pushedAt: '2026-09-06T09:55:00Z'
      }
    }
  },

  {
    id: 'api-gateway',
    name: 'API Gateway',
    description: 'Central routing and load balancing',
    team: 'Infrastructure Team',
    repository: 'https://github.com/company/api-gateway',
    dataSource: 'github',
    position: {
      theta: 2.0
    },
    dependencies: ['product-service', 'order-service'],
    status: 'green',
    lastUpdate: '2026-09-06T10:40:00Z',
    pipeline: {
      latestRun: {
        number: 142,
        branch: 'main',
        status: 'passed',
        triggeredBy: 'David Park',
        triggeredAt: '2026-09-06T08:30:00Z',
        completedAt: '2026-09-06T08:50:00Z',
        duration: 1200,
        stages: {
          build: { status: 'passed', duration: 300 },
          test: { status: 'passed', duration: 450 },
          deploy: { status: 'passed', duration: 450 }
        }
      },
      lastCommit: {
        hash: 'b2c3d4e5f6g7',
        message: 'Increase rate limit to 10k/min',
        author: 'David Park',
        authorEmail: 'david@company.com',
        url: 'https://github.com/company/api-gateway/commit/b2c3d4',
        pushedAt: '2026-09-06T08:15:00Z'
      }
    }
  },

  {
    id: 'product-service',
    name: 'Product Service',
    description: 'Product catalog and metadata',
    team: 'Catalog Team',
    repository: 'https://github.com/company/product-service',
    dataSource: 'github',
    position: {
      theta: 3.4
    },
    dependencies: [],
    status: 'orange',
    lastUpdate: '2026-09-06T10:20:00Z',
    pipeline: {
      latestRun: {
        number: 234,
        branch: 'main',
        status: 'running',
        triggeredBy: 'Frank Lee',
        triggeredAt: '2026-09-06T10:15:00Z',
        completedAt: null,
        duration: null,
        stages: {
          build: { status: 'passed', duration: 320 },
          test: { status: 'running', duration: 0 },
          deploy: { status: 'skipped', duration: 0 }
        }
      },
      lastCommit: {
        hash: 'd4e5f6g7h8i9',
        message: 'Add product image optimization',
        author: 'Frank Lee',
        authorEmail: 'frank@company.com',
        url: 'https://github.com/company/product-service/commit/d4e5f6',
        pushedAt: '2026-09-06T10:10:00Z'
      }
    }
  },

  {
    id: 'order-service',
    name: 'Order Service',
    description: 'Order processing and lifecycle management',
    team: 'Orders Team',
    repository: 'https://github.com/company/order-service',
    dataSource: 'github',
    position: {
      theta: 4.8
    },
    dependencies: ['payment-service', 'notification-service'],
    status: 'green',
    lastUpdate: '2026-09-06T10:36:00Z',
    pipeline: {
      latestRun: {
        number: 198,
        branch: 'main',
        status: 'passed',
        triggeredBy: 'Henry Zhang',
        triggeredAt: '2026-09-06T10:05:00Z',
        completedAt: '2026-09-06T10:30:00Z',
        duration: 1500,
        stages: {
          build: { status: 'passed', duration: 330 },
          test: { status: 'passed', duration: 700 },
          deploy: { status: 'passed', duration: 470 }
        }
      },
      lastCommit: {
        hash: 'f6g7h8i9j0k1',
        message: 'Add order status tracking webhooks',
        author: 'Henry Zhang',
        authorEmail: 'henry@company.com',
        url: 'https://github.com/company/order-service/commit/f6g7h8',
        pushedAt: '2026-09-06T09:50:00Z'
      }
    }
  },

  {
    id: 'payment-service',
    name: 'Payment Service',
    description: 'Payment processing and transaction handling',
    team: 'Payments Team',
    repository: 'https://github.com/company/payment-service',
    dataSource: 'github',
    position: {
      theta: 6.2
    },
    dependencies: ['notification-service'],
    status: 'red',
    lastUpdate: '2026-09-06T10:25:00Z',
    pipeline: {
      latestRun: {
        number: 89,
        branch: 'develop',
        status: 'failed',
        triggeredBy: 'Iris Kim',
        triggeredAt: '2026-09-06T10:15:00Z',
        completedAt: '2026-09-06T10:35:00Z',
        duration: 1200,
        stages: {
          build: { status: 'passed', duration: 300 },
          test: { status: 'failed', duration: 900 },
          deploy: { status: 'skipped', duration: 0 }
        }
      },
      lastCommit: {
        hash: 'g7h8i9j0k1l2',
        message: 'Add Stripe webhook validation',
        author: 'Iris Kim',
        authorEmail: 'iris@company.com',
        url: 'https://github.com/company/payment-service/commit/g7h8i9',
        pushedAt: '2026-09-06T10:05:00Z'
      }
    }
  },

  {
    id: 'notification-service',
    name: 'Notification Service',
    description: 'Email, SMS, and push notifications',
    team: 'Comms Team',
    repository: 'https://github.com/company/notification-service',
    dataSource: 'github',
    position: {
      theta: 7.6
    },
    dependencies: [],
    status: 'green',
    lastUpdate: '2026-09-06T10:39:00Z',
    pipeline: {
      latestRun: {
        number: 145,
        branch: 'main',
        status: 'passed',
        triggeredBy: 'Jack Brown',
        triggeredAt: '2026-09-06T09:30:00Z',
        completedAt: '2026-09-06T09:55:00Z',
        duration: 1500,
        stages: {
          build: { status: 'passed', duration: 340 },
          test: { status: 'passed', duration: 670 },
          deploy: { status: 'passed', duration: 490 }
        }
      },
      lastCommit: {
        hash: 'h8i9j0k1l2m3',
        message: 'Add retry logic for failed notifications',
        author: 'Jack Brown',
        authorEmail: 'jack@company.com',
        url: 'https://github.com/company/notification-service/commit/h8i9j0',
        pushedAt: '2026-09-06T09:15:00Z'
      }
    }
  }
]

/**
 * Service model constants
 */
export const SERVICE_STATUS = {
  GREEN: 'green',   // All stages passed
  ORANGE: 'orange', // Pipeline running
  RED: 'red'        // Pipeline failed
}

export const STAGE_STATUS = {
  PASSED: 'passed',
  FAILED: 'failed',
  RUNNING: 'running',
  SKIPPED: 'skipped'
}

/**
 * Helper: Get service by ID
 */
export function getServiceById(id: string): Service | undefined {
  return MOCK_SERVICES.find(s => s.id === id)
}

/**
 * Helper: Get all dependencies for a service
 */
export function getServiceDependencies(serviceId: string): string[] {
  const service = getServiceById(serviceId)
  return service ? service.dependencies : []
}

/**
 * Helper: Get all services that depend on a given service
 */
export function getDependentsOf(serviceId: string): Service[] {
  return MOCK_SERVICES.filter(s => s.dependencies.includes(serviceId))
}

/**
 * Helper: Calculate overall status based on pipeline stages
 */
export function calculateStatus(stages: Stages | undefined): StageStatusType {
  if (!stages) return SERVICE_STATUS.RED as StageStatusType

  const stageValues = Object.values(stages)

  if (stageValues.some((s: any) => s.status === STAGE_STATUS.FAILED)) {
    return SERVICE_STATUS.RED as StageStatusType
  }

  if (stageValues.some((s: any) => s.status === STAGE_STATUS.RUNNING)) {
    return SERVICE_STATUS.ORANGE as StageStatusType
  }

  return SERVICE_STATUS.GREEN as StageStatusType
}
