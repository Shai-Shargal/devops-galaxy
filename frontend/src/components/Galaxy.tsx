import { useEffect, useRef, FC } from 'react'
import './Galaxy.css'

declare global {
  interface Window {
    Galaxy: {
      create: (type: string, container: HTMLElement, config: Record<string, unknown>) => unknown
    }
    galaxyInstance: unknown
  }
}

/**
 * Galaxy Component
 *
 * Wraps the GalaxyJS library to render an interactive starcluster galaxy.
 * This component handles:
 * - Rendering the galaxy visualization
 * - Initializing GalaxyJS with appropriate settings
 * - Providing a container for the canvas
 *
 * The galaxy itself is purely visual/environmental.
 * Services have their own animation loop synchronized to the same speed.
 */
const Galaxy: FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Initialize GalaxyJS when component mounts
    if (containerRef.current && window.Galaxy) {
      // Create a star cluster galaxy (globe-like rotation)
      // Rotates right-to-left like a globe, easier to synchronize with service planets
      const galaxy = window.Galaxy.create('starcluster', containerRef.current, {
        speed: 0.15,          // Rotation speed (matched to service animation speed)
        stars: 600,          // Number of particles/stars in cluster
        colors: [             // Particle colors
          '#ffffff',          // White
          '#9bd0ff',          // Light blue
          '#c9b8ff'           // Light purple
        ],
        size: 2,              // Particle size
        count: 1000          // Total particles in field (background stars)
      })

      console.log('✨ GalaxyJS initialized')

      // Expose to window for debugging
      window.galaxyInstance = galaxy

      // Handle window resize
      const handleResize = (): void => {
        console.log('Window resized - GalaxyJS handles it automatically')
      }

      window.addEventListener('resize', handleResize)

      return () => {
        window.removeEventListener('resize', handleResize)
      }
    }
  }, [])

  return (
    <div className="galaxy-container">
      <div ref={containerRef} className="galaxy-canvas" id="stage"></div>
    </div>
  )
}

export default Galaxy
