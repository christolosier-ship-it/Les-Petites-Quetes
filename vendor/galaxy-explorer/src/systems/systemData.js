// Procedural star-system data (pure, deterministic from a seed).
//
// Grounded loosely in real physics:
//   - orbital angular speed follows Kepler's third law: omega ∝ a^-1.5 (outer
//     planets move much slower than inner ones);
//   - gas giants are clearly larger than terrestrials but always smaller than
//     the star; moons are small and slow;
//   - habitability is a CONSEQUENCE of the star, not an independent roll: the
//     star is picked first and unconditionally, its class sets four climate
//     bands across the orbital slots (GEN.world.bands), and only a terran/
//     ocean world landing in the temperate band is a "life candidate". O/B
//     stars carry a zero-width temperate band, so their systems are lifeless
//     by construction — no separate "can this be inhabited" flag needed.
//
// Inhabited/ruined worlds get a natural biome from where they sit in the
// temperate band (GEN.world.biomes) plus their star class, then — only for a
// spacefaring civilisation — a city may pave over it. Civilisation stage
// (tribal / industrial / spacefaring) drives city-light brightness, orbital
// satellites/stations, colonies on sister worlds, and interplanetary ships.
// No meshes here — systemView/planet build those.

import { createRng } from '../rng.js';
import { GEN, GEN_VERSION } from './genParams.js';
import {
  generateName,
  generateLore,
  generateHistory,
  generateResources,
  generateRace,
  generateExtinctRace,
  generateFlagship,
  generateStationName,
  generateFact,
  roboticRuinLine,
  catastropheLine,
  obliterationLine,
} from './lore.js';

const TAU = Math.PI * 2;

// Fleet faction ids (the 6 ship style-kits in ships/factions.js). A system's
// civilisation flies one faction, so different civs field visually different
// fleets (the "mix per civilisation" goal). Kept as plain ids here so this data
// module stays mesh-free.
export const FLEET_FACTIONS = ['alliance', 'imperial', 'swarm', 'syndicate', 'cartel', 'precursor'];

// Star spectral classes. `radius` is visual (kept well above any planet so the
// star always dominates). `habit` = long-lived enough to gate an age-matched
// binary companion (see the binary roll below); it no longer filters the
// primary star roll itself — the primary is unconditional (see generateSystem).
const STAR_TYPES = [
  { key: 'O', label: 'Surgigante bleu (O)', desc: 'Chaud, clair et de courte durée', color: '#aac0ff', radius: 7.0, weight: 1, habit: false, activity: 0.35, solarMass: 22 },
  { key: 'B', label: 'Étoile blanche et bleue (B)', desc: 'massive et très chaude', color: '#cdddff', radius: 5.6, weight: 2, habit: false, activity: 0.3, solarMass: 7 },
  { key: 'A', label: 'Étoile blanche (A)', desc: 'de la séquence principale,', color: '#f2f5ff', radius: 4.6, weight: 3, habit: true, activity: 0.28, solarMass: 1.9 },
  { key: 'F', label: 'Étoile jaune-blanc (F)', desc: 'Un peu plus chaud et plus brillant que le soleil.', color: '#fff7ea', radius: 4.0, weight: 4, habit: true, activity: 0.3, solarMass: 1.3 },
  { key: 'G', label: 'Nain jaune (G)', desc: 'Une étoile tranquille comme notre soleil', color: '#fff0cc', radius: 3.5, weight: 6, habit: true, activity: 0.45, solarMass: 1.0 },
  { key: 'K', label: 'Nain orange (K)', desc: 'Chaud, stable et durable', color: '#ffce8e', radius: 3.0, weight: 6, habit: true, activity: 0.5, solarMass: 0.75 },
  { key: 'M', label: 'Nain rouge (M)', desc: 'Il est épais, mais il vit presque pour toujours.', color: '#ff9470', radius: 2.6, weight: 7, habit: true, activity: 0.6, solarMass: 0.35 },
];

// rough main-sequence mass (in Suns) by spectral class — used for hand-built
// special systems whose star label carries its class in parentheses.
const CLASS_SOLAR_MASS = { O: 22, B: 7, A: 1.9, F: 1.3, G: 1.0, K: 0.75, M: 0.35 };
function solarMassFromLabel(label) {
  const m = /\(([OBAFGKM])\)/.exec(label || '');
  return m ? CLASS_SOLAR_MASS[m[1]] : 1.0;
}

// Planet archetypes. `kind` selects the surface branch in the planet shader.
// Exported so the codex catalog can enumerate the 7 planet kinds without
// keeping its own copy of this table.
export const PLANET_KINDS = {
  lava: { kind: 3, c1: '#2a1610', c2: '#5a2a18', c3: '#140a08', hot: '#ff6a1e', atmo: '#ff6a30', atmoS: 0.32, clouds: 0, rMin: 0.45, rMax: 0.85 },
  rocky: { kind: 0, c1: '#7a6858', c2: '#998a78', c3: '#34302a', hot: '#000000', atmo: '#6a5a44', atmoS: 0.1, clouds: 0, rMin: 0.4, rMax: 0.9 },
  desert: { kind: 0, c1: '#b89366', c2: '#cdb083', c3: '#6a4a28', hot: '#000000', atmo: '#b89360', atmoS: 0.2, clouds: 0, rMin: 0.5, rMax: 1.0 },
  terran: { kind: 1, c1: '#16406f', c2: '#3f8a4a', c3: '#8a7a55', hot: '#ffd27a', atmo: '#7fb4ff', atmoS: 0.5, clouds: 1, rMin: 0.55, rMax: 1.05 },
  ocean: { kind: 1, c1: '#0e3a66', c2: '#2f7a60', c3: '#6f9a8a', hot: '#ffd27a', atmo: '#88c0ff', atmoS: 0.5, clouds: 1, rMin: 0.6, rMax: 1.1 },
  ice: { kind: 2, c1: '#cfe2f0', c2: '#a0c4e0', c3: '#6f96b4', hot: '#000000', atmo: '#bcd8ee', atmoS: 0.28, clouds: 0, rMin: 0.5, rMax: 1.0 },
  gas: { kind: 4, c1: '#d98c5a', c2: '#a8623a', c3: '#ecd6a8', hot: '#000000', atmo: '#e8c79a', atmoS: 0.35, clouds: 0, rMin: 2.0, rMax: 3.0 },
};

// Habitable-world biomes (Star-Wars-style variety). Colours override the kind-1
// surface; `biome` selects the sub-branch in the planet shader. Exported: this
// IS the exhaustive reachable biome-key set for both living and ruined worlds
// — lore.js's EXTINCT_WHO table must carry one entry per key here. (The codex,
// since the stage-6 reorg, catalogs ruins by TYPE, not by biome.)
export const BIOME_KEYS = {
  earthlike: { label: 'Type terrestre', biome: 0, ocean: '#16406f', land: '#3f8a4a', land2: '#8a7a55' },
  ocean: { label: 'Océanique', biome: 1, ocean: '#0e3a66', land: '#3a8a72', land2: '#6f9a8a' },
  jungle: { label: 'La jungle', biome: 2, ocean: '#15506a', land: '#2f7a2e', land2: '#5e8a36' },
  tundra: { label: 'Un monde glacé', biome: 3, ocean: '#2a4a66', land: '#d4e4ee', land2: '#9ab0c0' },
  desert: { label: 'Un monde désert', biome: 4, ocean: '#3a6a78', land: '#c9a36b', land2: '#8a6238' },
  city: { label: 'Planète-ville', biome: 5, ocean: '#22324a', land: '#6f7588', land2: '#474c5e' },
};

// Ruin flavours a ruined homeworld can end up with, in roll order (see the
// threshold chain a few lines below in generateSystem, which must keep
// assigning these same 4 values in this same order).
export const RUIN_TYPES = ['plain', 'robotic', 'destroyed', 'obliterated'];

export const CIV_LEVELS = {
  tribal: { label: 'Plaines', light: 0.3, sats: [0, 0], station: false, colonies: 0, ships: 0 },
  industrial: { label: 'L\'ère industrielle', light: 1.0, sats: [2, 5], station: false, colonies: 0, ships: 0 },
  spacefaring: { label: 'Civilisation spatiale', light: 1.5, sats: [3, 7], station: true, colonies: 2, ships: 4 },
};

/** Weighted spectral-class pick from an optional pool (defaults to all seven). */
function weightedStar(rng, pool = STAR_TYPES) {
  const total = pool.reduce((s, t) => s + t.weight, 0);
  let x = rng.next() * total;
  for (const t of pool) {
    x -= t.weight;
    if (x <= 0) return t;
  }
  return pool[pool.length - 1];
}

/** Weighted pick of an object-key from `{key: weight}`, with an optional
 *  per-key multiplier map layered on top (missing keys default to ×1). Used
 *  for both the band→archetype roll and the insolation→biome roll — the
 *  "absence = banned" contract lives in the caller's weight table, not here. */
function weightedKey(rng, weights, mul) {
  const keys = Object.keys(weights);
  const w = keys.map((k) => weights[k] * (mul && mul[k] != null ? mul[k] : 1));
  const total = w.reduce((s, x) => s + x, 0);
  let x = rng.next() * total;
  for (let i = 0; i < keys.length; i++) {
    x -= w[i];
    if (x <= 0) return keys[i];
  }
  return keys[keys.length - 1];
}

const clamp01 = (x) => Math.max(0, Math.min(1, x));

/** Climate band for every orbital slot of a star (GEN.world.bands, R2), plus
 *  the deterministic snap-promotion of one slot to `temperate` when the
 *  discrete index grid misses the band entirely (R3). Zero rng draws — a
 *  pure function of the star's class and how many planets the system has. */
