/**
 * HTTP Client
 *
 * Centralized HTTP client with interceptors for:
 * - Error handling
 * - Request/response transformation
 * - Authentication (when needed)
 * - Logging
 */

import { NetworkError, TimeoutError } from '../errors'

export interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  headers?: Record<string, string>
  body?: unknown
  timeout?: number
  retries?: number
}

export interface ResponseData<T = unknown> {
  success: boolean
  data?: T
  error?: string
  code?: string
}

/**
 * HTTP Client class
 */
class HttpClient {
  private baseUrl: string = ''
  private defaultTimeout: number = 30000 // 30 seconds
  private defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json'
  }

  /**
   * Set base URL for API
   */
  setBaseUrl(url: string): void {
    this.baseUrl = url
  }

  /**
   * Set default header
   */
  setDefaultHeader(key: string, value: string): void {
    this.defaultHeaders[key] = value
  }

  /**
   * Make GET request
   */
  async get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'GET' })
  }

  /**
   * Make POST request
   */
  async post<T>(endpoint: string, body: unknown, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'POST', body })
  }

  /**
   * Make PUT request
   */
  async put<T>(endpoint: string, body: unknown, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'PUT', body })
  }

  /**
   * Make DELETE request
   */
  async delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' })
  }

  /**
   * Generic request method
   */
  private async request<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<T> {
    const {
      method = 'GET',
      headers = {},
      body = undefined,
      timeout = this.defaultTimeout,
      retries = 3
    } = config

    const url = this.baseUrl ? `${this.baseUrl}${endpoint}` : endpoint
    const allHeaders = { ...this.defaultHeaders, ...headers }

    let lastError: Error | null = null

    // Retry logic
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await this.fetchWithTimeout(url, {
          method,
          headers: allHeaders,
          body: body ? JSON.stringify(body) : undefined,
          timeout
        })

        if (!response.ok) {
          throw new NetworkError(
            `HTTP ${response.status}: ${response.statusText}`,
            response.status
          )
        }

        const data = await response.json()
        return data as T
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error))

        // Don't retry on certain errors
        if (
          lastError instanceof NetworkError &&
          lastError.statusCode &&
          lastError.statusCode >= 400 &&
          lastError.statusCode < 500
        ) {
          throw lastError
        }

        // Retry after delay
        if (attempt < retries) {
          const delay = Math.pow(2, attempt - 1) * 1000 // Exponential backoff
          await new Promise((resolve) => setTimeout(resolve, delay))
        }
      }
    }

    // All retries exhausted
    if (lastError) {
      throw lastError
    }

    throw new NetworkError('Request failed after retries')
  }

  /**
   * Fetch with timeout
   */
  private fetchWithTimeout(
    url: string,
    options: RequestInit & { timeout?: number }
  ): Promise<Response> {
    const { timeout = this.defaultTimeout, ...fetchOptions } = options

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    return fetch(url, { ...fetchOptions, signal: controller.signal })
      .then((response) => {
        clearTimeout(timeoutId)
        return response
      })
      .catch((error) => {
        clearTimeout(timeoutId)
        if (error.name === 'AbortError') {
          throw new TimeoutError('Request', timeout)
        }
        throw error
      })
  }
}

/**
 * Global HTTP client instance
 */
export const httpClient = new HttpClient()
