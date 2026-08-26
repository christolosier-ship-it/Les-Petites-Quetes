import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const upstream = join(root, 'vendor', 'beyond-fable');
const workspace = join(root, '.generated', 'beyond-fable');
const output = join(root, 'public', 'games', 'beyond-fable');

function fail(message) {
  console.error(`[beyond-fable] ${message}`);
  process.exit(1);
}

function read(path) {
  return readFileSync(path, 'utf8');
}

function write(path, content) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content);
}

function replaceExact(path, before, after, expected = 1) {
  const source = read(path);
  const count = source.split(before).length - 1;
  if (count !== expected) fail(`Patch inattendu dans ${path}: ${count}/${expected} occurrences.`);
  write(path, source.split(before).join(after));
}

function run(command, args, cwd) {
  const executable = process.platform === 'win32' && command === 'npm' ? 'npm.cmd' : command;
  const result = spawnSync(executable, args, { cwd, stdio: 'inherit' });
  if (result.status !== 0) fail(`${command} ${args.join(' ')} a échoué (${result.status ?? 'signal'}).`);
}

if (!existsSync(join(upstream, 'package.json'))) {
  fail('Le sous-module vendor/beyond-fable est absent. Initialisez les sous-modules Git avant le build.');
}

rmSync(workspace, { recursive: true, force: true });
rmSync(output, { recursive: true, force: true });
mkdirSync(dirname(workspace), { recursive: true });
cpSync(upstream, workspace, { recursive: true });
rmSync(join(workspace, '.git'), { recursive: true, force: true });

const cameraPath = join(workspace, 'src', 'core', 'CameraController.ts');
replaceExact(
  cameraPath,
  '  private pointerLocked = false;\n',
  `  private pointerLocked = false;\n  private touchActive = false;\n  private touchMove = new THREE.Vector2();\n  private touchSprint = false;\n  private touchJump = false;\n  private touchDown = false;\n`,
);
replaceExact(
  cameraPath,
  '  /** Place the player on the ground at a world position. */\n',
  `  enableTouchMode(): void {\n    this.touchActive = true;\n  }\n\n  setTouchMove(x: number, y: number): void {\n    this.touchMove.set(clamp(x, -1, 1), clamp(y, -1, 1));\n  }\n\n  setTouchSprint(active: boolean): void {\n    this.touchSprint = active;\n  }\n\n  setTouchJump(active: boolean): void {\n    this.touchJump = active;\n  }\n\n  setTouchDown(active: boolean): void {\n    this.touchDown = active;\n  }\n\n  addTouchLook(deltaX: number, deltaY: number): void {\n    if (!this.touchActive) return;\n    this.yaw -= deltaX * PLAYER.mouseSensitivity * 1.25;\n    this.pitch -= deltaY * PLAYER.mouseSensitivity * 1.25;\n    this.pitch = clamp(this.pitch, -Math.PI / 2 + 0.01, Math.PI / 2 - 0.01);\n  }\n\n  isTouchMoving(): boolean {\n    return this.touchActive && this.touchMove.lengthSq() > 0.0025;\n  }\n\n  /** Place the player on the ground at a world position. */\n`,
);
replaceExact(cameraPath, 'if (e.code === \'KeyF\' && this.pointerLocked)', "if (e.code === 'KeyF' && (this.pointerLocked || this.touchActive))");
replaceExact(cameraPath, '    if (this.pointerLocked) {', '    if (this.pointerLocked || this.touchActive) {', 3);
replaceExact(
  cameraPath,
  `    }\n    const moving = this.wishDir.lengthSq() > 0;\n`,
  `    }\n    if (this.touchActive) {\n      this.wishDir.addScaledVector(this.forward, this.touchMove.y);\n      this.wishDir.addScaledVector(this.right, this.touchMove.x);\n    }\n    const moving = this.wishDir.lengthSq() > 0;\n`,
);
replaceExact(
  cameraPath,
  `    }\n    if (this.wishDir.lengthSq() > 0) this.wishDir.normalize();\n`,
  `    }\n    if (this.touchActive) {\n      this.wishDir.addScaledVector(this.forward, this.touchMove.y);\n      this.wishDir.addScaledVector(this.right, this.touchMove.x);\n      if (this.touchJump) this.wishDir.y += 1;\n      if (this.touchDown) this.wishDir.y -= 1;\n    }\n    if (this.wishDir.lengthSq() > 0) this.wishDir.normalize();\n`,
  2,
);
replaceExact(
  cameraPath,
  `    const sprinting = this.keys.has('ShiftLeft') || this.keys.has('ShiftRight');`,
  `    const sprinting = this.keys.has('ShiftLeft') || this.keys.has('ShiftRight') || (this.touchActive && this.touchSprint);`,
  3,
);
replaceExact(
  cameraPath,
  `    if (this.grounded && this.pointerLocked && this.keys.has('Space')) {`,
  `    if (\n      this.grounded &&\n      (this.pointerLocked || this.touchActive) &&\n      (this.keys.has('Space') || (this.touchActive && this.touchJump))\n    ) {`,
);

