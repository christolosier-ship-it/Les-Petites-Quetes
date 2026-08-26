// First-flight onboarding: the declarative step list (stage 3). Each step is
// pure data — the FSM in onboarding.js owns all behaviour, so tuning the tour
// (texts, order, gating) never touches logic.
//
// Step shape:
//   id        — stable key (analytics / skippedAt bookkeeping)
//   body      — the RU coachmark text (short imperatives, cartographer tone)
//   advanceOn — 'manual' (button) or 'event:<name>' fired via app → notify()
//   when      — optional payload filter for event steps:
//                 { seed }  matches entry.data.seed  (enterSystem)
//                 { label } matches planet.data.label (focusPlanet)
//   next      — label of the manual-advance button (manual steps only)
//   action    — optional named helper button, resolved by onboarding.js
//                 ('showHome' → fly the galaxy camera to the Solar System)
//   glow      — optional DOM id to halo while the step is active
//   codexTab  — optional codex category the rail click lands on during this
//                 step (the tour's finds live under «Планеты», not «Системы»)
//
// The tour deliberately runs THROUGH the Solar System: rotate → zoom → fly
// home → enter → meet Earth → find it in the codex → back out. Every middle
// step advances on the player's own action, never on a «Далее» treadmill.

export const ONBOARDING_STEPS = [
  {
    id: 'welcome',
    title: 'Bienvenue, Cartographe.',
    body: 'Il y a une galaxie entière, cultivée à partir d\'un grain, et le premier vol est court et le tien.',
    advanceOn: 'manual',
    next: 'Commencer',
  },
  {
    id: 'rotate',
    body: 'Appuie sur le bouton gauche de la souris et tourne la galaxie.',
    advanceOn: 'event:rotate',
  },
  {
    id: 'zoom',
    body: 'La roue de la souris approche du curseur.',
    advanceOn: 'event:zoom',
  },
  {
    id: 'find-sol',
    body: 'Il y a notre maison parmi les milliers d\'étoiles.',
    advanceOn: 'event:enterSystem',
    when: { seed: 'sol-system' },
    action: 'showHome',
  },
  {
    id: 'meet-sol',
    body: 'C\'est le système solaire, le dossier gauche  ce qui suit: étoile, âge, histoire, planètes en orbite.',
    advanceOn: 'manual',
    next: 'Suivant',
  },
  {
    id: 'focus-earth',
    body: '♪ Clique sur la Terre ♪ ♪ On l\'examine plus près ♪',
    advanceOn: 'event:focusPlanet',
    when: { label: 'Terre' },
  },
  {
    id: 'back',
    body: 'La terre est inscrite dans ton code, et maintenant retourne à la galaxie: Esc fait un pas en arrière  ce que vous faites deux fois.',
    advanceOn: 'event:exitSystem',
  },
  {
    id: 'codex',
    body: 'Code ○ L\'onglet sur le bord gauche: tout ce que vous trouvez reste en lui pour toujours.',
    advanceOn: 'event:codexClose', // advance when the panel CLOSES — the final card must arrive on a visible screen
    glow: 'codex-toggle',
    codexTab: 'planet',
  },
  {
    id: 'done',
    title: 'Premier vol terminé',
    body: '♪ Le prochain vol libre, s\'il vous plaît, vous pouvez vous pointer sur les marqueurs, plongez dans les systèmes, ramassez le code.',
    advanceOn: 'manual',
    next: 'En route',
  },
];
