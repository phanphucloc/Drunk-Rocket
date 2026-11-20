// Kiểm tra tĩnh: import mọi module, đối chiếu i18n, dữ liệu theme, tìm mã chết.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = 'D:/project/game/Drunk-Rocket';
const problems = [];
const notes = [];

// ---------------------------------------------------------------- 1) i18n
const i18nSrc = fs.readFileSync(path.join(ROOT, 'src/i18n.js'), 'utf8');
const viBlock = i18nSrc.slice(i18nSrc.indexOf('  vi: {'), i18nSrc.indexOf('  en: {'));
const enBlock = i18nSrc.slice(i18nSrc.indexOf('  en: {'), i18nSrc.indexOf('let current'));

const keysOf = (block) => new Set([...block.matchAll(/'([a-zA-Z0-9_.]+)':/g)].map(m => m[1]));
const viKeys = keysOf(viBlock);
const enKeys = keysOf(enBlock);

const missingEn = [...viKeys].filter(k => !enKeys.has(k));
const missingVi = [...enKeys].filter(k => !viKeys.has(k));
if (missingEn.length) problems.push(`i18n: thiếu bản EN cho: ${missingEn.join(', ')}`);
if (missingVi.length) problems.push(`i18n: thiếu bản VI cho: ${missingVi.join(', ')}`);

// khoá được dùng trong code
const files = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith('.js')) files.push(p);
  }
})(path.join(ROOT, 'src'));

const usedKeys = new Set();
for (const f of files) {
  const src = fs.readFileSync(f, 'utf8');
  for (const m of src.matchAll(/\bt\(\s*'([a-zA-Z0-9_.]+)'/g)) usedKeys.add(m[1]);
  for (const m of src.matchAll(/data-i18n(?:-title)?="([a-zA-Z0-9_.]+)"/g)) usedKeys.add(m[1]);
}
const missingKeys = [...usedKeys].filter(k => !viKeys.has(k));
if (missingKeys.length) problems.push(`i18n: khoá dùng trong code nhưng chưa định nghĩa: ${missingKeys.join(', ')}`);

// khoá định nghĩa nhưng không dùng (chỉ ghi chú)
const unusedKeys = [...viKeys].filter(k => !usedKeys.has(k) && !/^(weather|rank|kite)\./.test(k));
if (unusedKeys.length) notes.push(`i18n: khoá không dùng: ${unusedKeys.slice(0, 12).join(', ')}${unusedKeys.length > 12 ? '…' : ''}`);

// ---------------------------------------------------------------- 2) theme data
const themes = await import(pathToFileURL(path.join(ROOT, 'src/graphics/themes.js')).href);
const REQUIRED = ['name', 'weatherStage', 'editorialIssue', 'editorialDesc', 'descEn', 'windEn', 'story', 'storyEn', 'facts', 'factsEn', 'music', 'laserColor', 'laserGlow', 'emitterCore'];
for (const t of Object.values(themes.TIER_THEMES)) {
  const missing = REQUIRED.filter(k => t[k] === undefined || t[k] === null);
  if (missing.length) problems.push(`theme tier ${t.tier} (${t.name}): thiếu ${missing.join(', ')}`);
  if (t.facts && t.facts.length < 2) problems.push(`theme tier ${t.tier}: facts quá ít`);
  if (t.music && (!t.music.scale || !t.music.root)) problems.push(`theme tier ${t.tier}: music thiếu scale/root`);
}

// ---------------------------------------------------------------- 3) import mọi module
const modules = files.filter(f => !f.includes('main.js')); // main cần DOM
for (const f of modules) {
  try {
    await import(pathToFileURL(f).href);
  } catch (e) {
    problems.push(`import lỗi: ${path.relative(ROOT, f)} → ${e.message.split('\n')[0]}`);
  }
}
notes.push(`Đã import ${modules.length} module.`);

// ---------------------------------------------------------------- 4) mã chết / dọn dẹp
const deadChecks = [
  ['src/ui/storyOverlay.js', 'showChapter(', 'storyOverlay.showChapter không còn được gọi (chỉ còn showEnding?)'],
];
const gameSrc = fs.readFileSync(path.join(ROOT, 'src/core/game.js'), 'utf8');
if (!gameSrc.includes('story.showChapter')) notes.push('game.js: showChapter không dùng → storyOverlay chỉ còn là mã dự phòng');
if (gameSrc.includes('dragonCelebrated')) notes.push('game.js: cờ dragonCelebrated còn nhưng không còn tác dụng');
if (gameSrc.includes('introShown')) notes.push('game.js: cờ introShown còn nhưng không còn tác dụng');

let consoleCount = 0;
for (const f of files) {
  const src = fs.readFileSync(f, 'utf8');
  consoleCount += (src.match(/console\.(log|warn|debug)\(/g) || []).length;
}
notes.push(`console.log/warn còn ${consoleCount} chỗ.`);

// ---------------------------------------------------------------- báo cáo
console.log('=== VẤN ĐỀ ===');
console.log(problems.length ? problems.map(p => '  ✗ ' + p).join('\n') : '  (không có)');
console.log('\n=== GHI CHÚ ===');
console.log(notes.map(n => '  • ' + n).join('\n'));
