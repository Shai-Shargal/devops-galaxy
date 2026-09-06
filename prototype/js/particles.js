/**
 * Particle System
 *
 * Creates particles that flow through the spiral arms.
 * Each particle moves along the spiral path, wrapping around when it reaches the end.
 */

class Particle {
  constructor(spiral, index, totalParticles) {
    this.spiral = spiral;
    this.index = index;
    this.totalParticles = totalParticles;

    // Position along spiral (0 to maxTheta)
    // Distribute particles evenly across the spiral
    this.theta = (index / totalParticles) * spiral.maxTheta;

    // Speed particles move along spiral (radians per frame)
    this.speed = 0.008 + Math.random() * 0.004; // Vary speed slightly

    // Visual properties
    this.opacity = 0.4 + Math.random() * 0.5; // Random opacity for depth
    this.baseOpacity = this.opacity;
    this.size = 1 + Math.random() * 1.5; // Random size for depth
    this.color = '#ffffff'; // White stars

    // Twinkling effect (optional)
    this.twinklePhase = Math.random() * Math.PI * 2;
    this.twinkleSpeed = 0.02 + Math.random() * 0.03;
  }

  /**
   * Update particle position
   */
  update() {
    // Move along spiral
    this.theta += this.speed;

    // Wrap around when reaching end
    if (this.theta > this.spiral.maxTheta) {
      this.theta = 0;
    }

    // Update twinkling
    this.twinklePhase += this.twinkleSpeed;
    const twinkleFactor = 0.7 + 0.3 * Math.sin(this.twinklePhase);
    this.opacity = this.baseOpacity * twinkleFactor;
  }

  /**
   * Draw particle on canvas
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {number} rotation - Current rotation offset
   */
  draw(ctx, rotation) {
    // Get position on spiral
    const point = this.spiral.getPointAt(this.theta, rotation);

    // Draw particle
    ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
    ctx.beginPath();
    ctx.arc(point.x, point.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

/**
 * ParticleSystem - Manages all particles
 */
class ParticleSystem {
  constructor(spiral, particleCount = 80) {
    this.spiral = spiral;
    this.particles = [];

    // Create particles distributed along spiral
    for (let i = 0; i < particleCount; i++) {
      this.particles.push(new Particle(spiral, i, particleCount));
    }

    console.log(`✨ Created ${particleCount} particles`);
  }

  /**
   * Update all particles
   */
  update() {
    this.particles.forEach(p => p.update());
  }

  /**
   * Draw all particles
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {number} rotation - Current rotation offset
   */
  draw(ctx, rotation) {
    this.particles.forEach(p => p.draw(ctx, rotation));
  }

  /**
   * Change particle count dynamically
   */
  setParticleCount(count) {
    this.particles = [];
    for (let i = 0; i < count; i++) {
      this.particles.push(new Particle(this.spiral, i, count));
    }
    console.log(`✨ Particle count changed to ${count}`);
  }

  /**
   * Get particle info for debugging
   */
  getInfo() {
    return {
      count: this.particles.length,
      avgOpacity: (
        this.particles.reduce((sum, p) => sum + p.baseOpacity, 0) /
        this.particles.length
      ).toFixed(2),
      avgSpeed: (
        this.particles.reduce((sum, p) => sum + p.speed, 0) / this.particles.length
      ).toFixed(4),
      avgSize: (
        this.particles.reduce((sum, p) => sum + p.size, 0) / this.particles.length
      ).toFixed(2)
    };
  }
}
