/**
 * useAnimation Hook
 *
 * Manages the continuous animation loop for service planets.
 * Handles:
 * - Smooth requestAnimationFrame loop
 * - Rotation state management
 * - Position calculations and DOM updates
 * - Pause/resume on detail panel open/close
 *
 * This hook is completely independent from React state updates,
 * ensuring smooth 60fps animation without interference.
 */

import { useEffect, useRef } from 'react'
import { getSpirralPosition, getContainerCenter } from '../utils/spiralMath'

/**
 * Animation configuration
 */
const ANIMATION_CONFIG = {
  rotationSpeed: 0.0008  // Radians per frame (very slow, ~3.6 min full rotation)
}

/**
 * Hook for managing planet animation
 *
 * @param {React.RefObject} containerRef - Container element reference
 * @param {React.MutableRefObject} servicesRef - Services array reference
 * @param {React.MutableRefObject} selectedServiceRef - Selected service reference
 * @param {React.MutableRefObject} planetsRef - Planet DOM elements reference
 * @returns {void}
 */
export function useAnimation(containerRef, servicesRef, selectedServiceRef, planetsRef) {
  const rotationRef = useRef(0)
  const animationIdRef = useRef(null)

  useEffect(() => {
    /**
     * Main animation loop
     * Runs every requestAnimationFrame (~60fps)
     * No React state updates - pure DOM manipulation
     */
    const animate = () => {
      // Only rotate if detail panel is closed
      if (!selectedServiceRef.current) {
        rotationRef.current += ANIMATION_CONFIG.rotationSpeed
      }

      // Get current container center (recalculated every frame)
      const center = getContainerCenter(containerRef.current)

      // Update planet positions if we have valid data
      if (center && servicesRef.current.length > 0) {
        servicesRef.current.forEach(service => {
          const planetElement = planetsRef.current[service.id]

          // Only update if element exists and is in DOM
          if (planetElement?.isConnected) {
            // Calculate position on spiral
            const theta = service.position.theta
            const pos = getSpirralPosition(
              theta,
              rotationRef.current,
              center.x,
              center.y
            )

            // Round to whole pixels (eliminates sub-pixel rendering artifacts)
            const x = Math.round(pos.x)
            const y = Math.round(pos.y)

            // Update DOM directly (no React re-render)
            planetElement.style.left = `${x}px`
            planetElement.style.top = `${y}px`
          }
        })
      }

      // Continue the animation loop
      animationIdRef.current = requestAnimationFrame(animate)
    }

    // Start animation on mount
    animationIdRef.current = requestAnimationFrame(animate)

    // Cleanup on unmount
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
    }
  }, [containerRef, servicesRef, selectedServiceRef, planetsRef])

  // Return refs for external access if needed
  return {
    rotationRef,
    animationIdRef
  }
}
