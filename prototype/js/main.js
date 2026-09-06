/**
 * DevOps Galaxy - Spiral Prototype
 * Phase 1a: Core Spiral Rendering
 *
 * Main animation loop and initialization
 */

class GalaxyPrototype {
  constructor() {
    // Canvas setup
    this.canvas = document.getElementById('galaxy-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.setupCanvas();

    // Create spiral
    this.spiral = new Spiral(this.ctx, this.canvas.width, this.canvas.height);

    // Animation state
    this.rotation = 0;
    this.rotationSpeed = 0.002; // Radians per frame

    // Performance monitoring
    this.fps = 0;
    this.frameCount = 0;
    this.lastFrameTime = performance.now();

    // Bind methods
    this.animate = this.animate.bind(this);

    // Start animation
    this.animate();

    // Log spiral info
    console.log('🌌 DevOps Galaxy Prototype - Phase 1a');
    console.log('Spiral Info:', this.spiral.getInfo());
  }

  /**
   * Setup canvas to fill window
   */
  setupCanvas() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight - 100; // Account for header/footer

    // Handle window resize
    window.addEventListener('resize', () => this.onWindowResize());
  }

  /**
   * Handle window resize
   */
  onWindowResize() {
    this.setupCanvas();
    this.spiral.centerX = this.canvas.width / 2;
    this.spiral.centerY = this.canvas.height / 2;
  }

  /**
   * Animation loop (called every frame)
   */
  animate() {
    // Clear canvas with dark background
    this.ctx.fillStyle = '#1f2937';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw the spiral
    this.spiral.draw(this.rotation);

    // Update rotation
    this.rotation += this.rotationSpeed;

    // Calculate FPS
    this.updateFPS();

    // Continue animation
    requestAnimationFrame(this.animate);
  }

  /**
   * Calculate frames per second
   */
  updateFPS() {
    this.frameCount++;

    const now = performance.now();
    const elapsed = now - this.lastFrameTime;

    if (elapsed >= 1000) {
      this.fps = this.frameCount;
      this.frameCount = 0;
      this.lastFrameTime = now;

      // Log FPS every second
      console.log(`FPS: ${this.fps}`);
    }
  }

  /**
   * Adjust rotation speed (for future controls)
   */
  setRotationSpeed(speed) {
    this.rotationSpeed = speed;
    console.log(`Rotation speed set to: ${speed}`);
  }

  /**
   * Pause/resume rotation
   */
  toggleRotation() {
    if (this.rotationSpeed === 0) {
      this.rotationSpeed = 0.002;
      console.log('Rotation resumed');
    } else {
      this.rotationSpeed = 0;
      console.log('Rotation paused');
    }
  }
}

/**
 * Initialize when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
  const galaxy = new GalaxyPrototype();

  // Expose to console for debugging
  window.galaxy = galaxy;

  console.log('💡 Tip: Try these commands in console:');
  console.log('  galaxy.toggleRotation()           - Pause/resume rotation');
  console.log('  galaxy.setRotationSpeed(0.005)    - Change rotation speed');
  console.log('  galaxy.spiral.getInfo()           - Get spiral parameters');
});
