/**
 * Validation Configuration
 *
 * Central location for all validation rules and constraints.
 */

export const VALIDATION_CONFIG = {
  SERVICE_NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50,
    PATTERN: /^[a-zA-Z0-9\-_]+$/
  },
  TEAM_NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50,
    PATTERN: /^[a-zA-Z0-9\s\-_]+$/
  },
  REPOSITORY_URL: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 500,
    PATTERN: /^https?:\/\/.+/
  },
  DESCRIPTION: {
    MAX_LENGTH: 500
  },
  BRANCH_NAME: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 100,
    PATTERN: /^[a-zA-Z0-9\-_.\/]+$/
  },
  COMMIT_MESSAGE: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 1000
  }
} as const
