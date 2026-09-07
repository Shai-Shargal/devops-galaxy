/**
 * Error Messages
 *
 * User-friendly error messages for different error codes.
 * Separates internal error codes from user-facing messages.
 */

import type { AppError } from './types'

const ERROR_MESSAGES: Record<string, string> = {
  NOT_FOUND: 'Resource not found. Please check if it still exists.',
  VALIDATION_ERROR: 'The information you provided is invalid. Please check and try again.',
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  AUTH_ERROR: 'Authentication failed. Please log in again.',
  CONFLICT: 'This resource already exists. Please use a different name or ID.',
  TIMEOUT: 'Request took too long. Please try again.',
  UNKNOWN: 'An unexpected error occurred. Please try again.'
}

/**
 * Get user-friendly error message
 */
export function getUserMessage(error: AppError | Error): string {
  if (error instanceof Error && 'code' in error && error.code) {
    return ERROR_MESSAGES[error.code as string] || ERROR_MESSAGES.UNKNOWN
  }
  return ERROR_MESSAGES.UNKNOWN
}

/**
 * Get full error details (for debugging)
 */
export function getErrorDetails(error: AppError | Error): string {
  if (error instanceof Error && 'code' in error && 'message' in error) {
    const appError = error as AppError
    return `[${appError.code}] ${appError.message}`
  }
  return error.message || 'Unknown error'
}

/**
 * Format error for logging
 */
export function formatErrorForLog(error: AppError | Error): Record<string, unknown> {
  if (error instanceof Error && 'code' in error && 'details' in error) {
    const appError = error as AppError
    return {
      code: appError.code,
      message: appError.message,
      details: appError.details,
      stack: appError.stack
    }
  }
  return {
    message: error.message,
    stack: error.stack
  }
}
