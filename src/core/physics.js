/**
 * Drunk Physics Engine
 * Implements asymmetrical gravity (down-left drift) and angled thrust (up-right impulse),
 * coupled with drunken angular inertia and wobble.
 */
export const PHYSICS_CONFIG = {
  // Gravity
  GRAVITY_Y: 1050,         // Vertical downward acceleration (px/s^2)
  GRAVITY_X: -140,         // Leftward drift acceleration (px/s^2)

  // Thrust Impulse
  THRUST_VY: -350,         // Upward velocity impulse on tap (px/s)
  THRUST_VX: 130,          // Rightward forward surge on tap (px/s)
  MAX_VY: 600,             // Terminal downward velocity
  MIN_VY: -450,            // Terminal upward velocity

  // Horizontal boundaries & damping
  BASE_X: 100,             // Natural equilibrium X position
  MIN_X: 45,               // Left screen boundary threshold
  MAX_X: 200,              // Right screen boundary threshold
  DRAG_X: 3.5,             // Horizontal aerodynamic damping

  // Angular kinematics
  THRUST_ANGLE: -0.60,     // ~ -35 degrees (nose up-right on thrust)
  FALL_ANGLE_MAX: 0.85,    // ~ +48 degrees (nose down-left when dropping)
  ROTATION_SPEED: 4.5,     // Speed of rotating toward target fall angle

  // Drunk wobble
  WOBBLE_FREQ: 5.5,        // Sinusoidal wobble frequency (rad/s)
  WOBBLE_AMP: 35,          // Wobble velocity amplitude (px/s)
};

export class PhysicsEngine {
  /**
   * Applies one physics update tick to the rocket.
   * @param {Rocket} rocket
   * @param {number} dt Delta time in seconds
   * @param {boolean} hasThrust Whether a tap thrust occurred this frame
   * @param {number} totalTime Game elapsed time in seconds
   */
  static updateRocket(rocket, dt, hasThrust, totalTime) {
    if (rocket.isDead) return;

    if (hasThrust) {
      // Apply angled thrust: upwards and slightly to the right
      rocket.vy = PHYSICS_CONFIG.THRUST_VY;
      rocket.vx = Math.min(rocket.vx + PHYSICS_CONFIG.THRUST_VX, 180);
      rocket.angle = PHYSICS_CONFIG.THRUST_ANGLE;
      rocket.isThrusting = true;
      rocket.thrustTimer = 0.12; // Visual flame duration
    } else {
      // Natural gravitational acceleration
      rocket.vy += PHYSICS_CONFIG.GRAVITY_Y * dt;
      rocket.vx += PHYSICS_CONFIG.GRAVITY_X * dt;

      // Add drunken wobble to horizontal velocity
      const wobble = Math.sin(totalTime * PHYSICS_CONFIG.WOBBLE_FREQ) * PHYSICS_CONFIG.WOBBLE_AMP;
      rocket.vx += wobble * dt;

      // Restoring force toward base X so rocket never gets permanently lost off-screen
      const displacement = rocket.x - PHYSICS_CONFIG.BASE_X;
      rocket.vx -= displacement * 1.8 * dt;

      // Apply horizontal drag
      rocket.vx -= rocket.vx * PHYSICS_CONFIG.DRAG_X * dt;

      // Update rotation (tilts downward as it falls)
      if (rocket.angle < PHYSICS_CONFIG.FALL_ANGLE_MAX) {
        rocket.angle += PHYSICS_CONFIG.ROTATION_SPEED * dt;
      }

      if (rocket.thrustTimer > 0) {
        rocket.thrustTimer -= dt;
        if (rocket.thrustTimer <= 0) {
          rocket.isThrusting = false;
        }
      }
    }

    // Clamp vertical velocity
    if (rocket.vy > PHYSICS_CONFIG.MAX_VY) rocket.vy = PHYSICS_CONFIG.MAX_VY;
    if (rocket.vy < PHYSICS_CONFIG.MIN_VY) rocket.vy = PHYSICS_CONFIG.MIN_VY;

    // Integrate positions
    rocket.x += rocket.vx * dt;
    rocket.y += rocket.vy * dt;

    // Clamp horizontal position inside playable lane
    if (rocket.x < PHYSICS_CONFIG.MIN_X) {
      rocket.x = PHYSICS_CONFIG.MIN_X;
      rocket.vx = 0;
    } else if (rocket.x > PHYSICS_CONFIG.MAX_X) {
      rocket.x = PHYSICS_CONFIG.MAX_X;
      rocket.vx = 0;
    }
  }

  /**
   * Circle vs AABB Collision Check (Pixel-perfect fair hitbox).
   * @param {number} cx Circle X
   * @param {number} cy Circle Y
   * @param {number} cr Circle Radius
   * @param {number} rx Box X
   * @param {number} ry Box Y
   * @param {number} rw Box Width
   * @param {number} rh Box Height
   * @returns {boolean}
   */
  static checkCircleAABB(cx, cy, cr, rx, ry, rw, rh) {
    const closestX = Math.max(rx, Math.min(cx, rx + rw));
    const closestY = Math.max(ry, Math.min(cy, ry + rh));

    const distanceX = cx - closestX;
    const distanceY = cy - closestY;

    return (distanceX * distanceX + distanceY * distanceY) < (cr * cr);
  }
}
