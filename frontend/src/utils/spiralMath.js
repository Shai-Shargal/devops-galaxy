/**
 * Spiral Mathematics Utilities
 *
 * Handles all calculations for positioning services on the spiral galaxy.
 * Separates math logic from React components.
 */

/**
 * Spiral configuration constants
 * Services positioned along logarithmic spiral arms
 */
export const SPIRAL_CONFIG = {
  baseRadius: 70,          // Distance from center where spiral starts (pixels)
  maxRadialDistance: 100,  // Total radial growth across full spiral (pixels)
  maxTheta: 8 * Math.PI    // Full spiral rotation extent (radians)
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
 * @param {number} theta - Position on spiral (0 to 8π)
 * @param {number} rotation - Current rotation angle (animation)
 * @param {number} centerX - X coordinate of galaxy center
 * @param {number} centerY - Y coordinate of galaxy center
 * @returns {object} Position {x, y} and metadata {r, angle}
 */
export function getSpirralPosition(theta, rotation, centerX, centerY) {
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
 * @param {HTMLElement} containerRef - Container element
 * @returns {object} Center coordinates {x, y} or null if invalid
 */
export function getContainerCenter(containerRef) {
  if (!containerRef) return null

  const width = containerRef.offsetWidth
  const height = containerRef.offsetHeight

  if (width <= 0 || height <= 0) return null

  return {
    x: width / 2,
    y: height / 2
  }
}
