/**
 * Error Logger
 *
 * Structured logging for errors.
 * Can be extended to log to external services (Sentry, etc.).
 */

interface LogEntry {
  timestamp: string
  level: 'error' | 'warn' | 'info'
  message: string
  context?: string
  details?: Record<string, unknown>
  stack?: string
}

class ErrorLogger {
  private logs: LogEntry[] = []
  private maxLogs = 100

  /**
   * Log an error
   */
  error(message: string, context?: string, details?: Record<string, unknown>, stack?: string): void {
    this.addLog('error', message, context, details, stack)
  }

  /**
   * Log a warning
   */
  warn(message: string, context?: string, details?: Record<string, unknown>): void {
    this.addLog('warn', message, context, details)
  }

  /**
   * Log info
   */
  info(message: string, context?: string, details?: Record<string, unknown>): void {
    this.addLog('info', message, context, details)
  }

  /**
   * Get all logs
   */
  getLogs(): LogEntry[] {
    return [...this.logs]
  }

  /**
   * Get logs by level
   */
  getLogsByLevel(level: 'error' | 'warn' | 'info'): LogEntry[] {
    return this.logs.filter((log) => log.level === level)
  }

  /**
   * Get logs by context
   */
  getLogsByContext(context: string): LogEntry[] {
    return this.logs.filter((log) => log.context === context)
  }

  /**
   * Clear logs
   */
  clearLogs(): void {
    this.logs = []
  }

  /**
   * Export logs as JSON
   */
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2)
  }

  /**
   * Internal: add log entry
   */
  private addLog(
    level: 'error' | 'warn' | 'info',
    message: string,
    context?: string,
    details?: Record<string, unknown>,
    stack?: string
  ): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      details,
      stack
    }

    this.logs.push(entry)

    // Keep only last N logs to prevent memory leak
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs)
    }

    // Also log to console in development
    if (import.meta.env.DEV) {
      const prefix = context ? `[${context}]` : ''
      switch (level) {
        case 'error':
          console.error(prefix, message, details)
          break
        case 'warn':
          console.warn(prefix, message, details)
          break
        case 'info':
          console.info(prefix, message, details)
          break
      }
    }
  }
}

/**
 * Global error logger instance
 */
export const logger = new ErrorLogger()
