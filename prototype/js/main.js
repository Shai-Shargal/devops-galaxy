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

    // Create particle system
    this.particleSystem = new ParticleSystem(this.spiral, 80);

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

    // Log info
    console.log('🌌 DevOps Galaxy Prototype - Phase 1b');
    console.log('Spiral Info:', this.spiral.getInfo());
    console.log('Particle Info:', this.particleSystem.getInfo());
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

    // Update and draw particles
    this.particleSystem.update();
    this.particleSystem.draw(this.ctx, this.rotation);

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

  /**
   * Adjust particle count
   */
  setParticleCount(count) {
    this.particleSystem.setParticleCount(count);
  }

  /**
   * Get particle system info
   */
  getParticleInfo() {
    return this.particleSystem.getInfo();
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
  console.log('');
  console.log('  ROTATION:');
  console.log('    galaxy.toggleRotation()         - Pause/resume rotation');
  console.log('    galaxy.setRotationSpeed(0.005)  - Change rotation speed');
  console.log('');
  console.log('  SPIRAL:');
  console.log('    galaxy.spiral.getInfo()         - Get spiral parameters');
  console.log('    galaxy.spiral.armCount = 3      - Change number of arms');
  console.log('    galaxy.spiral.opacity = 0.6     - Change opacity');
  console.log('');
  console.log('  PARTICLES:');
  console.log('    galaxy.getParticleInfo()        - Get particle stats');
  console.log('    galaxy.setParticleCount(120)    - Change particle count');
  console.log('');
});
