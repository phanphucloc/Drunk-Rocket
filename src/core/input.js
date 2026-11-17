/**
 * Input Manager for Drunk Rocket
 * Handles Touch, Mouse, and Keyboard events with zero latency.
 */
export class InputManager {
  constructor(targetElement = window) {
    this.targetElement = targetElement;
    this.justPressed = false;
    this.isPressed = false;
    this.lastTapTime = 0;

    this._onKeyDown = this._onKeyDown.bind(this);
    this._onKeyUp = this._onKeyUp.bind(this);
    this._onPointerDown = this._onPointerDown.bind(this);
    this._onPointerUp = this._onPointerUp.bind(this);

    this._bindEvents();
  }

  _bindEvents() {
    window.addEventListener('keydown', this._onKeyDown, { passive: false });
    window.addEventListener('keyup', this._onKeyUp, { passive: false });

    // Pointer events handle both mouse and touch efficiently
    this.targetElement.addEventListener('pointerdown', this._onPointerDown, { passive: false });
    window.addEventListener('pointerup', this._onPointerUp, { passive: false });
    window.addEventListener('pointercancel', this._onPointerUp, { passive: false });
  }

  _onKeyDown(e) {
    if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
      e.preventDefault();
      if (!this.isPressed) {
        this.justPressed = true;
      }
      this.isPressed = true;
    }
  }

  _onKeyUp(e) {
    if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
      this.isPressed = false;
    }
  }

  _onPointerDown(e) {
    e.preventDefault();
    if (!this.isPressed) {
      this.justPressed = true;
    }
    this.isPressed = true;
    this.lastTapTime = performance.now();
  }

  _onPointerUp(e) {
    this.isPressed = false;
  }

  /**
   * Consumes and returns true if an input tap occurred since last check.
   */
  consumeTap() {
    if (this.justPressed) {
      this.justPressed = false;
      return true;
    }
    return false;
  }

  isDown() {
    return this.isPressed;
  }

  destroy() {
    window.removeEventListener('keydown', this._onKeyDown);
    window.removeEventListener('keyup', this._onKeyUp);
    this.targetElement.removeEventListener('pointerdown', this._onPointerDown);
    window.removeEventListener('pointerup', this._onPointerUp);
    window.removeEventListener('pointercancel', this._onPointerUp);
  }
}
