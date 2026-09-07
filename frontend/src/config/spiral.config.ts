/**
 * Spiral Configuration
 *
 * Central location for spiral math constants and thresholds.
 * The Archimedean spiral: r = baseRadius + (theta/maxTheta) * maxRadialDistance
 */

export const SPIRAL_CONFIG = {
  // Base radius of the spiral (pixels)
  // Innermost services start at this distance from center
  BASE_RADIUS: 70,

  // Maximum radial distance (pixels)
  // Services spread out to this distance from base
  MAX_RADIAL_DISTANCE: 150,

  // Maximum theta value (radians)
  // Controls how many "turns" the spiral has
  // Higher = more room for services
  MAX_THETA: 20 * Math.PI,

  // Theta increment for new services (radians)
  // How far apart to space new services on the spiral
  THETA_INCREMENT: 0.6,

  // Maximum number of services before wrapping
  MAX_SERVICES: 50,

  // Starting theta position for first service (radians)
  INITIAL_THETA: 0.5
} as const
