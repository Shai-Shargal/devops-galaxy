/**
 * UI Configuration
 *
 * Central location for UI-related constants and theming.
 */

export const UI_CONFIG = {
  PLANET: {
    SIZE_PX: 12,
    GLOW_SIZE_PX: 3,
    HOVER_SCALE: 1.5
  },
  DETAIL_PANEL: {
    WIDTH_PX: 400,
    ANIMATION_DURATION_MS: 300
  },
  COLORS: {
    STATUS: {
      GREEN: '#10b981',
      ORANGE: '#f59e0b',
      RED: '#ef4444'
    },
    TEXT: {
      PRIMARY: '#ffffff',
      SECONDARY: '#d1d5db'
    },
    BACKGROUND: {
      PRIMARY: '#1f2937',
      SECONDARY: '#111827'
    }
  },
  GALAXY: {
    SPEED: 0.15,
    STARS: 600,
    COUNT: 1000
  }
} as const
