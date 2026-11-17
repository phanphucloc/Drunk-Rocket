/**
 * Input Manager for Drunk Rocket 2.0
 * Handles Single Tap (Thrust) and Double Tap (Supernova Smash)
 */
export class InputManager {
  constructor(targetElement = window) {
    this.targetElement = targetElement;
    this.justPressed = false;
    this.doubleTapped = false;
    this.isPressed = false;
    this.lastTapTime = 0;
    this.doubleTapThreshold = 280; // ms between taps to trigger Double Tap

    this._onKeyDown = this._onKeyDown.bind(this);
    this._onKeyUp = this._onKeyUp.bind(this);
    this._onPointerDown = this._onPointerDown.bind(this);
    this._onPointerUp = this._onPointerUp.bind(this);

    this._bindEvents();
  }

  _bindEvents() {
    window.addEventListener('keydown', this._onKeyDown, { passive: false });
    window.addEventListener('keyup', this._onKeyUp, { passive: false });

    this.targetElement.addEventListener('pointerdown', this._onPointerDown, { passive: false });
    window.addEventListener('pointerup', this._onPointerUp, { passive: false });
    window.addEventListener('pointercancel', this._onPointerUp, { passive: false });
  }

  _handleTap() {
    const now = performance.now();
    const timeDiff = now - this.lastTapTime;

    if (timeDiff > 30 && timeDiff <= this.doubleTapThreshold) {
      this.doubleTapped = true;
      this.justPressed = false;
    } else {
      this.justPressed = true;
    }
    this.lastTapTime = now;
  }

  _onKeyDown(e) {
    if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
      e.preventDefault();
      if (!this.isPressed) {
        this._handleTap();
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
      this._handleTap();
    }
    this.isPressed = true;
  }

  _onPointerUp(e) {
    this.isPressed = false;
  }

  consumeTap() {
    if (this.justPressed) {
      this.justPressed = false;
      return true;
    }
    return false;
  }

  consumeDoubleTap() {
    if (this.doubleTapped) {
      this.doubleTapped = false;
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