const gamePath = join(workspace, 'src', 'core', 'Game.ts');
replaceExact(gamePath, '  private world: World;\n', '  readonly world: World;\n');
replaceExact(gamePath, '  private controller: CameraController;\n', '  readonly controller: CameraController;\n');
replaceExact(gamePath, '  private hud: Hud;\n', '  readonly hud: Hud;\n');
replaceExact(
  gamePath,
  `      this.controller.isKeyDown('KeyS') ||\n      this.controller.isKeyDown('KeyD');`,
  `      this.controller.isKeyDown('KeyS') ||\n      this.controller.isKeyDown('KeyD') ||\n      this.controller.isTouchMoving();`,
);

const configPath = join(workspace, 'src', 'config.ts');
replaceExact(
  configPath,
  `export function detectQuality(): QualityLevel {\n  const cores = navigator.hardwareConcurrency ?? 4;\n  const memory = (navigator as unknown as { deviceMemory?: number }).deviceMemory ?? 8;`,
  `export function detectQuality(): QualityLevel {\n  const cores = navigator.hardwareConcurrency ?? 4;\n  const touchDevice = navigator.maxTouchPoints > 0 || window.matchMedia('(pointer: coarse)').matches;\n  if (touchDevice) return cores >= 6 ? 'medium' : 'low';\n  const memory = (navigator as unknown as { deviceMemory?: number }).deviceMemory ?? 8;`,
);

const vitePath = join(workspace, 'vite.config.ts');
replaceExact(vitePath, 'export default defineConfig({\n', "export default defineConfig({\n  base: './',\n");

