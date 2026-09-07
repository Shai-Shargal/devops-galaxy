/**
 * Error Handler
 *
 * Centralized error handling logic.
 * Handles logging, user notification, and error recovery.
 */

import { formatErrorForLog, getUserMessage } from './messages'
import type { AppError } from './types'

/**
 * Error handler configuration
 */
export interface ErrorHandlerConfig {
  logErrors: boolean
  notifyUser: boolean
  onError?: (error: AppError | Error) => void
}

const DEFAULT_CONFIG: ErrorHandlerConfig = {
  logErrors: true,
  notifyUser: true
}

let config = DEFAULT_CONFIG

/**
 * Configure error handler
 */
export function configureErrorHandler(newConfig: Partial<ErrorHandlerConfig>): void {
  config = { ...DEFAULT_CONFIG, ...newConfig }
}

/**
 * Handle an error
 */
export function handleError(
  error: AppError | Error,
  context?: string
): void {
  if (config.logErrors) {
    const logData = formatErrorForLog(error)
    if (context) {
      console.error(`[${context}]`, logData)
    } else {
      console.error(logData)
    }
  }

  if (config.onError) {
    config.onError(error)
  }
}

/**
 * Handle error and return user message
 */
export function handleErrorWithMessage(
  error: AppError | Error,
  context?: string
): string {
  handleError(error, context)
  return getUserMessage(error)
}

/**
 * Wrap async function with error handling
 */
export function withErrorHandling<T, A extends unknown[]>(
  fn: (...args: A) => Promise<T>,
  context?: string
): (...args: A) => Promise<T | null> {
  return async (...args: A) => {
    try {
      return await fn(...args)
    } catch (error) {
      const appError = error instanceof Error ? error : new Error(String(error))
      handleError(appError, context)
      return null
    }
  }
}

/**
 * Safely execute async function with error handling
 */
export async function safeAsync<T>(
  fn: () => Promise<T>,
  context?: string
): Promise<{ success: boolean; data?: T; error?: string }> {
  try {
    const data = await fn()
    return { success: true, data }
  } catch (error) {
    const appError = error instanceof Error ? error : new Error(String(error))
    const message = handleErrorWithMessage(appError, context)
    return { success: false, error: message }
  }
}
