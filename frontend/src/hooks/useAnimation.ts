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
import { ANIMATION_CONFIG } from '@config'
import type { Service } from '@types'
import { getSpirralPosition, getContainerCenter } from '@utils/spiralMath'

interface AnimationRefs {
  rotationRef: React.MutableRefObject<number>
  animationIdRef: React.MutableRefObject<number | null>
}

/**
 * Hook for managing planet animation
 *
 * @param containerRef - Container element reference
 * @param servicesRef - Services array reference
 * @param selectedServiceRef - Selected service reference
 * @param planetsRef - Planet DOM elements reference
 */
export function useAnimation(
  containerRef: React.RefObject<HTMLDivElement | null>,
  servicesRef: React.MutableRefObject<Service[]>,
  selectedServiceRef: React.MutableRefObject<Service | null>,
  planetsRef: React.MutableRefObject<Record<string, HTMLElement>>
): AnimationRefs {
  const rotationRef = useRef<number>(0)
  const animationIdRef = useRef<number | null>(null)

  useEffect(() => {
    /**
     * Main animation loop
     * Runs every requestAnimationFrame (~60fps)
     * No React state updates - pure DOM manipulation
     */
    const animate = () => {
      // Only rotate if detail panel is closed
      if (!selectedServiceRef.current) {
        rotationRef.current += ANIMATION_CONFIG.ROTATION_SPEED
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

            // Use CSS transforms (hardware-accelerated, no jitter)
            // translate3d triggers GPU acceleration, translate(-50%, -50%) centers the dot
            planetElement.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`
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
