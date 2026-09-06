/**
 * Spiral Rendering Logic
 *
 * Draws a rotating Archimedean spiral using Canvas.
 *
 * Spiral equation: r = a + b*θ
 * where:
 *   r = distance from center
 *   θ = angle in radians
 *   a = inner radius
 *   b = spacing between spiral arms
 */

class Spiral {
  constructor(ctx, width, height) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.centerX = width / 2;
    this.centerY = height / 2;

    // Spiral parameters
    this.a = 50; // Inner radius
    this.b = 80; // Spacing between arms
    this.maxTheta = 8 * Math.PI; // Number of rotations (2.5 full rotations)

    // Visual parameters
    this.armCount = 2; // Number of visible spiral arms
    this.strokeWidth = 2;
    this.opacity = 0.4;
    this.color = '#8b5cf6'; // Purple
  }

  /**
   * Draw the spiral at a given rotation offset
   * @param {number} rotation - Rotation angle in radians
   */
  draw(rotation) {
    this.ctx.strokeStyle = `rgba(139, 92, 246, ${this.opacity})`;
    this.ctx.lineWidth = this.strokeWidth;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';

    // Draw multiple spiral arms
    for (let arm = 0; arm < this.armCount; arm++) {
      const armOffset = arm * (this.maxTheta / this.armCount);

      this.ctx.beginPath();

      for (let theta = 0; theta < this.maxTheta; theta += 0.05) {
        // Archimedean spiral equation
        const r = this.a + this.b * (theta / this.maxTheta) * 10;
        const angle = theta + rotation + armOffset;

        const x = this.centerX + r * Math.cos(angle);
        const y = this.centerY + r * Math.sin(angle);

        if (theta === 0) {
          this.ctx.moveTo(x, y);
        } else {
          this.ctx.lineTo(x, y);
        }
      }

      this.ctx.stroke();
    }
  }

  /**
   * Get point on spiral at theta position
   * Used later for positioning planets on the spiral
   * @param {number} theta - Position on spiral (0 to maxTheta)
   * @param {number} rotation - Current rotation
   * @returns {object} {x, y} coordinates
   */
  getPointAt(theta, rotation) {
    const r = this.a + this.b * (theta / this.maxTheta) * 10;
    const angle = theta + rotation;

    return {
      x: this.centerX + r * Math.cos(angle),
      y: this.centerY + r * Math.sin(angle),
      r: r,
      angle: angle
    };
  }

  /**
   * Get info about the spiral for debugging
   */
  getInfo() {
    return {
      centerX: this.centerX,
      centerY: this.centerY,
      innerRadius: this.a,
      spacing: this.b,
      maxTheta: this.maxTheta,
      armCount: this.armCount,
      maxRadius: this.a + this.b * 10
    };
  }
}
