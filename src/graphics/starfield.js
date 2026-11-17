/**
 * Parallax 2-Layer Starfield Background
 */
export class Starfield {
  constructor(width = 400, height = 700) {
    this.width = width;
    this.height = height;

    this.layer1 = []; // Distant stars
    this.layer2 = []; // Near stars

    this._initStars();
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
        color: '#283256',
        speed: 25 + Math.random() * 15
      });
    }

    // Layer 2: 25 bright near stars
    for (let i = 0; i < 25; i++) {
      this.layer2.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: 2,
        color: Math.random() > 0.3 ? '#ffffff' : '#00f0ff',
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
    // Background deep void
    ctx.fillStyle = '#0b0e14';
    ctx.fillRect(0, 0, this.width, this.height);

    // Draw layer 1
    for (const s of this.layer1) {
      ctx.fillStyle = s.color;
      ctx.fillRect(Math.floor(s.x), Math.floor(s.y), s.size, s.size);
    }

    // Draw layer 2
    for (const s of this.layer2) {
      const alpha = 0.6 + 0.4 * Math.sin(s.twinkle);
      ctx.fillStyle = s.color;
      ctx.globalAlpha = alpha;
      ctx.fillRect(Math.floor(s.x), Math.floor(s.y), s.size, s.size);
    }
    ctx.globalAlpha = 1.0;
  }
}