const touchMain = `import { Game } from './core/Game';\nimport { generateRandomSeed, getSeedFromUrl } from './utils/Random';\nimport './touch.css';\n\nconst seed = getSeedFromUrl() ?? generateRandomSeed();\nconst params = new URLSearchParams(window.location.search);\nconst touchCapable = navigator.maxTouchPoints > 0 || window.matchMedia('(pointer: coarse)').matches;\nconst game = new Game(seed);\n\nfunction tapKey(code: string): void {\n  document.dispatchEvent(new KeyboardEvent('keydown', { code, bubbles: true, cancelable: true }));\n  document.dispatchEvent(new KeyboardEvent('keyup', { code, bubbles: true, cancelable: true }));\n}\n\nfunction requireElement<T extends HTMLElement>(selector: string): T {\n  const element = document.querySelector<T>(selector);\n  if (!element) throw new Error(\`Beyond Fable touch UI: élément introuvable \${selector}\`);\n  return element;\n}\n\nfunction installTouchControls(): void {\n  document.body.classList.add('bf-touch-mode');\n  const controls = document.createElement('div');\n  controls.id = 'bf-touch-controls';\n  controls.innerHTML = \`\n    <div class="bf-touch-look" aria-label="Zone tactile pour regarder autour de soi"></div>\n    <div class="bf-touch-joystick" aria-label="Joystick de déplacement"><span class="bf-touch-stick"></span></div>\n    <div class="bf-touch-actions">\n      <button type="button" data-hold="jump" aria-label="Sauter ou monter">↑</button>\n      <button type="button" data-tap="KeyE">Action</button>\n      <button type="button" data-hold="sprint">Courir</button>\n      <button type="button" data-tap="KeyF">Vol</button>\n      <button type="button" data-hold="down" aria-label="Descendre">↓</button>\n    </div>\n    <div class="bf-touch-utility">\n      <button type="button" data-tap="KeyR">Météo</button>\n      <button type="button" data-tap="KeyT">HUD</button>\n      <button type="button" data-tap="Backquote">Réglages</button>\n    </div>\n  \`;\n  document.body.appendChild(controls);\n\n  const joystick = requireElement<HTMLDivElement>('.bf-touch-joystick');\n  const stick = requireElement<HTMLSpanElement>('.bf-touch-stick');\n  let joystickPointer: number | null = null;\n\n  const updateJoystick = (event: PointerEvent): void => {\n    const rect = joystick.getBoundingClientRect();\n    const radius = Math.max(1, Math.min(rect.width, rect.height) * 0.36);\n    let dx = event.clientX - (rect.left + rect.width / 2);\n    let dy = event.clientY - (rect.top + rect.height / 2);\n    const length = Math.hypot(dx, dy);\n    if (length > radius) {\n      dx = (dx / length) * radius;\n      dy = (dy / length) * radius;\n    }\n    stick.style.transform = \`translate(\${dx}px, \${dy}px)\`;\n    const x = Math.abs(dx / radius) < 0.12 ? 0 : dx / radius;\n    const y = Math.abs(dy / radius) < 0.12 ? 0 : -dy / radius;\n    game.controller.setTouchMove(x, y);\n  };\n\n  joystick.addEventListener('pointerdown', (event) => {\n    event.preventDefault();\n    joystickPointer = event.pointerId;\n    joystick.setPointerCapture(event.pointerId);\n    updateJoystick(event);\n  });\n  joystick.addEventListener('pointermove', (event) => {\n    if (event.pointerId === joystickPointer) updateJoystick(event);\n  });\n  const releaseJoystick = (event: PointerEvent): void => {\n    if (event.pointerId !== joystickPointer) return;\n    joystickPointer = null;\n    game.controller.setTouchMove(0, 0);\n    stick.style.transform = 'translate(0, 0)';\n  };\n  joystick.addEventListener('pointerup', releaseJoystick);\n  joystick.addEventListener('pointercancel', releaseJoystick);\n\n  const look = requireElement<HTMLDivElement>('.bf-touch-look');\n  let lookPointer: number | null = null;\n  let lookX = 0;\n  let lookY = 0;\n  look.addEventListener('pointerdown', (event) => {\n    event.preventDefault();\n    lookPointer = event.pointerId;\n    lookX = event.clientX;\n    lookY = event.clientY;\n    look.setPointerCapture(event.pointerId);\n  });\n  look.addEventListener('pointermove', (event) => {\n    if (event.pointerId !== lookPointer) return;\n    const dx = event.clientX - lookX;\n    const dy = event.clientY - lookY;\n    lookX = event.clientX;\n    lookY = event.clientY;\n    game.controller.addTouchLook(dx, dy);\n  });\n  const releaseLook = (event: PointerEvent): void => {\n    if (event.pointerId === lookPointer) lookPointer = null;\n  };\n  look.addEventListener('pointerup', releaseLook);\n  look.addEventListener('pointercancel', releaseLook);\n\n  document.querySelectorAll<HTMLButtonElement>('[data-tap]').forEach((button) => {\n    button.addEventListener('pointerdown', (event) => {\n      event.preventDefault();\n      const code = button.dataset.tap;\n      if (code) tapKey(code);\n    });\n  });\n  document.querySelectorAll<HTMLButtonElement>('[data-hold]').forEach((button) => {\n    const apply = (active: boolean): void => {\n      const action = button.dataset.hold;\n      if (action === 'jump') game.controller.setTouchJump(active);\n      if (action === 'sprint') game.controller.setTouchSprint(active);\n      if (action === 'down') game.controller.setTouchDown(active);\n      button.classList.toggle('active', active);\n    };\n    button.addEventListener('pointerdown', (event) => {\n      event.preventDefault();\n      button.setPointerCapture(event.pointerId);\n      apply(true);\n    });\n    button.addEventListener('pointerup', () => apply(false));\n    button.addEventListener('pointercancel', () => apply(false));\n  });\n\n  const hint = document.getElementById('hud-controls');\n  if (hint) hint.textContent = 'Joystick · Glisser pour regarder · Action · Courir · Saut · Vol · Réglages';\n\n  const prompt = document.getElementById('interact-prompt');\n  if (prompt) {\n    const translatePrompt = (): void => {\n      const text = prompt.textContent ?? '';\n      if (text.startsWith('Press E to inspect — ')) prompt.textContent = \`Action · \${text.slice(21)}\`;\n      else if (text === 'Press E to light the fire') prompt.textContent = 'Action · Allumer le feu';\n      else if (text === 'Press E to douse the fire') prompt.textContent = 'Action · Éteindre le feu';\n    };\n    new MutationObserver(translatePrompt).observe(prompt, { childList: true, characterData: true, subtree: true });\n  }\n}\n\nfunction runTouchIntro(): void {\n  const start = performance.now();\n  const tick = (): void => {\n    const elapsed = performance.now() - start;\n    const ready = elapsed >= 5000 || (elapsed >= 1200 && game.world.isNearContentReady());\n    if (ready) {\n      game.hud.loadingReady(() => {\n        game.controller.enableTouchMode();\n        document.body.classList.add('bf-touch-entered');\n        game.hud.hideStartOverlay();\n        game.hud.revealChrome();\n      });\n    } else {\n      requestAnimationFrame(tick);\n    }\n  };\n  requestAnimationFrame(tick);\n}\n\nif (params.has('noui')) {\n  document.getElementById('hud')!.style.display = 'none';\n  document.getElementById('loading-screen')!.style.display = 'none';\n} else if (touchCapable) {\n  installTouchControls();\n}\n\ngame.start();\nif (!params.has('noui')) {\n  if (touchCapable) runTouchIntro();\n  else game.runIntro();\n}\n`;
write(join(workspace, 'src', 'main.ts'), touchMain);

