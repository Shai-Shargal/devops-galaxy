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
 * Services have their own animation loop synchronized to the same speed.
 */
export default function Galaxy() {
  const containerRef = useRef(null)

  useEffect(() => {
    // Initialize GalaxyJS when component mounts
    if (containerRef.current && window.Galaxy) {
      // Create the spiral galaxy - fully formed and round from start
      const galaxy = window.Galaxy.create('spiral', containerRef.current, {
        speed: 0.3,           // Rotation speed (slower to match services)
        stars: 8000,          // Particles in spiral arms (dense arms)
        colors: [             // Particle colors
          '#ffffff',          // White
          '#9bd0ff',          // Light blue
          '#c9b8ff'           // Light purple
        ],
        size: 2,              // Particle size
        count: 50000,         // Total background particles (fill complete shape)
        core: true,           // Add glowing core center
        arms: 4               // Number of spiral arms
      })

      console.log('✨ GalaxyJS initialized')

      // Expose to window for debugging
      window.galaxyInstance = galaxy

      // Handle window resize
      const handleResize = () => {
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
