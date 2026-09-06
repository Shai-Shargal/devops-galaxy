/**
 * Mock Service Data - E-Commerce Microservices Architecture
 *
 * This represents a realistic e-commerce system with 12 interdependent services.
 *
 * Data structure is designed for future replacement with backend API (Level 2):
 * - Mock data (current)
 * - Backend API with real Jenkins/GitHub Actions data (future)
 * - User-specific integrations (future)
 *
 * Users can edit mock pipeline data to experiment with different scenarios.
 */

/**
 * Generate deterministic random number based on a string
 * Same input always produces same output (for consistent jitter across renders)
 */
function seededRandom(str) {
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
 * Range: ±0.4 radians = ±23 degrees
 * Deterministic: same service ID always produces same jitter
 */
export function getThetaJitter(serviceId) {
  const randomValue = seededRandom(serviceId)
  return (randomValue - 0.5) * 0.8 // ±0.4 radians
}

export const MOCK_SERVICES = [
  {
    id: 'frontend-service',
    name: 'Frontend Service',
    description: 'React web application - user-facing UI',
    team: 'Frontend Team',
    repository: 'https://github.com/company/frontend-service',
    dataSource: 'github',
    position: {
      theta: 0.5
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
      theta: 1.2
    },
    dependencies: ['auth-service', 'product-service', 'order-service', 'search-service'],
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
    id: 'auth-service',
    name: 'Auth Service',
    description: 'Authentication, authorization, JWT tokens',
    team: 'Security Team',
    repository: 'https://github.com/company/auth-service',
    dataSource: 'github',
    position: {
      theta: 2.0
    },
    dependencies: [],
    status: 'green',
    lastUpdate: '2026-09-06T10:42:00Z',
    pipeline: {
      latestRun: {
        number: 89,
        branch: 'main',
        status: 'passed',
        triggeredBy: 'Eve Wilson',
        triggeredAt: '2026-09-06T09:00:00Z',
        completedAt: '2026-09-06T09:20:00Z',
        duration: 1200,
        stages: {
          build: { status: 'passed', duration: 300 },
          test: { status: 'passed', duration: 600 },
          deploy: { status: 'passed', duration: 300 }
        }
      },
      lastCommit: {
        hash: 'c3d4e5f6g7h8',
        message: 'Add OAuth2 provider support',
        author: 'Eve Wilson',
        authorEmail: 'eve@company.com',
        url: 'https://github.com/company/auth-service/commit/c3d4e5',
        pushedAt: '2026-09-06T08:45:00Z'
      }
    }
  },

  {
    id: 'product-service',
    name: 'Product Service',
    description: 'Product catalog, details, and metadata',
    team: 'Catalog Team',
    repository: 'https://github.com/company/product-service',
    dataSource: 'github',
    position: {
      theta: 2.8
    },
    dependencies: ['cache-service'],
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
          test: { status: 'running', duration: null },
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
    id: 'inventory-service',
    name: 'Inventory Service',
    description: 'Stock management and warehouse integration',
    team: 'Operations Team',
    repository: 'https://github.com/company/inventory-service',
    dataSource: 'jenkins',
    position: {
      theta: 3.6
    },
    dependencies: ['cache-service'],
    status: 'green',
    lastUpdate: '2026-09-06T10:38:00Z',
    pipeline: {
      latestRun: {
        number: 167,
        branch: 'main',
        status: 'passed',
        triggeredBy: 'Grace Martinez',
        triggeredAt: '2026-09-06T09:45:00Z',
        completedAt: '2026-09-06T10:10:00Z',
        duration: 1500,
        stages: {
          build: { status: 'passed', duration: 350 },
          test: { status: 'passed', duration: 700 },
          deploy: { status: 'passed', duration: 450 }
        }
      },
      lastCommit: {
        hash: 'e5f6g7h8i9j0',
        message: 'Fix inventory sync race condition',
        author: 'Grace Martinez',
        authorEmail: 'grace@company.com',
        url: 'https://github.com/company/inventory-service/commit/e5f6g7',
        pushedAt: '2026-09-06T09:30:00Z'
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
      theta: 4.4
    },
    dependencies: ['payment-service', 'inventory-service', 'notification-service'],
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
    dataSource: 'jenkins',
    position: {
      theta: 5.2
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
      theta: 6.0
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
  },

  {
    id: 'search-service',
    name: 'Search Service',
    description: 'Elasticsearch integration for product search',
    team: 'Search Team',
    repository: 'https://github.com/company/search-service',
    dataSource: 'github',
    position: {
      theta: 6.8
    },
    dependencies: ['product-service'],
    status: 'green',
    lastUpdate: '2026-09-06T10:41:00Z',
    pipeline: {
      latestRun: {
        number: 112,
        branch: 'main',
        status: 'passed',
        triggeredBy: 'Karen Davis',
        triggeredAt: '2026-09-06T08:00:00Z',
        completedAt: '2026-09-06T08:25:00Z',
        duration: 1500,
        stages: {
          build: { status: 'passed', duration: 360 },
          test: { status: 'passed', duration: 650 },
          deploy: { status: 'passed', duration: 490 }
        }
      },
      lastCommit: {
        hash: 'i9j0k1l2m3n4',
        message: 'Optimize search index rebuilding',
        author: 'Karen Davis',
        authorEmail: 'karen@company.com',
        url: 'https://github.com/company/search-service/commit/i9j0k1',
        pushedAt: '2026-09-06T07:45:00Z'
      }
    }
  },

  {
    id: 'recommendation-service',
    name: 'Recommendation Service',
    description: 'ML-powered product recommendations',
    team: 'ML Team',
    repository: 'https://github.com/company/recommendation-service',
    dataSource: 'github',
    position: {
      theta: 7.2
    },
    dependencies: ['product-service'],
    status: 'green',
    lastUpdate: '2026-09-06T10:37:00Z',
    pipeline: {
      latestRun: {
        number: 76,
        branch: 'main',
        status: 'passed',
        triggeredBy: 'Leo Martinez',
        triggeredAt: '2026-09-06T08:45:00Z',
        completedAt: '2026-09-06T09:15:00Z',
        duration: 1800,
        stages: {
          build: { status: 'passed', duration: 400 },
          test: { status: 'passed', duration: 900 },
          deploy: { status: 'passed', duration: 500 }
        }
      },
      lastCommit: {
        hash: 'j0k1l2m3n4o5',
        message: 'Update ML model training pipeline',
        author: 'Leo Martinez',
        authorEmail: 'leo@company.com',
        url: 'https://github.com/company/recommendation-service/commit/j0k1l2',
        pushedAt: '2026-09-06T08:30:00Z'
      }
    }
  },

  {
    id: 'analytics-service',
    name: 'Analytics Service',
    description: 'Business intelligence and reporting',
    team: 'Data Team',
    repository: 'https://github.com/company/analytics-service',
    dataSource: 'jenkins',
    position: {
      theta: 7.8
    },
    dependencies: ['order-service', 'product-service'],
    status: 'green',
    lastUpdate: '2026-09-06T10:33:00Z',
    pipeline: {
      latestRun: {
        number: 204,
        branch: 'main',
        status: 'passed',
        triggeredBy: 'Mona Torres',
        triggeredAt: '2026-09-06T08:00:00Z',
        completedAt: '2026-09-06T08:30:00Z',
        duration: 1800,
        stages: {
          build: { status: 'passed', duration: 380 },
          test: { status: 'passed', duration: 900 },
          deploy: { status: 'passed', duration: 520 }
        }
      },
      lastCommit: {
        hash: 'k1l2m3n4o5p6',
        message: 'Add revenue analytics dashboard',
        author: 'Mona Torres',
        authorEmail: 'mona@company.com',
        url: 'https://github.com/company/analytics-service/commit/k1l2m3',
        pushedAt: '2026-09-06T07:45:00Z'
      }
    }
  },

  {
    id: 'cache-service',
    name: 'Cache Service',
    description: 'Redis cluster for caching layer',
    team: 'Infrastructure Team',
    repository: 'https://github.com/company/cache-service',
    dataSource: 'github',
    position: {
      theta: 0.8
    },
    dependencies: [],
    status: 'green',
    lastUpdate: '2026-09-06T10:43:00Z',
    pipeline: {
      latestRun: {
        number: 67,
        branch: 'main',
        status: 'passed',
        triggeredBy: 'Noah Johnson',
        triggeredAt: '2026-09-06T06:00:00Z',
        completedAt: '2026-09-06T06:20:00Z',
        duration: 1200,
        stages: {
          build: { status: 'passed', duration: 310 },
          test: { status: 'passed', duration: 550 },
          deploy: { status: 'passed', duration: 340 }
        }
      },
      lastCommit: {
        hash: 'l2m3n4o5p6q7',
        message: 'Upgrade Redis to 7.0',
        author: 'Noah Johnson',
        authorEmail: 'noah@company.com',
        url: 'https://github.com/company/cache-service/commit/l2m3n4',
        pushedAt: '2026-09-06T05:45:00Z'
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

  if (stageValues.some(s => s.status === STAGE_STATUS.FAILED)) {
    return SERVICE_STATUS.RED
  }

  if (stageValues.some(s => s.status === STAGE_STATUS.RUNNING)) {
    return SERVICE_STATUS.ORANGE
  }

  return SERVICE_STATUS.GREEN
}