function computeBands(starKey, n) {
  const edges = GEN.world.bands[starKey];
  const fracs = [];
  const bands = [];
  for (let i = 0; i < n; i++) {
    const f = n <= 1 ? 0 : i / (n - 1);
    fracs.push(f);
    bands.push(f < edges[0] ? 'scorch' : f < edges[1] ? 'temperate' : f < edges[2] ? 'cold' : 'frigid');
  }
  let snapIndex = -1;
  // edges[0] < edges[1] excludes O/B (zero-width temperate edge) automatically —
  // no separate per-class check needed.
  if (GEN.world.bandSnap && edges[0] < edges[1] && !bands.includes('temperate')) {
    const mid = (edges[0] + edges[1]) / 2;
    let bestI = 0;
    let bestD = Infinity;
    for (let i = 0; i < n; i++) {
      const d = Math.abs(fracs[i] - mid);
      if (d < bestD) {
        bestD = d;
        bestI = i;
      }
    }
    bands[bestI] = 'temperate';
    snapIndex = bestI;
  }
  return { bands, fracs, snapIndex };
}

/** A candidate's relative position inside the temperate band (0 = inner edge,
 *  1 = outer edge), used to pick its insolation tercile for the biome table. */
function tercileFromInsol(insol) {
  return insol < 1 / 3 ? 'hot' : insol < 2 / 3 ? 'mild' : 'cool';
}

/** Build a full system description from any seed value. */
export function generateSystem(seed) {
  const rng = createRng(seed);

  // Warm the generator a couple of steps — mulberry32's first draws off a
  // string seed are mildly biased, which skewed shares across systems.
  rng.next();
  rng.next();

  // The star is rolled FIRST and unconditionally (no status to satisfy yet —
  // status is now a downstream consequence of the star + planets, see below).
  const star = weightedStar(rng);

  // system age (Gyr): hot massive stars are necessarily young
  const ageMax = star.key === 'O' ? 0.04 : star.key === 'B' ? 2 : star.key === 'A' ? 4 : 13.2;
  const ageGyr = Math.round(rng.range(0.3, ageMax) * 10) / 10;

  // ~28% of systems are a close binary (two suns near each other, #10). Planets
  // then orbit the barycentre (circumbinary). An old system can't host a
  // short-lived O/B companion, so gate the companion's class by age.
  let binary = null;
  if (rng.next() < GEN.binaryChance) {
    const star2 = weightedStar(rng, ageGyr > 3 ? STAR_TYPES.filter((t) => t.habit) : STAR_TYPES);
    const separation = (star.radius + star2.radius) * 1.3;
    binary = { star2, separation };
  }

  const planetCount = rng.int(GEN.planetCount[0], GEN.planetCount[1]);
  const planets = [];

  // Climate bands for every slot follow from the star class + slot count
  // alone — a pure lookup, zero rng draws (R2/R3 in GENERATION.md).
  const { bands, fracs, snapIndex } = computeBands(star.key, planetCount);
  const starEdges = GEN.world.bands[star.key];

  // --- spacing model (#7/#11): every body owns an in-plane "half-extent" — its
  // radius plus any ring or moon reach. No two bodies' disks may come within
  // MIN_GAP, and the innermost planet keeps a generous gap from the star
  // surface. Each planet is fully sized (radius + rings + moons) BEFORE it is
  // placed, so the orbit is chosen to clear the previous body exactly — this is
  // what stops Saturn-like ringed worlds from grazing each other. ---
  const MIN_GAP = 2.6; // empty space between two adjacent planet disks
  const FIRST_GAP = star.radius * 0.9 + 3.2; // extra clearance from the star
  let prevOrbit = 0;
  let prevHalf = star.radius; // the star occupies up to its visual radius
  if (binary) prevHalf = Math.max(prevHalf, binary.separation * 0.5 + binary.star2.radius);

  for (let i = 0; i < planetCount; i++) {
    const band = bands[i];
    // R4: the band's archetype table IS the compatibility rule — an absent
    // key is a ban (lava can't sit in `cold`, ice/gas can't sit in `scorch`).
    const type = weightedKey(rng, GEN.world.archetypes[band]);
    const def = PLANET_KINDS[type];
    const radius = rng.range(def.rMin, def.rMax);
    const hasRings = type === 'gas' ? rng.next() < 0.55 : type === 'ice' ? rng.next() < 0.12 : false;
    const ringOuter = hasRings ? radius * 2.25 : 0;

    // moons — small, slow, ALL prograde (#6). Stacked outside any ring with a
    // guaranteed gap so they never overlap each other or the rings.
    const moonMax = type === 'gas' ? 3 : type === 'terran' || type === 'ocean' ? 2 : 1;
    const moonCount = rng.int(0, moonMax);
    const moons = [];
    let moonOrbit = Math.max(radius * 1.8, ringOuter + radius * 0.6);
    for (let m = 0; m < moonCount; m++) {
      const mr = radius * rng.range(0.06, 0.18);
      moonOrbit += mr + radius * 0.5 + rng.range(0.2, 0.6); // clear the previous moon
      moons.push({
        radius: mr,
        orbit: moonOrbit,
        angularSpeed: rng.range(0.22, 0.6), // prograde — same sense as the planet
        phase: rng.range(0, TAU),
      });
      moonOrbit += mr;
    }

    // this body's in-plane half-extent (planet, rings and moons all count)
    const moonReach = moons.length ? moons[moons.length - 1].orbit + moons[moons.length - 1].radius : 0;
    const half = Math.max(radius, ringOuter, moonReach);

    // place so this disk clears the previous body by the required gap
    const gap = (i === 0 ? FIRST_GAP : MIN_GAP) + rng.range(0.4, 2.2);
    let orbit = prevOrbit + prevHalf + gap + half;
    // circumbinary stability: keep the nearest planet well outside the pair
    if (binary && i === 0) orbit = Math.max(orbit, binary.separation * 2.8 + half);

    // R5: "candidate for life" is a lookup, not a roll — a terran/ocean world
    // that happens to land in the temperate band. The snap slot has no real
    // position inside the band, so it's pinned to the band's midpoint (mild).
    const lifeCandidate = band === 'temperate' && GEN.world.lifeArchetypes.includes(type);
    const insol =
      band !== 'temperate'
        ? null
        : i === snapIndex
          ? 0.5
          : starEdges[1] > starEdges[0]
            ? clamp01((fracs[i] - starEdges[0]) / (starEdges[1] - starEdges[0]))
            : 0.5;

    const planet = {
      type,
      def,
      radius,
      orbit,
      // Kepler's third law: omega ∝ a^-1.5, scaled so the inner worlds drift
      // calmly and the outer ones crawl. All prograde.
      angularSpeed: (1.4 / Math.pow(orbit, 1.5)) * rng.range(0.9, 1.1),
      spinSpeed: rng.range(0.05, 0.22),
      tilt: rng.range(-0.42, 0.42),
      inclination: rng.range(-0.06, 0.06),
      phase: rng.range(0, TAU),
      hasRings,
      inhabited: false,
      ruined: false,
      colony: false,
      biome: type === 'ocean' ? 1 : 0,
      band, // 'scorch' | 'temperate' | 'cold' | 'frigid' — this slot's climate
      insol, // 0..1 position inside the temperate band, else null
      lifeCandidate,
      moons,
    };

    planets.push(planet);
    prevOrbit = orbit;
    prevHalf = half;
  }

  // --- status as a consequence of the star + planets already rolled ---
  const candidates = planets.filter((p) => p.lifeCandidate);

  // R6: exactly three rolls happen here, ALWAYS — even with zero candidates —
  // so that adding/removing candidates never shifts every later rng draw.
  const lifeRoll = rng.next();
  const fateRoll = rng.next();
  const homeRoll = rng.next();

  let status = 'wild'; // no candidates ⇒ wild, unconditionally (O/B always land here)
  if (candidates.length > 0) {
    const ageFactor = Math.min(1, ageGyr / GEN.life.rampGyr);
    const lifeMul = GEN.life.starLifeMul[star.key] != null ? GEN.life.starLifeMul[star.key] : 1;
    const pLife = clamp01(GEN.life.given * lifeMul * ageFactor);
    if (lifeRoll < pLife) {
      const extinctMul = GEN.life.starExtinctMul[star.key] != null ? GEN.life.starExtinctMul[star.key] : 1;
      const pExtinct = clamp01(GEN.life.extinctShare * extinctMul);
      status = fateRoll < pExtinct ? 'ruins' : 'inhabited';
    }
    // else: conditions were there, the spark never happened — still wild.
  }
  const home = status !== 'wild' ? candidates[Math.min(candidates.length - 1, Math.floor(homeRoll * candidates.length))] : null;

  let civLevel = null;
  let roboticTraffic = false; // #8: machines keep cargo moving in a dead world
  let fleetDwelling = false; // #10: survivors live aboard a roaming flagship
  if (status === 'inhabited') {
    // civilisation stage
    const cRoll = rng.next();
    civLevel = cRoll < GEN.civTribal ? 'tribal' : cRoll < GEN.civIndustrial ? 'industrial' : 'spacefaring';
    const civ = CIV_LEVELS[civLevel];

    // R8/R9: the natural biome ALWAYS gets rolled from insolation × archetype ×
    // star class, then (R10) a spacefaring civ MAY pave a city over it — city
    // is a civilisation overlay, never a substitute for the natural roll.
    const tercile = tercileFromInsol(home.insol);
    const natureBiome = weightedKey(rng, GEN.world.biomes[tercile][home.type], GEN.world.biomeStarMul[star.key]);
    const biomeName = civLevel === 'spacefaring' && rng.next() < GEN.world.cityOverlayChance ? 'city' : natureBiome;
    applyBiome(home, biomeName);
    home.natureBiome = natureBiome; // what the city (if any) was built over

    home.inhabited = true;
    home.civLevel = civLevel;
    home.civLabel = civ.label;
    home.lightBoost = civ.light;
    home.civObjects = {
      satellites: rng.int(civ.sats[0], civ.sats[1]),
      station: civ.station,
    };
    home.race = generateRace(rng, { civLevel, biome: biomeName });

    // colonies on other worlds (spacefaring only, #16). Colonisability is NOT
    // tied to a life-friendly climate (owner decision, 2026-07-03): a
    // spacefaring civilisation plants ordinary settlements where the band
    // allows, and pressurised dome bases everywhere with a solid surface —
    // only gas giants stay colony-free (they get skimmer stations instead).
    // Comfortable worlds are still taken first, so a settlement beats a dome
    // whenever the system offers the choice, and a temperate rocky/desert
    // colony may turn out terraformed (flavour only, no shader change yet).
    if (civ.colonies > 0) {
      const comfy = (p) =>
        (p.band === 'temperate' || p.band === 'cold') &&
        (p.type === 'terran' || p.type === 'ocean' || p.type === 'rocky' || p.type === 'desert');
      const pool = [
        ...shuffled(planets.filter((p) => p !== home && comfy(p)), rng),
        ...shuffled(planets.filter((p) => p !== home && !comfy(p) && p.type !== 'gas'), rng),
      ];
      const want = Math.min(civ.colonies, pool.length);
      for (let k = 0; k < want; k++) {
        const p = pool[k];
        p.colony = true;
        p.colonyStation = true; // #2: every colony gets its own little orbital hub
        if (comfy(p)) {
          p.colonyLight = 0.6; // clearly visible settlement glow on the night side
          const canTerraform = p.band === 'temperate' && (p.type === 'rocky' || p.type === 'desert');
          p.colonyKind =
            canTerraform && rng.next() < GEN.world.terraformChance ? 'terraformed' : 'settlement';
        } else {
          p.colonyKind = 'dome'; // scorch/frigid surface — life under pressurised domes
          p.colonyLight = 0.45; // dimmer: a handful of domes, not open cities
        }
      }
    }

    // gas-giant skimmer stations (#11) — spacefaring civs harvest the giants
    if (civLevel === 'spacefaring') {
      for (const gp of planets.filter((p) => p.type === 'gas')) {
        if (rng.next() < 0.6) gp.gasStation = true;
      }
    }
  } else if (status === 'ruins') {
    // ruins: a former living world, greyed out. The ruin flavour is rolled
    // BEFORE the biome (R11 — reversed from the old order) because the
    // flavour reshapes the biome odds (robotic ruins lean toward "city"):
    //   robotic     — everyone died, machines keep the depot running
    //   destroyed   — a catastrophe crater scars the surface
    //   obliterated — blown to pieces by an alien race: a debris field
    //   (else)      — a plain, lifeless greyed-out ruin
    const rRoll = rng.next();
    let ruinType = RUIN_TYPES[0]; // 'plain'
    if (rRoll < GEN.ruinRobotic) ruinType = RUIN_TYPES[1]; // 'robotic'
    else if (rRoll < GEN.ruinDestroyed) ruinType = RUIN_TYPES[2]; // 'destroyed'
    else if (rRoll < GEN.ruinObliterated) ruinType = RUIN_TYPES[3]; // 'obliterated'

    // R11: same insolation table a living world would use (this WAS a living
    // climate), plus a "was it a whole planet-city?" baseline that robotic
    // ruins lean into hard. The reachable key set is exactly BIOME_KEYS' keys.
    const tercile = tercileFromInsol(home.insol);
    const ruinWeights = { ...GEN.world.biomes[tercile][home.type], city: 1 };
    const ruinMul = GEN.world.ruinBiomeMul[ruinType];
    if (ruinMul) for (const k in ruinMul) if (ruinWeights[k] != null) ruinWeights[k] *= ruinMul[k];
    const ruinBiome = weightedKey(rng, ruinWeights, GEN.world.biomeStarMul[star.key]);
    applyBiome(home, ruinBiome);
    home.ruined = true;
    if (ruinType === 'robotic') home.robotic = true;
    else if (ruinType === 'destroyed') home.destroyed = true;
    else if (ruinType === 'obliterated') home.obliterated = true;
    // #7: who lived here and HOW they died (the cause matches the ruin type)
    home.race = generateExtinctRace(rng, ruinBiome, ruinType);

    if (home.robotic) {
      // #8: machines still run the place — a maintained depot station + a few
      // cargo haulers, but nothing alive.
      home.colonyStation = true;
      roboticTraffic = true;
    } else if (home.destroyed || home.obliterated) {
      // #9/#10: the inhabitants wrecked their own world. Survivors either fled
      // to a colony on a sister world (with an orbital hub right beside the
      // dead planet, same band gate as living colonies — R13), or — if
      // nothing else is habitable — now live aboard a roaming flagship.
      const refuge = shuffled(
        planets.filter(
          (p) =>
            p !== home &&
            (p.band === 'temperate' || p.band === 'cold') &&
            (p.type === 'rocky' || p.type === 'desert' || p.type === 'ice' || p.type === 'terran' || p.type === 'ocean'),
        ),
        rng,
      );
      if (refuge.length && rng.next() < GEN.ruinRefugeChance) {
        const r0 = refuge[0];
        r0.colony = true;
        r0.colonyLight = 0.55;
        r0.colonyStation = true; // survivors' hub right by the dead world (#9)
      } else {
        fleetDwelling = true; // no refuge → they live on the flagship (#10)
      }
    }
  }

  // #25: some wild, uninhabited systems host a lone roaming flagship scouting
  // for planets fit for a new colony — an explorer just passing through.
  let scoutFlagship = false;
  if (status === 'wild' && rng.next() < GEN.scoutFlagshipChance) scoutFlagship = true;

  const planetKinds = new Set(planets.map((p) => p.type));
  const name = generateName(rng);
  const lore = generateLore(rng, status, planetKinds);
  const res = generateResources(rng, planetKinds, status);
  let ships = 0;
  if (status === 'inhabited' && civLevel === 'spacefaring') ships = CIV_LEVELS.spacefaring.ships;
  else if (roboticTraffic) ships = rng.int(GEN.roboticShips[0], GEN.roboticShips[1]); // robot cargo haulers (#8)
  else if (fleetDwelling) ships = rng.int(GEN.fleetShips[0], GEN.fleetShips[1]); // the surviving fleet (#10)
  else if (scoutFlagship) ships = 1; // a lone colony-scout flagship (#25)
  // a few icy comets sweep most systems on long elliptical orbits (#13)
  const comets = rng.next() < GEN.cometChance ? rng.int(GEN.cometCount[0], GEN.cometCount[1]) : 0;

  let description = lore.description;
  let statusLabel = lore.statusLabel;
  if (home && home.robotic) {
    description = roboticRuinLine(rng) + ' ' + description;
    statusLabel = 'Robotes';
  } else if (home && home.destroyed) {
    description = catastropheLine(rng) + ' ' + description;
    statusLabel = 'Les ruines sont un désastre.';
  } else if (home && home.obliterated) {
    description = obliterationLine(rng) + ' ' + description;
    statusLabel = 'Les ruines ont été détruites.';
  }
  if (scoutFlagship) {
    description += 'Un vaisseau de reconnaissance solitaire qui regarde la planète sous une nouvelle colonie se dirige lentement vers le système.';
  }

  // #H: name the flagship this system fields (if any) + a context-aware story
  const hasFlagship = !roboticTraffic && (fleetDwelling || scoutFlagship || ships >= 3);
  const habitable = planetKinds.has('terran') || planetKinds.has('ocean');
  const flagship = hasFlagship
    ? generateFlagship(rng, { status, fleetDwelling, scoutFlagship, habitable, systemName: name })
    : null;
  // #H: give every orbital station its own name
  for (const p of planets) {
    if ((p.civObjects && p.civObjects.station) || p.colonyStation || p.gasStation) {
      p.stationName = generateStationName(rng);
    }
  }

  return {
    seed: String(seed),
    kind: 'star',
    genVersion: GEN_VERSION, // rule set this system was generated under
    name,
    status,
    statusLabel,
    description,
    star,
    binary,
    ageGyr,
    flagship,
    history: generateHistory(rng, { status, ageGyr, star }),
    resources: res.list,
    useFor: res.use,
    fact: generateFact(rng),
    planets,
    ships,
    comets,
    civLevel,
    roboticTraffic, // robots-only cargo traffic in a dead world (#8)
    fleetDwelling, // survivors live aboard a roaming flagship (#10)
    scoutFlagship, // lone roaming colony-scout in a wild system (#25)
    faction: rng.pick(FLEET_FACTIONS), // styles this system's fleet (#11)
  };
}

