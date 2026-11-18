import { Game } from './core/game.js';

window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('game-canvas');
  if (!canvas) {
    console.error('Không tìm thấy #game-canvas');
    return;
  }

  const game = new Game(canvas);
  game.start();
  window.game = game;

  console.log('🚀 Drunk Rocket Engine v1.0.0 started. Target: 60 FPS.');
});
