/**
 * Spiral Mathematics Utilities
 *
 * Handles all calculations for positioning services on the spiral galaxy.
 * Separates math logic from React components.
 */

import type { SpiralConfig, CalculatedPosition, ContainerCenter } from '../types'

/**
 * Spiral configuration constants
 * Services positioned along Archimedean spiral
 */
export const SPIRAL_CONFIG: SpiralConfig = {
  baseRadius: 70,          // Distance from center where spiral starts (pixels)
  maxRadialDistance: 150,  // Total radial growth across full spiral (pixels)
  maxTheta: 20 * Math.PI   // Full spiral rotation extent (radians) - allows 30+ services
}

/**
 * Calculate position on spiral given theta and rotation angle
 *
 * Uses Archimedean spiral: r = a + b*theta
 * Where:
 *   a = baseRadius (starting distance from center)
 *   b = growth rate (how fast it expands outward)
 *   theta = angle position on spiral
 *   rotation = animation rotation offset
 *
 * @param theta - Position on spiral (0 to 20π)
 * @param rotation - Current rotation angle (animation)
 * @param centerX - X coordinate of galaxy center
 * @param centerY - Y coordinate of galaxy center
 * @returns Position {x, y} and metadata {r, angle}
 */
export function getSpirralPosition(
  theta: number,
  rotation: number,
  centerX: number,
  centerY: number
): CalculatedPosition {
  // Linear radial growth: keeps spiral tight and centered
  const r = SPIRAL_CONFIG.baseRadius +
    (theta / SPIRAL_CONFIG.maxTheta) * SPIRAL_CONFIG.maxRadialDistance

  // Combine theta position with animation rotation
  const angle = theta + rotation

  return {
    x: centerX + r * Math.cos(angle),
    y: centerY + r * Math.sin(angle),
    r: r,
    angle: angle
  }
}

/**
 * Calculate center point of a container
 *
 * @param containerRef - Container element
 * @returns Center coordinates {x, y} or null if invalid
 */
export function getContainerCenter(containerRef: HTMLElement | null): ContainerCenter | null {
  if (!containerRef) return null

  const width = containerRef.offsetWidth
  const height = containerRef.offsetHeight

  if (width <= 0 || height <= 0) return null

  return {
    x: width / 2,
    y: height / 2
  }
}