/** Deterministic Fisher–Yates shuffle driven by the system rng. */
function shuffled(arr, rng) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng.next() * (i + 1));
    const t = a[i];
    a[i] = a[j];
    a[j] = t;
  }
  return a;
}

/** The supermassive black hole at the galactic centre (a selectable object). */
export function generateGalacticCore() {
  return {
    seed: 'galactic-core',
    kind: 'blackhole',
    variant: 'galactic',
    name: 'Sagittarius A*',
    status: 'blackhole',
    statusLabel: 'Un trou noir',
    description:
      'Un trou noir supermassif se cache au cœur de la galaxie, et il y a des étoiles qui se cachent à la vitesse furieuse, et la lumière qui s\'approche trop disparaît à jamais.',
    star: { label: 'Un trou noir supermassif', desc: 'Masse: ~ 4 millions', color: '#000000', radius: 8, activity: 0 },
    ageGyr: 13.6,
    history:
      'Elle a grandi avec la galaxie pendant plus de 13 milliards d\'années, absorbeant gaz, étoiles et tout un tas d\'accumulations, et aujourd\'hui elle tient toute la forme de la Voie Lactée.',
    resources: [],
    useFor: 'Centre de la galaxie et limite non récupérable',
    fact: 'Le trou noir à l\'horizon est un peu bizarre pour un observateur extérieur.',
    planets: [],
    ships: 0,
    blackHole: { radius: 8, inner: 13, outer: 44, beta: 0.45, colors: { in: '#fff1d0', mid: '#ffae46', out: '#7a2206' } },
  };
}

