// Live control panel (lil-gui). Structural controls rebuild geometry on
// release (onFinishChange) to keep dragging smooth; look/motion/effect controls
// update shader uniforms live (onChange). Labels are in Russian.

import GUI from 'lil-gui';
import { PALETTES, PALETTE_NAMES } from './palettes.js';
import { QUALITY_PRESETS } from './config.js';

export function buildGUI(app) {
  const c = app.config;
  const rebuild = () => app.rebuild();
  const live = () => app.applyLive();

  const gui = new GUI({ title: '○ Galaxie' });

  // --- identity ---
  const paletteOptions = {};
  for (const name of PALETTE_NAMES) paletteOptions[PALETTES[name].label] = name;
  gui.add(c, 'palette', paletteOptions).name('Palitre').onChange(() => {
    rebuild();
    live();
  });

  const qualityOptions = {};
  for (const q of Object.keys(QUALITY_PRESETS)) qualityOptions[QUALITY_PRESETS[q].label] = q;
  gui.add(c, 'quality', qualityOptions).name('Qualité').onChange((q) => app.setQuality(q));

  const seedCtrl = gui.add(c, 'seed').name('Sid').onFinishChange(rebuild);
  const seedActions = {
    random() {
      c.seed = Math.random().toString(36).slice(2, 10);
      seedCtrl.updateDisplay();
      rebuild();
    },
  };
  gui.add(seedActions, 'random').name('○ Nouveau siège');

  // chart every system at once — turns off the fog-of-war discovery (#13)
  const chartActions = {
    revealAll() {
      app.revealAllSystems();
    },
  };
  gui.add(chartActions, 'revealAll').name('○ Ouvrir tous les systèmes');

  // --- shape (structural) ---
  const fShape = gui.addFolder('Forme');
  fShape.add(c, 'starCount', 5000, 200000, 1000).name('Étoiles').onFinishChange(rebuild);
  fShape.add(c, 'arms', 1, 8, 1).name('Rukawa').onFinishChange(rebuild);
  fShape.add(c, 'spin', 0, 8, 0.05).name('Contour').onFinishChange(rebuild);
  fShape.add(c, 'armWidth', 0.05, 0.7, 0.01).name('Épaisseur des manches').onFinishChange(rebuild);
  fShape.add(c, 'randomness', 0, 0.6, 0.01).name('Épargne').onFinishChange(rebuild);
  fShape.add(c, 'randomnessPower', 1, 5, 0.1).name('Compression des manches').onFinishChange(rebuild);
  fShape.add(c, 'coreSize', 0.05, 0.4, 0.01).name('Taille de l &apos; amande').onFinishChange(rebuild);
  fShape.add(c, 'coreDensity', 0, 0.6, 0.01).name('Densité de l &apos; amande').onFinishChange(rebuild);
  fShape.add(c, 'thickness', 0.0, 0.2, 0.005).name('Épaisseur du disque').onFinishChange(rebuild);
  fShape.close();

  // --- suns ---
  const fSuns = gui.addFolder('Soleil');
  fSuns.add(c, 'sunCount', 0, 400, 5).name('Nombre').onFinishChange(rebuild);
  fSuns.add(c, 'sunSize', 0.3, 3, 0.05).name('Taille').onChange(live);
  fSuns.close();

  // --- explorable systems ---
  const fSys = gui.addFolder('Systèmes');
  fSys
    .add(c, 'realSystemFraction', 0, 1, 0.01)
    .name('Pourcentage de la population réelle')
    .onFinishChange(() => app.rebuildSystems());
  fSys.add(c, 'showMarkers').name('Étiquettes').onChange(live);
  fSys
    .add(
      {
        random() {
          const s = app.systems.randomSystem();
          if (s) app.enterSystem(s);
        },
      },
      'random',
    )
    .name('○ Système aléatoire');
  fSys.close();

  // --- motion (live, GPU) ---
  const fMotion = gui.addFolder('Mouvement');
  fMotion.add(c, 'rotationSpeed', 0, 0.2, 0.001).name('Vitesse de rotation').onChange(live);
  fMotion.add(c, 'differential', 0, 1, 0.01).name('Rotation de diffusion').onChange(live);
  fMotion.add(c, 'twinkle', 0, 1, 0.01).name('Mort').onChange(live);
  fMotion.add(c, 'cameraAutoRotate').name('Rotation de la chambre').onChange(live);

  // --- light & nebula (live) ---
  const fLight = gui.addFolder('Lumière et nébuleuse');
  fLight.add(c, 'exposure', 0.3, 2, 0.01).name('Luminosité').onChange(live);
  fLight.add(c, 'starSize', 0.3, 2.5, 0.01).name('Taille des étoiles').onChange(live);
  fLight.add(c, 'nebula').name('Nébuleuse').onChange(live);
  fLight.add(c, 'nebulaIntensity', 0, 1.5, 0.01).name('Densité du gaz').onChange(live);
  fLight.close();

  // --- sound (stage 5): the two volumes, persisted per device. No mute here —
  // the ♪ button (bottom-right) is the single master on/off for ALL audio. ---
  const fSound = gui.addFolder('Son');
  fSound.add(app.sfx, 'volume', 0, 1, 0.05).name('Interface').onChange((v) => app.sfx.setVolume(v));
  fSound.add(app.music, 'volume', 0, 1, 0.05).name('Musique').onChange((v) => app.music.setVolume(v));
  fSound.close();

  // --- readout ---
  const fpsCtrl = gui.add(app.stats, 'fps').name('FPS').disable();

  // --- perf budget (stage-0 surface; see config.js PERF_BUDGETS) ---
  const fBudget = gui.addFolder('Budget');
  const dcCtrl = fBudget.add(app.stats, 'drawCalls').name('Difficultés de dessin').disable();
  const triCtrl = fBudget.add(app.stats, 'triangles').name('Triangles').disable();
  fBudget.close();

  // .listen() self-schedules a RAF per controller even while the panel is
  // hidden — main.js flips these with the ⚙ toggle so a closed panel costs
  // nothing (lil-gui's listen(false) cancels the pending frame).
  gui.setReadoutsLive = (on) => {
    for (const ctrl of [fpsCtrl, dcCtrl, triCtrl]) ctrl.listen(on);
  };

  return gui;
}
