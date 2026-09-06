import React, { useEffect, useRef } from 'react'
import './Galaxy.css'

/**
 * Galaxy Component
 *
 * Wraps the GalaxyJS library to render an interactive spiral galaxy.
 * This component handles:
 * - Rendering the galaxy visualization
 * - Initializing GalaxyJS with appropriate settings
 * - Providing a container for the canvas
 *
 * The galaxy itself is purely visual/environmental.
 * Application logic (services, status, interactions) is separate.
 */
export default function Galaxy() {
  const containerRef = useRef(null)

  useEffect(() => {
    // Initialize GalaxyJS when component mounts
    if (containerRef.current && window.Galaxy) {
      // Create the spiral galaxy
      const galaxy = window.Galaxy.create('spiral', containerRef.current, {
        speed: 0.5,           // Rotation speed
        stars: 600,           // Number of particles/stars
        colors: [             // Particle colors
          '#ffffff',          // White
          '#9bd0ff',          // Light blue
          '#c9b8ff'           // Light purple
        ],
        size: 2,              // Particle size
        count: 8000           // Total particles in field (background stars)
      })

      console.log('✨ GalaxyJS initialized')
      console.log('Galaxy instance:', galaxy)

      // Expose to window for debugging if needed
      window.galaxyInstance = galaxy

      // Optional: Handle window resize
      const handleResize = () => {
        // GalaxyJS handles resize automatically
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