/** A special "Interstellar" system: Gargantua + the Endurance ship. */
export function generateInterstellar() {
  return {
    seed: 'interstellar',
    kind: 'blackhole',
    variant: 'gargantua',
    special: true, // a special encounter — magenta "special" marker + badge
    name: 'Gargantua',
    status: 'blackhole',
    statusLabel: '♪ Un trou noir ♪ ♪ Interstellar ♪',
    description:
      'Un trou noir rotatif géant, couvert de disque de lumière: à cause de la distorsion de la lumière, il se retourne au-dessus et au-dessous.',
    star: { label: 'Gargantua', desc: 'Bâche noire supermassive tournante', color: '#000000', radius: 9, activity: 0 },
    ageGyr: 10.0,
    history:
      'Il y a une heure qui passe, sur la planète voisine, il y a sept ans, dehors, et ceux qui cherchaient une nouvelle maison pour l\'humanité sont venus.',
    resources: [],
    useFor: 'La porte vers les autres mondes et le piège du temps',
    fact: 'Le temps passe plus lentement que le temps à côté du trou noir, et l\'histoire de \'Interstellar\' est en train d\'être construite.',
    planets: [],
    ships: 0,
    endurance: true,
    blackHole: { radius: 9, inner: 13.5, outer: 46, beta: 0.0, colors: { in: '#fff1d0', mid: '#f2a93b', out: '#9a3a08' } },
  };
}

/** A special "Death Star" event (#12/#10): the imperial battle station inside a
 *  real star system, having just destroyed Alderaan — recreating the film scene,
 *  with Yavin + its rebel moon nearby. Lightly anonymised. */
export function generateDeathStar() {
  return makeSpecialSystem({
    seed: 'death-star',
    name: 'Secteur Alderaan',
    status: 'ruins',
    statusLabel: 'Étoile de la Mort: destruction d\'Alderaan',
    starLabel: 'Étoile jaune (G)',
    starDesc: 'Il y a une lumière silencieuse sur les débris d\'Alderaan.',
    starColor: '#ffe7a0',
    starRadius: 3.4,
    ageGyr: 6.0,
    description:
      'L\'Empire a montré ce que sa nouvelle station de combat pouvait faire: Alderaan a volé en éclats en une seule pièce de son arme principale, et maintenant la station va plus loin que  personnes vers la jungle de la lune de Yavin, où les rebelles se sont réfugiés.',
    history:
      'Une station blindée de la taille d\'une petite lune peut diviser la planète en une seule balle, elle a été rassemblée en secret pendant des décennies, et les gardes de la flotte impériale des destructeurs Klinovid sont encerclés.',
    resources: [],
    useFor: 'Armes absolues et symbole du pouvoir impérial',
    fact: 'Un seul tir de son arme principale libère l\'énergie d\'une petite étoile.',
    ships: 4,
    comets: 0,
    civLevel: 'spacefaring',
    faction: 'imperial',
    deathStar: { radius: 0.62 }, // moon-sized — smaller than the planets
    planetSpecs: [
      {
        label: 'Alderaan',
        biome: 'earthlike',
        radius: 0.7,
        obliterated: true,
        ref: 'Alderaan ♪ Un monde pacifique et non armé, le pays de la princesse Leah Odin, qui a été détruit par une seule étoile de la mort comme une manifestation de force ♪ et qui a soulevé toute la galaxie pour la rébellion.',
      },
      {
        label: 'Javan',
        biome: 'gas',
        radius: 3.0,
        color: '#c4763e',
        moonCount: 0,
        ref: 'Yavin ♪ Un géant du gaz rouge qui tourne autour de la lune de Yavin-4 avec une base secrète de rebelles ♪ (Star Wars)',
      },
      {
        label: 'Javan-4',
        biome: 'jungle',
        radius: 0.6,
        ref: 'Yavin 4  ce 4e lune de la géante du gaz de Yavin, couverte de jungles et de pyramides de massasie, et les rebelles ont lancé une attaque qui a détruit la première Étoile de la Mort (Star Wars).',
      },
    ],
  });
}

// ---------------------------------------------------------------------------
// Special hand-crafted "easter egg" systems (#13/#19/#20). They reuse the
// normal star+planets system view; we just hand-build the data from a compact
// planet spec instead of rolling it procedurally.
// ---------------------------------------------------------------------------

// biome keyword (from the specs) → planet type / optional biome palette
const BIOME_KEYWORD = {
  earthlike: { type: 'terran', biome: 'earthlike' },
  ocean: { type: 'terran', biome: 'ocean' },
  jungle: { type: 'terran', biome: 'jungle' },
  tundra: { type: 'terran', biome: 'tundra' },
  rocky: { type: 'rocky' },
  desert: { type: 'desert' },
  lava: { type: 'lava' },
  ice: { type: 'ice' },
  gas: { type: 'gas' },
};

function specPlanet(spec, rng) {
  const kw = BIOME_KEYWORD[spec.biome] || { type: 'rocky' };
  let def;
  let biomeVal = 0;
  let biomeLabel;
  if (kw.biome) {
    const b = BIOME_KEYS[kw.biome];
    def = { ...PLANET_KINDS.terran, c1: b.ocean, c2: b.land, c3: b.land2, biome: b.biome };
    biomeVal = b.biome;
    biomeLabel = b.label;
  } else {
    def = PLANET_KINDS[kw.type] || PLANET_KINDS.rocky;
  }
  if (spec.color) def = { ...def, c2: spec.color };
  const radius = Math.min(Math.max(spec.radius != null ? spec.radius : (def.rMin + def.rMax) * 0.5, 0.3), 3.4);

  const moons = [];
  let moonOrbit = radius * 1.8;
  for (let m = 0; m < (spec.moonCount || 0); m++) {
    const mr = radius * 0.12;
    moonOrbit += mr + radius * 0.5 + 0.4;
    moons.push({ radius: mr, orbit: moonOrbit, angularSpeed: rng.range(0.22, 0.6), phase: rng.range(0, TAU) });
    moonOrbit += mr;
  }

  const planet = {
    type: kw.type,
    def,
    radius,
    orbit: 0, // filled in by makeSpecialSystem once spacing is known
    angularSpeed: 0,
    spinSpeed: rng.range(0.05, 0.22),
    tilt: rng.range(-0.42, 0.42),
    inclination: rng.range(-0.05, 0.05),
    phase: rng.range(0, TAU),
    hasRings: !!spec.hasRings,
    inhabited: !!spec.inhabited,
    ruined: !!spec.dead,
    destroyed: !!spec.destroyed,
    colony: false,
    biome: biomeVal,
    biomeName: kw.biome,
    biomeLabel,
    label: spec.label, // shown verbatim in the planet list (e.g. "Mercure")
    ref: spec.ref || null, // hand-written reference blurb for the planet card (#2)
    moons,
  };
  if (spec.obliterated) {
    planet.ruined = true;
    planet.obliterated = true;
  }
  if (spec.ishimura) planet.ishimura = true; // Dead Space planet-cracker over it (#5)
  if (spec.inhabited) {
    planet.civLevel = 'spacefaring';
    planet.civLabel = spec.civLabel || 'Civilisation spatiale';
    planet.lightBoost = 1.5;
    // a realistic young world (#8) can override the orbital tech: a modest station
    // kind (ISS) + its own satellite count instead of the default ring-city + 4.
    planet.civObjects = {
      satellites: spec.satellites != null ? spec.satellites : 4,
      station: true,
      stationKind: spec.homeStationKind || null,
    };
  }
  if (spec.colony) {
    planet.colony = true;
    planet.colonyLight = 0.6;
    planet.colonyStation = true;
  }
  // a hand-built gas giant may host a fuel-skimmer platform (collector), like
  // the procedural colonies' gas stations — used by the faction capitals.
  if (spec.gasStation) planet.gasStation = true;
  // a hand-written race may be attached to a living OR a dead world (the extinct
  // builders of a ruined planet still tell their story on its card).
  if (spec.race) planet.race = spec.race;
  return planet;
}

function makeSpecialSystem(o) {
  const rng = createRng(o.seed);
  const star = {
    key: 'S',
    label: o.starLabel,
    desc: o.starDesc,
    color: o.starColor,
    radius: o.starRadius || 3.4,
    habit: true,
    activity: o.activity != null ? o.activity : 0.45,
    solarMass: o.solarMass != null ? o.solarMass : solarMassFromLabel(o.starLabel),
  };
  if (o.binary && o.binary.star2 && o.binary.star2.solarMass == null) {
    o.binary.star2.solarMass = solarMassFromLabel(o.binary.star2.label);
  }

  const FIRST_GAP = star.radius * 0.9 + 3.2;
  const MIN_GAP = 2.6;
  let prevOrbit = 0;
  let prevHalf = star.radius;
  if (o.binary) prevHalf = Math.max(prevHalf, o.binary.separation * 0.5 + o.binary.star2.radius);

  const planets = o.planetSpecs.map((spec, i) => {
    const p = specPlanet(spec, rng);
    const ringOuter = p.hasRings ? p.radius * 2.25 : 0;
    const moonReach = p.moons.length ? p.moons[p.moons.length - 1].orbit + p.moons[p.moons.length - 1].radius : 0;
    const half = Math.max(p.radius, ringOuter, moonReach);
    const gap = (i === 0 ? FIRST_GAP : MIN_GAP) + rng.range(0.4, 1.6);
    let orbit = prevOrbit + prevHalf + gap + half;
    if (o.binary && i === 0) orbit = Math.max(orbit, o.binary.separation * 2.8 + half);
    p.orbit = orbit;
    p.angularSpeed = (1.4 / Math.pow(orbit, 1.5)) * rng.range(0.9, 1.1);
    prevOrbit = orbit;
    prevHalf = half;
    return p;
  });

  // #H: flagship + station names for the hand-built systems too. A hand-written
  // flagship (name + lore) may be pinned via `flagshipOverride` — the faction
  // capitals fly their CANONICAL named flagship instead of a coined one.
  const ships = o.ships || 0;
  const habitable = planets.some((p) => p.type === 'terran' || p.type === 'ocean');
  const flagship =
    o.flagshipOverride ||
    (!o.roboticTraffic && (o.fleetDwelling || ships >= 3)
      ? generateFlagship(rng, {
          status: o.status,
          fleetDwelling: !!o.fleetDwelling,
          scoutFlagship: false,
          habitable,
          systemName: o.name,
        })
      : null);
  for (const p of planets) {
    if ((p.civObjects && p.civObjects.station) || p.colonyStation || p.gasStation) {
      p.stationName = generateStationName(rng);
    }
  }

  return {
    seed: o.seed,
    kind: 'star',
    name: o.name,
    status: o.status,
    statusLabel: o.statusLabel,
    description: o.description,
    star,
    binary: o.binary || null,
    ageGyr: o.ageGyr,
    flagship,
    history: o.history,
    resources: o.resources || [],
    useFor: o.useFor,
    fact: o.fact || '',
    planets,
    ships,
    comets: o.comets || 0,
    civLevel: o.civLevel || null,
    roboticTraffic: !!o.roboticTraffic,
    fleetDwelling: !!o.fleetDwelling,
    scoutFlagship: false,
    faction: o.faction || 'alliance',
    capital: o.capital || null, // faction id when this system is that fleet's home (#stage6)
    dragonToMars: !!o.dragonToMars, // #8: a Crew Dragon cruising Earth → Mars
    special: true,
    event: !!o.event,
    deathStar: o.deathStar || null, // an in-system battle station (#10)
  };
}

