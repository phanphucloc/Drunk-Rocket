import { PhysicsEngine } from '../core/physics.js';

export class Rocket {
  constructor(startX = 100, startY = 320) {
    this.startX = startX;
    this.startY = startY;
    this.radius = 12; // Fair circular collision radius (body is ~32x22)
    this.width = 34;
    this.height = 22;

    this.reset();
  }

  reset() {
    this.x = this.startX;
    this.y = this.startY;
    this.vx = 0;
    this.vy = 0;
    this.angle = 0;
    this.isDead = false;
    this.isThrusting = false;
    this.thrustTimer = 0;

    // Drunk eyes pupil wobble offsets
    this.pupilX = 0;
    this.pupilY = 0;
  }

  update(dt, hasThrust, totalTime) {
    if (this.isDead) return;

    // Run physics integration
    PhysicsEngine.updateRocket(this, dt, hasThrust, totalTime);

    // Animate goofy drunk pupils
    this.pupilX = Math.sin(totalTime * 8) * 2.2;
    this.pupilY = Math.cos(totalTime * 7) * 2.0;
  }

  die() {
    this.isDead = true;
    this.isThrusting = false;
  }
}
