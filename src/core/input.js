/**
 * Input Manager for Drunk Rocket 2.0
 * Handles Responsive Tap (Thrust) and Double Tap (Supernova Smash)
 */
export class InputManager {
  constructor(targetElement = window) {
    this.targetElement = targetElement;
    this.justPressed = false;
    this.doubleTapped = false;      // giữ cho tương thích (không còn dùng để Smash)
    this.isPressed = false;
    this.lastTapTime = 0;
    this.doubleTapThreshold = 280;

    // Lộng Gió bằng NHẤN GIỮ: giữ >= HOLD_MS thì kích hoạt (tap thường ~50-110ms)
    this.HOLD_MS = 235;
    this.holdStart = 0;
    this.holdProgress = 0;          // 0..1 để vẽ vòng nạp quanh diều
    this.smashRequested = false;
    this._holdArmed = false;

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

  /** Ngắt trạng thái giữ (dùng khi chọn thẻ bùa / bấm quả cầu). */
  resetHold() {
    this.isPressed = false;
    this._holdArmed = false;
    this.holdProgress = 0;
    this.smashRequested = false;
  }

  consumeSmash() {
    if (!this.smashRequested) return false;
    this.smashRequested = false;
    return true;
  }

  /** Cập nhật tiến trình giữ tay (gọi mỗi frame). */
  updateHold(dt) {
    if (!this.isPressed || !this._holdArmed) {
      this.holdProgress = 0;
      return;
    }
    const held = performance.now() - this.holdStart;
    this.holdProgress = Math.max(0, Math.min(1, held / this.HOLD_MS));
    if (held >= this.HOLD_MS) {
      this.smashRequested = true;
      this.holdProgress = 1;
      this._holdArmed = false;      // chỉ kích hoạt 1 lần cho mỗi lần giữ
    }
  }

  _handleTap() {
    const now = performance.now();
    const timeDiff = now - this.lastTapTime;

    // Luôn ghi nhận là 1 cú tap để đẩy tàu bay lên, không bao giờ bị nuốt phím
    this.justPressed = true;

    // Nếu khoảng cách giữa 2 lần bấm từ 20ms đến 280ms -> ghi nhận thêm Double Tap
    if (timeDiff > 20 && timeDiff <= this.doubleTapThreshold) {
      this.doubleTapped = true;
    }
    this.lastTapTime = now;
  }

  _onKeyDown(e) {
    // Phím tắt Lộng Gió trên PC
    if (e.code === 'ShiftLeft' || e.code === 'ShiftRight' || e.code === 'KeyE') {
      e.preventDefault();
      if (!e.repeat) this.smashRequested = true;
      return;
    }

    if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
      e.preventDefault();
      // Ngăn keydown auto-repeat của hệ điều hành làm spam phím, nhưng cho phép nhấp nhả nhanh
      if (!e.repeat) {
        this._handleTap();
        // Giữ Space/W để Lộng Gió (giống nhấn giữ trên mobile)
        this.isPressed = true;
        this.holdStart = performance.now();
        this._holdArmed = true;
      }
    }
  }

  _onKeyUp(e) {
    if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
      this.isPressed = false;
      this._holdArmed = false;
      this.holdProgress = 0;
    }
  }

  _onPointerDown(e) {
    this.isPressed = true;
    this.holdStart = performance.now();
    this._holdArmed = true;

    e.preventDefault();
    this._handleTap();
    this.isPressed = true;
  }

  _onPointerUp(e) {
    this.isPressed = false;
    this._holdArmed = false;
    this.holdProgress = 0;

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