/** #13 — a 1:1 replica of our Solar System. */
export function generateSolarSystem() {
  return makeSpecialSystem({
    seed: 'sol-system',
    name: 'Système solaire',
    status: 'inhabited',
    statusLabel: 'Maison Terre',
    starLabel: 'Soleil (G)',
    starDesc: 'Le nain jaune, notre maison',
    starColor: '#ffd66b',
    starRadius: 4.0,
    activity: 0.45,
    ageGyr: 4.6,
    description:
      'Huit mondes sur les fils de gravité autour du nain jaune, le troisième du soleil, une goutte bleue de vie, la seule maison connue de l\'esprit.',
    history:
      'Il y a 4,6 milliards d\'années, un disque de pulvérisation a allumé la vie sur la 3ème planète, puis l\'esprit qui a regardé les étoiles pour la première fois.',
    resources: ['Eau', 'fer et nickel', 'Métaux rares', 'hélium-3'],
    useFor: 'Le berceau de l\'humanité',
    fact: 'La lumière du Soleil va jusqu\'à la Terre pendant environ huit minutes.',
    ships: 1,
    comets: 2,
    civLevel: 'spacefaring',
    faction: 'alliance',
    dragonToMars: true, // a Crew Dragon cruising from Earth to Mars (#8)
    planetSpecs: [
      { label: 'Mercure', biome: 'rocky', radius: 0.35, color: '#8c7853' },
      { label: 'Vénus', biome: 'desert', radius: 0.6, color: '#e8c879' },
      {
        label: 'Terre',
        biome: 'earthlike',
        radius: 0.65,
        moonCount: 1,
        inhabited: true,
        // realistic level (#8): the ISS — a modest modular station, not a ring-city —
        // plus a busy belt of small satellites; no interstellar fleet.
        homeStationKind: 'outpost',
        satellites: 7,
        civLabel: 'L\'ère de l\'espace',
        ref: 'La Terre de  fait la paix bleue de l\'eau et de l\'air, seule maison connue pour vivre et être intelligente, et la basse orbite est couverte par des satellites et une station habitée; jusqu\'à présent, seules les sondes, les premiers vaisseaux, sont en route vers les mondes voisins.',
        race: {
          name: 'Humanité',
          stageLabel: 'L\'ère de l\'espace',
          lore: [
            'Curieusement, il a à peine quitté sa planète: quelques empreintes sur la lune, quelques sondes près des mondes voisins et une passion pour Mars.',
            'Leur faible orbite est fortement flétrie par les satellites de communication et d\'observation, et la seule station habitée qu\'ils partagent est divisée en une seule station.',
          ],
          description: 'Une vue curieux qui a à peine dépassé la planète, mais qui rêve déjà des étoiles.',
        },
      },
      { label: 'Mars', biome: 'desert', radius: 0.4, color: '#c1440e', moonCount: 2 },
      // Only Saturn wears visible rings: the real ring systems of Jupiter, Uranus
      // and Neptune are far too faint to read at this art scale, and four ringed
      // giants in a row made the system look wrong (owner report, 2026-07-03).
      { label: 'Jupiter.', biome: 'gas', radius: 3.2, color: '#d8a06b', moonCount: 4 },
      { label: 'Saturne', biome: 'gas', radius: 2.9, color: '#e3c681', hasRings: true, moonCount: 4 },
      { label: 'Uranium', biome: 'ice', radius: 1.8, color: '#9fe3e0', moonCount: 4 },
      { label: 'Neptune', biome: 'ice', radius: 1.75, color: '#2a5ccb', moonCount: 4 },
    ],
  });
}

/** #19 — a Dead Space-flavoured dead world easter egg (frozen race + living moon). */
export function generateDeadSpace() {
  return makeSpecialSystem({
    seed: 'deadspace',
    name: 'Quarantaine Noire',
    status: 'ruins',
    statusLabel: 'Les ruines:',
    starLabel: 'Nain rouge (M)',
    starDesc: 'Il a à peine coulé au-dessus d\'une colonie morte.',
    starColor: '#ff7a55',
    starRadius: 2.6,
    activity: 0.3,
    ageGyr: 4.6,
    description:
      'La colonie est silencieuse depuis 12 ans, mais quelque chose à l\'intérieur respire encore, les mineurs ont levé l\'obélisque rouge de l\'Égide VII et les morts ont cessé d\'être morts, et sur le bord froid du système, sous les kilomètres de glace de Tau-Volantis, dorment ce qui était prévu.',
    history:
      'On a fait irruption dans la planète pour le minerai jusqu\'à ce qu\'on ait relevé le panneau. D\'abord, la colonie est sourde à cause du chuchot, puis le vaisseau de sauvetage est resté en orbite comme un sarcophage flottant.',
    resources: ['minerai dense', 'Épaisseur de la plaque', 'isotope rouge', 'Régolit abandonné'],
    useFor: 'Colonie minière abandonnée/zone de quarantaine',
    fact: 'Parfois, il vaut mieux laisser les plus précieuses découvertes là où elles dorment.',
    ships: 0,
    comets: 1,
    planetSpecs: [
      { label: 'Angles de Tenebre', biome: 'lava', radius: 0.55, dead: true }, // scorched inner world
      {
        label: 'Égide VII',
        biome: 'rocky',
        radius: 0.7,
        dead: true,
        destroyed: true,
        ishimura: true, // the USG Ishimura hangs over it, cracking the crust (#5)
        ref: 'Egida VII  ce monde noir et orange rocheux, avec un noyau fondu et une proie illégale, où l\'on a relevé l\'obélisque rouge et la colonie est devenue folle et les morts ont cessé d\'être morts.',
      },
      {
        label: 'Tau Volantis',
        biome: 'ice',
        radius: 0.85,
        dead: true,
        moonCount: 1,
        ref: 'Tau-Volantis ♪ une planète gelée à l\'extrémité lointaine de l\'espace étudié, sous ses infinies glaces, une civilisation ancienne a gelé le Frère de la Lune ♪ un énorme esprit né de la nécromorphe des Signaux. L\'excursion qui a déchiré l\'épidémie dans l\'embryon a trouvé sa source ici.',
        race: {
          name: 'Bâtisseurs de Signes',
          stageLabel: 'La civilisation morte',
          extinct: true,
          lore: [
            'Il y a des millions d\'années, un peuple ancien a gelé le frère de la Lune sous des kilomètres de glace, au prix de sa propre mort, pour qu\'il ne se réveille pas.',
            'Il ne reste que des voitures sous la glace, et des panneaux dont les blagues ont survécu à leurs créateurs.',
          ],
        },
      },
    ],
  });
}