const touchCss = `
#bf-touch-controls { display: none; position: fixed; inset: 0; z-index: 9; pointer-events: none; font-family: system-ui, sans-serif; }
.bf-touch-mode #bf-touch-controls { display: block; }
.bf-touch-look { position: absolute; inset: 0; pointer-events: auto; touch-action: none; }
.bf-touch-joystick { position: absolute; left: max(22px, env(safe-area-inset-left)); bottom: max(24px, env(safe-area-inset-bottom)); width: 116px; height: 116px; border: 1px solid rgba(232,220,193,.36); border-radius: 50%; background: rgba(5,9,10,.34); box-shadow: inset 0 0 28px rgba(201,173,115,.08); pointer-events: auto; touch-action: none; }
.bf-touch-stick { position: absolute; left: 50%; top: 50%; width: 50px; height: 50px; margin: -25px; border-radius: 50%; background: rgba(230,207,149,.34); border: 1px solid rgba(230,207,149,.68); box-shadow: 0 3px 18px rgba(0,0,0,.45); }
.bf-touch-actions { position: absolute; right: max(18px, env(safe-area-inset-right)); bottom: max(18px, env(safe-area-inset-bottom)); display: grid; grid-template-columns: repeat(3, minmax(52px, auto)); gap: 9px; pointer-events: none; }
.bf-touch-actions button, .bf-touch-utility button { min-width: 54px; min-height: 48px; padding: 0 12px; border: 1px solid rgba(230,207,149,.48); border-radius: 24px; color: #f1e5c9; background: rgba(6,8,10,.55); box-shadow: 0 5px 20px rgba(0,0,0,.34); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); font: 600 12px/1 system-ui, sans-serif; pointer-events: auto; touch-action: none; }
.bf-touch-actions button.active, .bf-touch-actions button:active, .bf-touch-utility button:active { background: rgba(201,173,115,.3); transform: scale(.96); }
.bf-touch-utility { position: absolute; top: max(14px, env(safe-area-inset-top)); right: max(14px, env(safe-area-inset-right)); display: flex; gap: 8px; pointer-events: none; }
.bf-touch-utility button { min-height: 40px; opacity: .82; }
.bf-touch-mode #hud-controls { bottom: 9px; font-size: 10px; letter-spacing: .08em; opacity: .7; }
.bf-touch-entered #start-overlay { display: none !important; }
.bf-touch-mode, .bf-touch-mode #app, .bf-touch-mode canvas { touch-action: none; overscroll-behavior: none; }
@media (orientation: portrait) {
  .bf-touch-joystick { width: 104px; height: 104px; }
  .bf-touch-actions { grid-template-columns: repeat(2, minmax(54px, auto)); }
  .bf-touch-actions button { min-width: 58px; }
  .bf-touch-mode #hud-controls { display: none; }
}
@media (max-width: 720px) {
  .bf-touch-utility button { min-width: 46px; padding: 0 9px; font-size: 10px; }
}
`;
write(join(workspace, 'src', 'touch.css'), touchCss);

console.log('[beyond-fable] Installation des dépendances upstream verrouillées…');
run('npm', ['ci', '--no-audit', '--no-fund'], workspace);
console.log('[beyond-fable] Compilation du mini-jeu…');
run('npm', ['run', 'build'], workspace);

const dist = join(workspace, 'dist');
if (!existsSync(join(dist, 'index.html'))) fail('Le build upstream n’a produit aucun index.html.');
mkdirSync(dirname(output), { recursive: true });
cpSync(dist, output, { recursive: true });
console.log('[beyond-fable] Mini-jeu matérialisé dans public/games/beyond-fable.');
