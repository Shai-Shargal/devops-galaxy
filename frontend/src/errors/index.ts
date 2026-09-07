/**
 * Error handling barrel export
 *
 * Central location to import all error-related utilities.
 */

export {
  AppError,
  NotFoundError,
  ValidationError,
  NetworkError,
  AuthError,
  ConflictError,
  TimeoutError
} from './types'

export {
  getUserMessage,
  getErrorDetails,
  formatErrorForLog
} from './messages'

export {
  handleError,
  handleErrorWithMessage,
  withErrorHandling,
  safeAsync,
  configureErrorHandler,
  type ErrorHandlerConfig
} from './handler'

export { logger } from './logger'