/** #20 — easter-egg worlds nodding to famous sci-fi (lightly anonymised). */
export function generateFilmWorlds() {
  const K = { label: 'Nain orange (K)', desc: 'Satellite chaud de la grande étoile', color: '#ffce8e', radius: 3.0 };
  return [
    makeSpecialSystem({
      seed: 'film-twinsun',
      name: 'Deux-Soleils',
      status: 'wild',
      statusLabel: 'Dragine: Deux soleils',
      starLabel: 'Étoile jaune (G)',
      starDesc: 'La plus grande des deux étoiles',
      starColor: '#ffd98a',
      starRadius: 3.5,
      binary: { star2: K, separation: 9 },
      ageGyr: 8.0,
      description:
        'La zone de poussière de la galaxie, où le coucher du soleil arrive deux fois, où les agriculteurs se font vomir d\'air chaud, et où les tavernes sont en train de rassembler des chasseurs de têtes et des pilotes de réputation douteuse.',
      history: 'C\'est là que le garçon a commencé à tourner le dos à la galaxie.',
      resources: ['Humidité d &apos; air', 'Pièces de rechange pour droïdes', 'Trafic', 'Combustibles bon marché'],
      useFor: 'Poste de transit des contrebandiers',
      fact: 'Deux soleils au coucher du soleil et deux ombres dans le dos.',
      ships: 2,
      planetSpecs: [
        {
          label: 'Tatooine',
          biome: 'desert',
          radius: 0.7,
          color: '#d8b46a',
          ref: 'Tatuine  ce monde désertique sous deux soleils, à la périphérie de la galaxie, au carrefour des chemins de contrebande, le pays de Luc Skywalker, et le cosmoport de Mos-Isley, où se rencontrent des marchands, des chasseurs de têtes et des pilotes de réputation douteuse.',
        },
        { label: 'Skeet Skeet', biome: 'rocky', radius: 0.5 },
      ],
    }),
    makeSpecialSystem({
      seed: 'film-spice',
      name: 'Frontière des Épices',
      status: 'inhabited',
      statusLabel: 'Pureté',
      starLabel: 'Géant blanc et bleu (B)',
      starDesc: 'Le monde sans eau brûle',
      starColor: '#cdddff',
      starRadius: 4.4,
      ageGyr: 6.0,
      description:
        'Un monde sans une goutte de pluie et plus cher que tous les autres, où des vers énormes dorment sous des dunes sans fin, et où chaque pas imprudent dans le rythme du sable peut les réveiller.',
      history: 'Celui qui tient ces sables tient la gorge entière de la galaxie: sans Cavité, il n\'y a pas de longs vols.',
      resources: ['Câble', 'Eau au poids de l &apos; or', 'Dents de vers', 'Des flics salés'],
      useFor: 'La seule source de la Crèche',
      fact: 'Celui qui contrôle la Crèche contrôle l\'univers.',
      ships: 3,
      civLevel: 'spacefaring',
      faction: 'imperial',
      planetSpecs: [
        {
          label: 'Arrakis',
          biome: 'desert',
          radius: 0.9,
          color: '#caa35f',
          inhabited: true,
          ref: 'Arracis (Dune) ♪ Le monde le plus dangereux et le plus précieux de l\'univers connu est le désert entier et la seule source d\'épices mélangéacées sans laquelle il n\'y a pas de transport interstellaire ♪ ♪ Des vers chiais houlous géants dorment sous les dunes ♪ ♪ et les frimens autochtones couvrent chaque goutte d\'eau ♪ (Dune)',
          race: {
            name: 'Fremen',
            stageLabel: 'Civilisation spatiale',
            description: 'Les habitants des dunes en dysticombes, qui ramassent une goutte d\'humidité des corps, leurs yeux bleus de la Créature.',
          },
        },
      ],
    }),
    makeSpecialSystem({
      seed: 'film-jungle',
      name: 'Lune des Tempêtes',
      status: 'inhabited',
      statusLabel: 'Luna-Jungli',
      starLabel: 'Étoile jaune (G)',
      starDesc: 'réchauffe la lune lointaine',
      starColor: '#ffe7a0',
      starRadius: 3.6,
      ageGyr: 3.0,
      description:
        'La lune-jungley, qui brille dans la nuit et respire comme une seule créature, les forêts scintillant dans le noir, et les montagnes entières s\'échauffent dans le ciel dans les courants magnétiques.',
      history: 'Les Bleus vivent en harmonie avec la forêt qui est enchaînée dans un réseau vivant, les aliens se battent profondément derrière une pierre inestimable sans comprendre qu\'ils se battent contre la planète.',
      resources: ['Minéraux en phase de fusion', 'Flore de bioluminescence', 'Alliages rares', 'Réseau de bois vivant'],
      useFor: 'Extraction de minéraux super-minimaux',
      fact: 'Chaque arbre garde la mémoire de ses ancêtres.',
      ships: 3,
      civLevel: 'spacefaring',
      faction: 'precursor',
      planetSpecs: [
        {
          label: 'Poliphème',
          biome: 'gas',
          radius: 3.0,
          color: '#b9a06a',
          hasRings: true,
          moonCount: 2,
          ref: 'Le géant gazier Alpha Centauri, appelé cyclope de mythes, a 14 satellites, et la plus célèbre est la lune habitée de Pandore.',
        },
        {
          label: 'Pandora',
          biome: 'jungle',
          radius: 0.85,
          inhabited: true,
          moonCount: 1,
          ref: 'Pandora  ce qui est une lune habitée de l\'Étoile du gaz de Poliphem, couverte de jungles bioluminescentes et de montagnes qui flottent dans le ciel. La maison du peuple bleu Nahvi, pour le plus rare des anobtaniums, se déchaîne, sans savoir qu\'ils se battent contre la planète la plus vivante.',
          race: {
            name: 'Na’vi',
            stageLabel: 'La civilisation tribale',
            description: 'Des chasseurs bleus, qui se sont mis à se frotter à la neurose vivante de leur forêt.',
          },
        },
      ],
    }),
    makeSpecialSystem({
      seed: 'film-ice',
      name: 'Flou glacé',
      status: 'inhabited',
      statusLabel: 'Un monde glacé: base',
      starLabel: 'Étoile blanche et bleue (A)',
      starDesc: 'Il brille, mais il ne réchauffe pas.',
      starColor: '#dfe8ff',
      starRadius: 4.0,
      ageGyr: 9.0,
      description:
        'Un monde gelé, où la nuit tue plus vite que n\'importe quel ennemi, où la mer éternelle enterre tout vivant sous la neige, et où il y a dans les cavernes de glace une bête dont les griffes ne connaissent pas la pitié.',
      history: 'Les rebelles se sont réfugiés dans les tunnels sous la glace et patrouillent le désert blanc sur les lézards.',
      resources: ['glace', 'Chaleur géothermique', 'Peaux de tétons', 'Couverture glacée'],
      useFor: 'Base secrète des rebelles',
      fact: 'Quand les fortifications s\'envolent, le combat pour le glacier prend la décision.',
      ships: 3,
      civLevel: 'spacefaring',
      faction: 'alliance',
      planetSpecs: [
        {
          label: 'Hoth',
          biome: 'tundra',
          radius: 0.8,
          inhabited: true,
          ref: 'Hot ♪ une planète glacée où la nuit tue plus vite que n\'importe quel ennemi. Dans ses grottes, la base rebelle Echo est cachée jusqu\'à ce que l\'Empire explose sur elle les fortifications AT-AT. Les tauntowns locaux servent d\'animaux supérieurs et les trous de glace contiennent un vampire en colère.',
          race: {
            name: '♪ Les rebelles de la base ♪',
            stageLabel: 'Civilisation spatiale',
            description: 'Des rebelles têtus qui cachent la flotte dans des grottes glaciaires et ne se rendent pas au bord de la mort.',
          },
        },
        { label: 'Satellite de gouttière', biome: 'ice', radius: 0.4 },
      ],
    }),
  ];
}

/** #stage6 — the six faction HOME systems ("capitals"): one hand-crafted system
 *  per fleet faction, settled by it (fixed `faction`, no round-robin), flying
 *  its CANONICAL named flagship and flagged `capital: <factionId>` so the map
 *  can ink their markers in the faction colour. Appended to the catalog AFTER
 *  every existing special — adding them shifts no prior rng draw. */
