import { PhysicsEngine, PHYSICS_CONFIG } from '../core/physics.js';

export class Rocket {
  constructor(startX = 100, startY = 320) {
    this.startX = startX;
    this.startY = startY;
    this.radius = 12; // Fair circular collision radius (body is ~32x22)
    this.width = 34;
    this.height = 22;

    this.reset();
  }

  get rotation() {
    return this.angle;
  }

  set rotation(val) {
    this.angle = val;
  }

  reset(x = this.startX, y = this.startY) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.angle = 0;
    this.isDead = false;
    this.isThrusting = false;
    this.thrustTimer = 0;
    this.thrustPending = false;

    // Drunk eyes pupil wobble offsets
    this.pupilX = 0;
    this.pupilY = 0;
  }

  thrust() {
    this.thrustPending = true;
    this.vy = PHYSICS_CONFIG.THRUST_VY;
    this.vx = Math.min(this.vx + PHYSICS_CONFIG.THRUST_VX, 180);
    this.angle = PHYSICS_CONFIG.THRUST_ANGLE;
    this.isThrusting = true;
    this.thrustTimer = 0.14;
  }

  update(dt, hasThrust = false, totalTime = 0) {
    if (this.isDead) return;

    const thrustActive = hasThrust || this.thrustPending;
    this.thrustPending = false;

    // Run physics integration
    PhysicsEngine.updateRocket(this, dt, thrustActive, totalTime);

    // Animate goofy drunk pupils
    this.pupilX = Math.sin(totalTime * 8) * 2.2;
    this.pupilY = Math.cos(totalTime * 7) * 2.0;
  }

  die() {
    this.isDead = true;
    this.isThrusting = false;
  }
}
