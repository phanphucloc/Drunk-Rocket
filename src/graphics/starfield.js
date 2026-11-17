/**
 * Parallax 2-Layer Starfield Background with Dynamic Tier Color Shifting
 */
export class Starfield {
  constructor(width = 400, height = 700) {
    this.width = width;
    this.height = height;

    this.layer1 = []; // Distant stars
    this.layer2 = []; // Near stars

    // Smooth background color interpolation
    this.currentBgRgb = [11, 14, 20];
    this.targetBgRgb = [11, 14, 20];
    this.starColor1 = '#283256';
    this.starColor2 = '#00f0ff';

    this._initStars();
  }

  setTheme(theme) {
    if (!theme) return;
    if (theme.bgRgb) {
      this.targetBgRgb = [...theme.bgRgb];
    }
    if (theme.starColor1) {
      this.starColor1 = theme.starColor1;
    }
    if (theme.starColor2) {
      this.starColor2 = theme.starColor2;
    }
  }

  _initStars() {
    this.layer1 = [];
    this.layer2 = [];

    // Layer 1: 45 stars
    for (let i = 0; i < 45; i++) {
      this.layer1.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: Math.random() > 0.5 ? 1 : 1.5,
        speed: 25 + Math.random() * 15
      });
    }

    // Layer 2: 25 bright near stars
    for (let i = 0; i < 25; i++) {
      this.layer2.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: 2,
        speed: 70 + Math.random() * 30,
        twinkle: Math.random() * Math.PI * 2
      });
    }
  }

  resize(w, h) {
    this.width = w;
    this.height = h;
    this._initStars();
  }

  update(dt) {
    // Smooth lerp background color toward target tier RGB
    for (let c = 0; c < 3; c++) {
      const diff = this.targetBgRgb[c] - this.currentBgRgb[c];
      if (Math.abs(diff) > 0.5) {
        this.currentBgRgb[c] += diff * Math.min(1, dt * 2.5);
      } else {
        this.currentBgRgb[c] = this.targetBgRgb[c];
      }
    }

    // Update layer 1
    for (const s of this.layer1) {
      s.x -= s.speed * dt;
      if (s.x < 0) {
        s.x = this.width;
        s.y = Math.random() * this.height;
      }
    }

    // Update layer 2
    for (const s of this.layer2) {
      s.x -= s.speed * dt;
      s.twinkle += dt * 5;
      if (s.x < 0) {
        s.x = this.width;
        s.y = Math.random() * this.height;
      }
    }
  }

  draw(ctx) {
    // Dynamic Void Tint
    const r = Math.round(this.currentBgRgb[0]);
    const g = Math.round(this.currentBgRgb[1]);
    const b = Math.round(this.currentBgRgb[2]);
    ctx.fillStyle = `rgb(${r},${g},${b})`;
    ctx.fillRect(0, 0, this.width, this.height);

    // Draw layer 1 (Distant stars)
    ctx.fillStyle = this.starColor1;
    for (const s of this.layer1) {
      ctx.fillRect(Math.floor(s.x), Math.floor(s.y), s.size, s.size);
    }

    // Draw layer 2 (Near twinkling stars)
    ctx.fillStyle = this.starColor2;
    for (const s of this.layer2) {
      const alpha = 0.5 + 0.5 * Math.sin(s.twinkle);
      ctx.globalAlpha = alpha;
      ctx.fillRect(Math.floor(s.x), Math.floor(s.y), s.size, s.size);
    }
    ctx.globalAlpha = 1.0;
  }
}