export function generateFactionCapitals() {
  return [
    makeSpecialSystem({
      seed: 'capital-alliance',
      name: 'Premier Chantier',
      status: 'inhabited',
      statusLabel: 'Alliance, capitale',
      capital: 'alliance',
      faction: 'alliance',
      civLevel: 'spacefaring',
      starLabel: 'Nain orange (K)',
      starDesc: 'Un foyer calme au - dessus des pastilles communes',
      starColor: '#ffce8e',
      starRadius: 3.0,
      activity: 0.5,
      ageGyr: 6.2,
      description:
        'Le système est calme, le nain orange, où les aélars sont le premier chantier de la galaxie à arriver, à se réinitialiser, à s\'inscrire, et le phare bleu du premier Verfi est visible avant la station.',
      history:
        'Après la guerre, les survivants ont amené ce qui restait de leurs quais et ont mis les débris dans une seule station.',
      resources: ['Acier de bateau', 'alliages de soudure', 'Hélium de carburant de Ballast', 'Cartes de navigation'],
      useFor: 'La capitale de l\'Alliance des Verfe libre',
      fact: 'Le contrat n\'est pas signé par l\'encre, mais par la soudure: les signatures sont apposées sur la cloison de l\'ancien dock et ne sont jamais peintes.',
      ships: 5,
      comets: 1,
      flagshipOverride: {
        name: 'Havre Silencieux',
        lore: [
          '♪ La Havane Silence ♪ ♪ Un porte-avions à deux coques, un vaisseau-chef de classe ♪ ♪ La Havane ♪: deux bâtiments reliés par un pont de quai, où se trouvent les chasseurs, et une corvette endommagée.',
          'Elle a été rassemblée dans deux bâtiments inoccupés abandonnés par la guerre sur des statues brisées, et le pont de la jetée est devenu un atelier commun aux survivants avant la signature du Traité. La cloison a été battue avec les noms des équipages qu\'elle a retirés des navires qu\'elle avait condamnés à l\'Empire et à Roy, et la liste a été dépassée pour 6 000 dollars. Les Navigateurs de l\'Alliance ont un proverbe: "N\'as-tu pas de quoi aller, va vers Havani?"',
        ],
      },
      planetSpecs: [
        {
          label: 'Aela',
          biome: 'earthlike',
          radius: 0.72,
          moonCount: 1,
          inhabited: true,
          civLabel: 'Le monde des Aélars',
          ref: 'Le monde des Aelars est petit, les petites villes le long des côtes, les champs d\'atterrissage au lieu des cosmoports, les vieilles chansons dans le rythme du travail, le velours de l\'équateur est le premier à voir un vaisseau qui entre dans le système, et les Aelaras disent que la planète ♪ est aussi un doc, juste très vieux.',
          race: {
            name: 'Aelari',
            stageLabel: 'Civilisation spatiale',
            lore: [
              'Les Aélaras n\'aiment pas les paroles et les vœux longs: ils pensent que la promesse faite deux fois a été dévorée à moitié.',
              'Leurs enfants apprennent à faire des sutures avant d\'écrire: le premier signe d\'un album aélarien, un fil de soudage, et les vieilles chansons d\'aélar chantent dans le rythme du travail, et dans les quais, elles sont prises dans toutes les langues de l\'Alliance.',
              'Les Navigateurs Aélars sont célèbres pour leur retour, pas par le chemin le plus rapide, ni par le plus court \'qu\'ils ramèneront tout le convoi.',
            ],
            description: 'Un peuple de chantier, les meilleurs soudeurs et les meilleurs navigateurs de l\'Alliance.',
          },
        },
        {
          label: 'Stage',
          biome: 'rocky',
          radius: 0.55,
          colony: true,
          ref: 'Le monde industriel est un monde de fonderies, des grues orbitales, des rotations qui ne cessent pas de s\'arrêter à la signature du Traité, et il y a une feuille de blindage pour la moitié de la flotte de l\'Alliance, le nom de la planète a été donné par les dockers et il a été gagné avant d\'être atteint dans les atlas.',
        },
        {
          label: 'Ballast',
          biome: 'gas',
          radius: 2.6,
          moonCount: 3,
          gasStation: true,
          ref: 'Un géant du gaz avec trois lunes, un quai de carburant, ses nuages sont gardés par des monteurs, et des équipes de ravitaillement sur les lunes, qui connaissent chaque bateau-citerne par la voix des moteurs, un endroit calme avec le plus ennuyeux et le plus important du système.',
        },
      ],
    }),
    makeSpecialSystem({
      seed: 'capital-imperial',
      name: 'Trône de Cendres',
      status: 'inhabited',
      statusLabel: 'L\'Empire de Peplá, capitale',
      capital: 'imperial',
      faction: 'imperial',
      civLevel: 'spacefaring',
      starLabel: 'Étoile blanche (A)',
      starDesc: 'Feu froid et clair au-dessus de la cendre',
      starColor: '#f2f5ff',
      starRadius: 4.6,
      activity: 0.28,
      ageGyr: 3.8,
      description:
        'Le système de l\'Empire Peplá sous l\'étoile blanche froide de classe A. Il y a ici un champ de débris de la blessure de Hesht qui entoure l\'État, le monde trébuché de la Conquête, le plus fort chantier de la galaxie.',
      history:
        'Avant la guerre, le système de St. Flags portait un nom différent; il n\'est maintenant prononcé que sur les listes funèbres. Quand Hasht s\'est brisé, les survivants n\'ont pas quitté les ruines des autres et se sont relogés sur la tombe voisine de la Nakoval. Depuis lors, c\'est la seule capitale de la galaxie sur laquelle on voit toujours la faiblesse.',
      resources: ['Acier blindé', 'Navals militaires du cycle complet', 'Deutérium glacé de Bednia', 'Des fragments de Heshta, un sanctuaire, pas un produit.'],
      useFor: 'La capitale de l\'Empire Peplá',
      fact: 'Chaque vaisseau impérial porte des fragments de Hesht qui se brisent avant tout l\'acier.',
      ships: 5,
      comets: 1,
      flagshipOverride: {
        name: 'Veillée',
        lore: [
          '♪ Trysna ♪ ♪ Un dragon noir de quatre mètres de haut avec des lames de marquage acariens, la classe de drapeau de l\'Empire Pepla: un vaisseau de combat et une salle de commémoration sous un même blindage.',
          'La tête de la Trisna, qui est constituée d\'une armure de vaisseaux tués lors de la rupture de Hesht, est entourée d\'une queue de bois qui est entourée du plus grand fragment jamais soulevé dans le champ des débris. La classe n\'est pas présente dans les parades: .. La Trisna, qui quitte le doc, n\'est pas encore à la recherche de l\'Empire.',
        ],
      },
      planetSpecs: [
        {
          label: 'Hesht',
          biome: 'rocky',
          radius: 0.7,
          dead: true,
          destroyed: true,
          ref: 'Le monde des hachts, qui est brisé: au lieu de la planète  ce champ de débris qui tourne lentement; le saint et la blessure; ici, il n\'y a pas de silence, et le moteur se ferme à la limite du champ. La seule chose qu\'on trouve ici, c\'est des fragments de cortex pour les bateaux neufs.',
        },
        {
          label: 'L’Enclume',
          biome: 'rocky',
          radius: 0.62,
          moonCount: 1,
          inhabited: true,
          civLabel: 'Le Trône des Hashts',
          ref: 'Le monde du Trône de l\'Empire: les villes noires harsenales, entassées dans les dorsales rocheuses, la force annulaire en orbite et le ciel, où Hash est toujours vu, où se trouve le Trône de Pépé et où se trouve toute la flotte impériale.',
          race: {
            name: 'Hesht',
            stageLabel: 'Civilisation spatiale',
            lore: [
              'Les Hashts de l\'Empire des Peplas, qui ont survécu à la destruction de leur propre monde dans la guerre des St. Flags, leur culture est construite autour de leur mémoire: les noms des morts portent les navires, les rues et les enfants.',
              'Les hashts ont une maladie, non pas une faiblesse, mais une discipline: ceux qui se souviennent sont tristes, mais ceux qui ne se reproduisent pas. D\'où leur serment de ne plus jamais être vulnérables.',
              'Et les hashts ne sont pas cruels, mais ils ne sont pas égaux aux autres peuples: un étranger peut vivre sous la protection de l\'Empire et construire ses vaisseaux, et il ne deviendra pas un citoyen.',
            ],
            description: 'Un peuple divisé qui a transformé le deuil en discipline et le serment de ◆ en État.',
          },
        },
        {
          label: 'Écoute',
          biome: 'ice',
          radius: 0.9,
          colony: true,
          ref: 'Le monde de la garnison est à l\'extérieur du système, sous la croûte de la glace de la caserne, les entrepôts pendant des décennies de siège et de dragage rapide, et la garde est silencieuse et appelée "le veilleur."',
        },
      ],
    }),
    makeSpecialSystem({
      seed: 'capital-swarm',
      name: 'Premier Jardin',
      status: 'inhabited',
      statusLabel: 'La capitale Roy',
      capital: 'swarm',
      faction: 'swarm',
      civLevel: 'spacefaring',
      starLabel: 'Nain jaune (G)',
      starDesc: 'Le soleil chaud au-dessus du monde',
      starColor: '#fff0cc',
      starRadius: 3.5,
      activity: 0.45,
      ageGyr: 5.1,
      description:
        'Le nain jaune chaud et les trois mondes dans l\'affaire: la terre éphémère sous la jungle, l\'océan chenillé où les jeunes kilis se mettent à planter, et le géant gazier avec les pâturages polypotiques. Aucun nom ici n\'a été donné par les propriétaires du système .. les cartels étrangers ont appelé, et Roy n\'a pas contesté, parce qu\'il n\'a pas remarqué.',
      history:
        'Les cartographes ont trouvé le système des décennies après le premier contact, et ils ont suivi les courants de disputes contre le flux, comme ils cherchaient l\'origine de la rivière.',
      resources: ['Chitine de vaisseau', 'Différends', 'Gomme bioluminescente', 'Gaz polypique'],
      useFor: 'La princesse Roy',
      fact: 'Tous les noms de ce système ont été donnés par les autres . Roy lui-même n\'a rien dit, même lui-même.',
      ships: 4,
      comets: 2,
      flagshipOverride: {
        name: 'Colosse',
        lore: [
          '♪ Ispolin ♪ ♪ Le plus vieux des léviathans de Roy, 400 mètres de chitine vivante, les côtes de côtes et la lumière violette lente au fond de la carapace ♪ ♪ Il n\'y a pas de créature ♪',
          'Les scouts de l\'Alliance ont donné leur nom: loin, quand il conduit une meute le long de la frontière, sa silhouette à bosse ferme la moitié du ciel, comme si une île s\'était retirée; un jour, il a traversé le blocus impérial sans changer de cap ni avoir fait une seule balade. La seule chose qu\'il a fait est de s\'éloigner de l\'itinéraire de Pretech.',
        ],
      },
      planetSpecs: [
        {
          label: 'Berceau',
          biome: 'jungle',
          radius: 0.8,
          inhabited: true,
          civLabel: 'Le monde de la radée de Roy',
          ref: 'La paix-rade, une ville verte, sans feu unique, ne s\'y construira pas, et elle pousse ici, et il y a une bague de ruches plantée en orbite, qui est visible de la surface comme une étoile lyrique lente la nuit. On considère que c\'est l\'ancêtre du Sphère, même si le Spult ne compte rien.',
          race: {
            name: 'Progéniture',
            stageLabel: 'Civilisation spatiale',
            lore: [
              '♪ Le nom d\'un atlas étranger est le nom d\'un homme ♪ ♪ Le premier cartographe l\'a enregistré comme un phénomène météo ♪ ♪ le vent ♪ et l\'amendement n\'a été effectué que la moitié. Il ne s\'appelle pas lui-même ♪ ♪ le nom d\'un homme qui se distingue des autres ♪',
              'Qu\'est-ce que la personne distincte de Springs ? La question sans réponse: la créature, le récif, la prune de la roche et la vague de lumière dans la meute ♪ une créature ou un milliard de dollars dépend de la façon dont on coupe.',
              'Il n\'est ni en colère ni en colère, et il pousse comme une marée qui monte dans le lit, lentement, sans intention et sans arrêt.',
            ],
            description: 'Monorasa est un collectif, une bande de créatures de toutes les nations qui se baladent entre les étoiles.',
          },
        },
        {
          label: 'Pythonique',
          biome: 'ocean',
          radius: 0.75,
          colony: true,
          ref: 'Le monde de l\'océan: les broyeurs chauds sont des kilis, et la nuit, l\'eau brille le long de la côte, et les vieux bateaux  les spiritueux viennent mourir avec des récifs, et une nouvelle génération s\'y développe.',
        },
        {
          label: 'Le pasteur',
          biome: 'gas',
          radius: 2.4,
          moonCount: 2,
          gasStation: true,
          ref: 'Un géant du gaz qui fait couler des troupeaux de polypes de gaz dans les nuages supérieurs, et parmi les sauvages, les monteurs de Roy ♫, qui se déchauffent, se déversent et s\'envolent vers l\'orbite, se tiennent en haut et sont jaloux.',
        },
      ],
    }),
    makeSpecialSystem({
      seed: 'capital-syndicate',
      name: 'Méridien Zéro',
      status: 'inhabited',
      statusLabel: 'Capitale:',
      capital: 'syndicate',
      faction: 'syndicate',
      civLevel: 'spacefaring',
      starLabel: 'Étoile blanche (A)',
      starDesc: 'Lumière stérile au-dessus du méridien zéro',
      starColor: '#f2f5ff',
      starRadius: 4.6,
      activity: 0.28,
      ageGyr: 4.4,
      description:
        'Une étoile blanche de classe A et trois actifs sur son bilan . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .',
      history:
        'Le système n\'a pas été colonisé par  un évêque: après la guerre de St. Flags, le Syndicat l\'a rachetée avec les dettes des anciens propriétaires et a transféré ici le siège de la ville, et depuis, Premier a été construit par une ville pleine de verre, et une montre de référence a été lancée en orbite pour garantir les transactions de la moitié de la galaxie.',
      resources: ['Permis de transport', 'Temps de référence', 'Métaux rares Actif 2', 'Réserve à terme pour carburant'],
      useFor: 'Siège du Syndicat de Meridian',
      fact: 'Aucune transaction n\'est considérée comme close tant qu\'elle n\'a pas été confirmée par la montre de référence de Prime.',
      ships: 4,
      comets: 1,
      flagshipOverride: {
        name: 'Bloc de Contrôle',
        lore: [
          '♪ Un sac de contrôle ♪ ♪ un graphite de quatre mètres de long ♪ ♪ un bocal de druit ♪ ♪ un bocal de prédateur ♪ ♪ un cyane de nez à duce ♪ ♪ des batteries qui dorment le long de la dorsale ♪',
          'Il est enfermé dans les tranchées d\'un chantier de navals racheté à la flotte morte, et le Syndicat appelle ça de la prudence. Aucun tir n\'a été enregistré derrière le vaisseau; cependant, dans une douzaine de systèmes, son arrivée en orbite a été prise dans la chronique par le mot "absorptions ."',
        ],
      },
      planetSpecs: [
        {
          label: 'Prime',
          biome: 'earthlike',
          radius: 0.7,
          satellites: 9,
          inhabited: true,
          civLabel: 'Siège du Syndicat',
          ref: 'La ville entière sous la vitre, au-dessus de laquelle se trouve le hab annulaire du Meradian zéro, qui sert à compter tous les itinéraires de la galaxie, est entourée de dizaines de races ∙ Le Syndicat engage tous les signataires.',
        },
        {
          label: 'Actif 2',
          biome: 'rocky',
          radius: 0.5,
          colony: true,
          ref: 'L\'actif de production: un monde rocheux, développé d\'un tiers et surestimé dans le sens large. Les villes de mine louent de l\'air à la société .',
        },
        {
          label: 'Réserve',
          biome: 'gas',
          radius: 2.8,
          moonCount: 2,
          gasStation: true,
          ref: 'Un géant du gaz qui vend du carburant à la moitié de la galaxie, les collecteurs blancs pendent dans les couches supérieures comme des candelabres, le prix du deutérium naît ici deux fois par jour.',
        },
      ],
    }),
    makeSpecialSystem({
      seed: 'capital-cartel',
      name: 'Port-Libre',
      status: 'inhabited',
      statusLabel: 'Cartel, capitale',
      capital: 'cartel',
      faction: 'cartel',
      civLevel: 'spacefaring',
      starLabel: 'Nain rouge (M)',
      starDesc: 'Un foyer de marge',
      starColor: '#ff8a55',
      starRadius: 2.6,
      activity: 0.55,
      ageGyr: 7.3,
      description:
        'Un nain rouge épais au bord de la manche, qui n\'avait besoin de personne jusqu\'à ce que tous ceux qui n\'avaient nulle part où aller, grandissent autour de lui le plus vieux port libre de la galaxie: les cales de boudin au gaz, les bouées de dépotage et les docks où les plaques ne s\'éteignent pas.',
      history:
        'Les premiers navires sont arrivés à la fin de la guerre, les St. Flags, les déserteurs et les réfugiés, qui n\'attendaient pas sous un drapeau, et le premier dock a été ramassé à bord de leurs propres bateaux, et les invités suivants n\'ont plus été chassés: chasser le fugitif signifie faire ce qu\'il a fui lui-même.',
      resources: ['Débris de bateau', 'Gaz de carburant', 'Blocs soudés', 'Trafic'],
      useFor: 'Port libre principal du cartel',
      fact: 'Aucun homme n\'a été identifié comme étant la seule statistique qui soit honnête à La Havane.',
      ships: 5,
      comets: 2,
      flagshipOverride: {
        name: 'La Matrone',
        lore: [
          '♪ Maman ♪ ♪ Le drapeau ♪ ♪ Le drapeau ♪ ♪ Le cartel du cartel libre: 400 mètres de corps étrangers, 40 écluses, docks, marchés et 2 000 équipage ♪ ♪ Pas tant un vaisseau de combat que le port volant qui arrive là où il n\'y a pas de port ♪',
          'La dernière année, la guerre des St. Flags a commencé à se faire à partir de navires qui avaient quitté leur flotte et qui ne pouvaient pas revenir. La coque a été dotée de plaques visibles de six chantiers différents, et aucune n\'a été repeinte: qu\'on voie de quoi est faite la maison. Quand la maman est venue au port, cela signifie que tout est là, il y a maintenant des endroits où aller.',
        ],
      },
      planetSpecs: [
        {
          label: 'Le Gros',
          biome: 'gas',
          radius: 3.0,
          moonCount: 3,
          gasStation: true,
          ref: 'Un géant gazier chevelu autour duquel la vie de La Havane est en train de tourner: des collecteurs de gaz, des centaines de docks, des bateaux à cheval à l\'horizon. Il n\'y a pas de télécommande, et elle est respectée ici plus que les lois.',
        },
        {
          label: 'Beaucoup.',
          biome: 'rocky',
          radius: 0.5,
          inhabited: true,
          homeStationKind: 'outpost',
          civLabel: 'Port libre',
          ref: 'Le monde de pierre, rempli de débris de trois siècles, où les vaisseaux sont découpés, remorqués et relâchés, vit sur un tas de déserteurs de toutes races, des mineurs et leurs petits-enfants qui ont cessé de se partager par le sang, et où l\'avant-poste est en orbite, à moitié douane, moitié marché, et les deux moitiés mentent.',
        },
        {
          label: 'Cave',
          biome: 'ice',
          radius: 0.7,
          ref: 'Le monde glacé en orbite longue, avec des crevasses qui cachent une cargaison qui ne devrait pas exister et des gens qu\'il ne faut pas trouver.',
        },
      ],
    }),
    makeSpecialSystem({
      seed: 'capital-precursor',
      name: 'Hall du Silence',
      status: 'inhabited',
      statusLabel: 'Capitale · Précédents',
      capital: 'precursor',
      faction: 'precursor',
      civLevel: 'spacefaring',
      starLabel: 'Étoile jaune-blanc (F)',
      starDesc: 'Très vieille lumière',
      starColor: '#fff7ea',
      starRadius: 4.0,
      activity: 0.3,
      ageGyr: 11.8,
      description:
        'Le système d\'une étoile jaune blanche très ancienne, autour de laquelle tout est en place, comme si elle venait d\'être réparée. Au-dessus de la tablette désertique, il y a un hub doré de fragments qui explosent, et sous la glace, les archives dorment des entrepôts non fermés. Les cartes des six flottes indiquent le système de la même façon: ne pas interférer.',
      history:
        'Personne ne se souvient de ce système jeune: il était sur les cartes les plus anciennes et il n\'a pas changé sur une nouvelle, la guerre de St Flags l\'a traversé comme une rivière qui passe la pierre, les propriétaires sont partis bien avant toutes les chroniques ♪ mais les villes sont balayées, et le jardin sur les tablettes est encore en train d\'être arrosé.',
      resources: ['Bronze runique', 'la lumière de retenue', 'alliages anciens de fragments', 'Archives endormies'],
      useFor: 'Le dernier port de Preetech',
      fact: 'Personne n\'a rencontré les propriétaires, mais il n\'y a pas de poussière.',
      ships: 3,
      comets: 1,
      flagshipOverride: {
        name: 'Celui qui est resté',
        lore: [
          '♪ Qui reste ♪ ♪ Le vaisseau-rune doré ♪ ♪ Le monolith-obélisque dans la bague des éclats ♪ ♪ Le plus grand des vaisseaux ♪',
          'Le seul vaisseau de la Prelette avec un itinéraire circulaire: il ne va nulle part, il ne va nulle part. Dans la guerre de St. Flags, sa ligne a traversé les fronts trois fois, et il a traversé la structure sans ouvrir le feu trois fois, sans jamais se remettre de la construction. Les Navigateurs d\'Aelar ont transféré la rune à son bord en trois mots, et le quatrième débat est en cours au troisième siècle.',
        ],
      },
      planetSpecs: [
        {
          label: 'La Tablette',
          biome: 'desert',
          radius: 0.85,
          inhabited: true,
          civLabel: 'La race aînée',
          ref: 'Un monde désert, dont les villes sont lues comme des lignes de texte. Les rues sont presque vides, mais balayées; le seul jardin est arrosé, bien que les pluies n\'aient pas été des millénaires; et il y a des fragments d\'or au-dessus de la planète, des morceaux de bois, qui sont gardés par la lumière chaude.',
          race: {
            name: 'Précurseurs',
            stageLabel: 'La race aînée',
            lore: [
              'La grande race de la galaxie est partie bien avant toutes les guerres et toutes les histoires où et pourquoi, il n\'y a pas d\'enregistrements, il y a des vaisseaux sur les routes, des villes et des ruines sur les mondes morts.',
              'Ceux qui restent ne voient que rarement: les grandes silhouettes au bout de la rue, toujours corrigées, balancées, arrosées, arrosées; ils ne parlent pas, mais ne les chassent pas; la conversation ne se passe pas.',
              'Les Préstentieux ne se battent pas, pas parce qu\'ils ne savent pas ce qui se passera si on commence.',
            ],
            description: 'Les silhouettes de la race aînée sont très calmes; elles sont rarement vues, de loin et toujours après le travail.',
          },
        },
        {
          label: 'Archives',
          biome: 'ice',
          radius: 0.8,
          ref: 'Le monde des cuves de stockage des glaces. Les portes ne sont pas fermées et les températures sont élevées. C\'est pourquoi personne n\'entre. Une fois par génération, un des cuves de stockage est un peu éclairé de l\'intérieur.',
        },
      ],
    }),
  ];
}

function applyBiome(planet, biomeName) {
  const b = BIOME_KEYS[biomeName];
  planet.type = 'terran';
  planet.biomeName = biomeName;
  planet.biomeLabel = b.label;
  planet.biome = b.biome;
  // synthesise a kind-1 def with the biome palette
  planet.def = { ...PLANET_KINDS.terran, c1: b.ocean, c2: b.land, c3: b.land2, biome: b.biome };
}
