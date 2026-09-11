/**
 * Animation Configuration
 *
 * Central location for all animation-related constants.
 * Making these configurable enables easy tuning without code changes.
 */

export const ANIMATION_CONFIG = {
  // Rotation speed (radians per frame)
  // Lower = slower rotation
  ROTATION_SPEED: 0.004,

  // Animation frame rate (frames per second)
  // Used for calculating deltas and timings
  ANIMATION_FRAME_RATE: 60,

  // Whether to pause rotation when detail panel is open
  PAUSE_ROTATION_WHEN_SELECTING: true,

  // Animation loop interval (milliseconds)
  // Used for RAF-based animation
  ANIMATION_INTERVAL: 1000 / 60 // 16.67ms for 60fps
} as const
