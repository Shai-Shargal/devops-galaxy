/**
 * Error Type Definitions
 *
 * Structured error types for the application.
 * Enables proper error categorization and handling.
 */

/**
 * Base application error class
 */
export class AppError extends Error {
  constructor(
    public code: string,
    public message: string,
    public details?: Record<string, unknown>
  ) {
    super(message)
    this.name = 'AppError'
    Object.setPrototypeOf(this, AppError.prototype)
  }
}

/**
 * Resource not found (404)
 */
export class NotFoundError extends AppError {
  constructor(resource: string, id?: string) {
    super(
      'NOT_FOUND',
      `${resource} not found${id ? ` (${id})` : ''}`,
      { resource, id }
    )
    this.name = 'NotFoundError'
    Object.setPrototypeOf(this, NotFoundError.prototype)
  }
}

/**
 * Invalid input validation error
 */
export class ValidationError extends AppError {
  constructor(
    message: string,
    public fields?: Record<string, string[]>
  ) {
    super('VALIDATION_ERROR', message, { fields })
    this.name = 'ValidationError'
    Object.setPrototypeOf(this, ValidationError.prototype)
  }
}

/**
 * Network/API error
 */
export class NetworkError extends AppError {
  constructor(
    message: string,
    public statusCode?: number,
    public originalError?: Error
  ) {
    super('NETWORK_ERROR', message, { statusCode })
    this.name = 'NetworkError'
    Object.setPrototypeOf(this, NetworkError.prototype)
  }
}

/**
 * Authentication/Authorization error
 */
export class AuthError extends AppError {
  constructor(message: string = 'Authentication failed') {
    super('AUTH_ERROR', message)
    this.name = 'AuthError'
    Object.setPrototypeOf(this, AuthError.prototype)
  }
}

/**
 * Conflict/duplicate error
 */
export class ConflictError extends AppError {
  constructor(resource: string, details?: string) {
    super(
      'CONFLICT',
      `${resource} already exists${details ? `: ${details}` : ''}`,
      { resource, details }
    )
    this.name = 'ConflictError'
    Object.setPrototypeOf(this, ConflictError.prototype)
  }
}

/**
 * Timeout error
 */
export class TimeoutError extends AppError {
  constructor(operation: string, timeoutMs: number) {
    super(
      'TIMEOUT',
      `${operation} timed out after ${timeoutMs}ms`,
      { operation, timeoutMs }
    )
    this.name = 'TimeoutError'
    Object.setPrototypeOf(this, TimeoutError.prototype)
  }
}
