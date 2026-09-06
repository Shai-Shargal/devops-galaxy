/**
 * Mock Service Data
 *
 * This is a clean data source for Level 1 (Demo/Mock Mode).
 * The structure is designed to work with real backend data later (Level 2).
 *
 * Data structure remains consistent regardless of source:
 * - Mock data (current)
 * - Backend API (future)
 * - User-specific integrations (future)
 */

export const MOCK_SERVICES = [
  {
    id: 'frontend-service',
    name: 'Frontend Service',
    description: 'React web application',
    team: 'Frontend Team',
    repository: 'https://github.com/Shai-Shargal/frontend-service',
    dataSource: 'github', // Where data comes from (for future use)
    position: {
      x: 200,
      y: 150,
      theta: 1.2 // Position on spiral (0 to 8π)
    },
    dependencies: ['api-service'], // Services this depends on
    status: 'green', // green, orange, red
    lastUpdate: '2026-09-06T10:35:45Z',
    pipeline: {
      latestRun: {
        number: 156,
        branch: 'main',
        status: 'passed',
        triggeredBy: 'Alice Chen',
        triggeredAt: '2026-09-06T10:00:00Z',
        completedAt: '2026-09-06T10:25:00Z',
        duration: 1500, // seconds
        stages: {
          build: {
            status: 'passed',
            duration: 330,
            startedAt: '2026-09-06T10:00:00Z',
            completedAt: '2026-09-06T10:05:30Z'
          },
          test: {
            status: 'passed',
            duration: 615,
            startedAt: '2026-09-06T10:05:30Z',
            completedAt: '2026-09-06T10:15:45Z'
          },
          deploy: {
            status: 'passed',
            duration: 555,
            startedAt: '2026-09-06T10:15:45Z',
            completedAt: '2026-09-06T10:25:00Z'
          }
        }
      },
      lastCommit: {
        hash: 'abc123def456',
        message: 'Add dashboard page',
        author: 'Alice Chen',
        authorEmail: 'alice@example.com',
        url: 'https://github.com/Shai-Shargal/frontend-service/commit/abc123',
        pushedAt: '2026-09-06T09:55:00Z'
      }
    }
  },

  {
    id: 'api-service',
    name: 'API Service',
    description: 'Backend REST API',
    team: 'Backend Team',
    repository: 'https://github.com/Shai-Shargal/api-service',
    dataSource: 'github',
    position: {
      x: 400,
      y: 300,
      theta: 2.5
    },
    dependencies: ['database-service', 'cache-service'],
    status: 'green',
    lastUpdate: '2026-09-06T10:35:45Z',
    pipeline: {
      latestRun: {
        number: 203,
        branch: 'main',
        status: 'passed',
        triggeredBy: 'Bob Smith',
        triggeredAt: '2026-09-06T09:30:00Z',
        completedAt: '2026-09-06T09:55:00Z',
        duration: 1500,
        stages: {
          build: {
            status: 'passed',
            duration: 320,
            startedAt: '2026-09-06T09:30:00Z',
            completedAt: '2026-09-06T09:35:20Z'
          },
          test: {
            status: 'passed',
            duration: 600,
            startedAt: '2026-09-06T09:35:20Z',
            completedAt: '2026-09-06T09:45:20Z'
          },
          deploy: {
            status: 'passed',
            duration: 580,
            startedAt: '2026-09-06T09:45:20Z',
            completedAt: '2026-09-06T09:55:00Z'
          }
        }
      },
      lastCommit: {
        hash: 'def456ghi789',
        message: 'Fix API response parsing',
        author: 'Bob Smith',
        authorEmail: 'bob@example.com',
        url: 'https://github.com/Shai-Shargal/api-service/commit/def456',
        pushedAt: '2026-09-06T09:20:00Z'
      }
    }
  },

  {
    id: 'payment-service',
    name: 'Payment Service',
    description: 'Payment processing and transactions',
    team: 'Payments Team',
    repository: 'https://github.com/Shai-Shargal/payment-service',
    dataSource: 'jenkins', // Simulating different source
    position: {
      x: 600,
      y: 150,
      theta: 4.2
    },
    dependencies: ['api-service'],
    status: 'red', // Simulating a failed service
    lastUpdate: '2026-09-06T10:30:00Z',
    pipeline: {
      latestRun: {
        number: 89,
        branch: 'main',
        status: 'failed',
        triggeredBy: 'Carol Johnson',
        triggeredAt: '2026-09-06T10:00:00Z',
        completedAt: '2026-09-06T10:20:00Z',
        duration: 1200,
        stages: {
          build: {
            status: 'passed',
            duration: 300,
            startedAt: '2026-09-06T10:00:00Z',
            completedAt: '2026-09-06T10:05:00Z'
          },
          test: {
            status: 'failed', // Tests failed
            duration: 900,
            startedAt: '2026-09-06T10:05:00Z',
            completedAt: '2026-09-06T10:20:00Z'
          },
          deploy: {
            status: 'skipped', // Not deployed because tests failed
            duration: 0,
            startedAt: null,
            completedAt: null
          }
        }
      },
      lastCommit: {
        hash: 'ghi789jkl012',
        message: 'Add Stripe integration',
        author: 'Carol Johnson',
        authorEmail: 'carol@example.com',
        url: 'https://github.com/Shai-Shargal/payment-service/commit/ghi789',
        pushedAt: '2026-09-06T09:50:00Z'
      }
    }
  }
]

/**
 * Service model constants
 * Used for validation and UI display
 */
export const SERVICE_STATUS = {
  GREEN: 'green',   // All passed
  ORANGE: 'orange', // Running
  RED: 'red'        // Failed
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
export function getServiceById(id) {
  return MOCK_SERVICES.find(s => s.id === id)
}

/**
 * Helper: Get all dependencies for a service
 */
export function getServiceDependencies(serviceId) {
  const service = getServiceById(serviceId)
  return service ? service.dependencies : []
}

/**
 * Helper: Get all services that depend on a given service
 * (reverse dependencies)
 */
export function getDependentsOf(serviceId) {
  return MOCK_SERVICES.filter(s => s.dependencies.includes(serviceId))
}

/**
 * Helper: Calculate overall status based on pipeline stages
 */
export function calculateStatus(stages) {
  if (!stages) return SERVICE_STATUS.RED

  const stageValues = Object.values(stages)

  // If any stage failed, status is red
  if (stageValues.some(s => s.status === STAGE_STATUS.FAILED)) {
    return SERVICE_STATUS.RED
  }

  // If any stage is running, status is orange
  if (stageValues.some(s => s.status === STAGE_STATUS.RUNNING)) {
    return SERVICE_STATUS.ORANGE
  }

  // All passed
  return SERVICE_STATUS.GREEN
}
