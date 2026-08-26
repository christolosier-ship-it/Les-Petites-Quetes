// Finite archetype catalogs for the codex — the source of truth for its
// honest "N of M" counters and the encyclopedia content behind each find.
// Ship/planet/biome/civ/station data is imported straight from its real
// source so the catalogs can never drift from what the generator produces;
// the hand-crafted special content (easter-egg systems, objects, planets,
// named races) is enumerated here because there's no generator table for it.

import { PLANET_KINDS, RUIN_TYPES } from '../systems/systemData.js';
import { FACTIONS, FACTION_BY_ID } from '../systems/ships/factions.js';
import { ROLES } from '../systems/ships/roles.js';
import { STATION_TYPES } from '../systems/stations.js';
import { FLAGSHIP_LORE, STATION_LORE, FACTION_LORE } from './fleetLore.js';
import { getShipStats } from '../systems/ships/shipStats.js';

const ROLE_BY_ID = Object.fromEntries(ROLES.map((r) => [r.id, r]));

// --- ships: 9 roles × 6 factions = 54, grouped by faction ------------------
// archetypeKey `${factionId}:${roleId}` mirrors buildShip(role, faction)'s own
// argument order (ships.js). `group` (the faction name) drives the section
// headers on the Ships tab.
const SHIP_CATALOG = [];
for (const faction of FACTIONS) {
  for (const role of ROLES) {
    SHIP_CATALOG.push({
      archetypeKey: `${faction.id}:${role.id}`,
      // a faction MAY name its ships itself (Swarm's grown beasts); else the shared role name
      label: (faction.names && faction.names[role.id]) || role.name,
      group: faction.name,
      factionId: faction.id,
      roleId: role.id,
    });
  }
}

// --- stations: 3 types × 6 factions = 18, grouped by faction ---------------
// Each faction styles the same three station shapes differently (createStation
// takes a faction style), so a station archetype is faction × type, keyed
// `${factionId}:${type}` — the same shape as a ship archetype.
const STATION_CATALOG = [];
for (const faction of FACTIONS) {
  for (const st of STATION_TYPES) {
    STATION_CATALOG.push({
      archetypeKey: `${faction.id}:${st.id}`,
      label: st.name,
      group: faction.name,
      factionId: faction.id,
      stationType: st.id,
    });
  }
}

// --- planets: the 7 kinds, as an encyclopedia of TYPES (not instances) ------
const PLANET_KIND_LABELS = {
  lava: 'Planète de lave',
  rocky: 'Planète rocheuse',
  desert: 'Planète désertique',
  terran: 'Planète tellurique',
  ocean: 'Planète océanique',
  ice: 'Planète glacée',
  gas: 'Géante gazeuse',
};
const PLANET_CATALOG = Object.keys(PLANET_KINDS).map((kind) => ({
  archetypeKey: kind,
  label: PLANET_KIND_LABELS[kind] || kind,
  kind,
}));

// --- ruins: the 4 flavours, as a reference of TYPES -------------------------
// Was a biome×type grid (24), but a single galaxy only holds ~15 ruined worlds,
// so it could never complete; the honest, stable unit is the flavour itself.
const RUIN_TYPE_LABELS = {
  plain: 'Ruines sans vie',
  robotic: 'Monde des machines',
  destroyed: 'Monde dévasté',
  obliterated: 'Monde anéanti',
};
const RUIN_CATALOG = RUIN_TYPES.map((t) => ({
  archetypeKey: t,
  label: RUIN_TYPE_LABELS[t] || t,
  ruinType: t,
}));

// --- races: NAMED species (not the generic biome×civ inhabitants) -----------
// Real ones live on a hand-crafted planet and are discovered by visiting it —
// each carries a planetRef so «Перейти к объекту» warps to its homeworld.
// `future: true` races are announced but not yet in the game: they show as
// named-but-locked "coming" cards (grouped under Скоро), never discoverable.
const RACE_CATALOG = [
  { archetypeKey: 'humanity', label: 'Humanité', group: 'Espèces', planetRef: { seed: 'sol-system', label: 'Terre' } },
  { archetypeKey: 'fremen', label: 'Fremen', group: 'Espèces', planetRef: { seed: 'film-spice', label: 'Arrakis' } },
  { archetypeKey: 'navi', label: 'Na’vi', group: 'Espèces', planetRef: { seed: 'film-jungle', label: 'Pandora' } },
  {
    archetypeKey: 'signbuilders',
    label: 'Bâtisseurs de Signes',
    group: 'Espèces',
    planetRef: { seed: 'deadspace', label: 'Tau Volantis' },
  },
  // the faction homeworld races (#stage6) — unlocked by visiting their capital
  { archetypeKey: 'aelari', label: 'Aelari', group: 'Espèces', planetRef: { seed: 'capital-alliance', label: 'Aela' } },
  { archetypeKey: 'hesht', label: 'Hesht', group: 'Espèces', planetRef: { seed: 'capital-imperial', label: 'L’Enclume' } },
  { archetypeKey: 'porosl', label: 'Progéniture', group: 'Espèces', planetRef: { seed: 'capital-swarm', label: 'Berceau' } },
  { archetypeKey: 'precursors', label: 'Précurseurs', group: 'Espèces', planetRef: { seed: 'capital-precursor', label: 'La Tablette' } },
  { archetypeKey: 'necromorphs', label: 'Nécromorphes', group: 'Bientôt', future: true },
  { archetypeKey: 'generative-1', label: 'Espèce inconnue', group: 'Bientôt', future: true },
  { archetypeKey: 'generative-2', label: 'Espèce inconnue', group: 'Bientôt', future: true },
];
const RACE_BY_KEY = Object.fromEntries(RACE_CATALOG.map((r) => [r.archetypeKey, r]));

// --- special: hand-crafted content, grouped системы / объекты / планеты -----
// `seed` — the system to warp to. `view` — a special-object builder key (see
// codexViewer) for «Рассмотреть», where one exists. `planetLabel` — a signature
// planet inside `seed`. `race` — the named race that lives on this planet.
const SPECIAL_CATALOG = [
  // --- системы ---
  { archetypeKey: 'sys-sagittarius', label: 'Sagittarius A*', group: 'Systèmes', seed: 'galactic-core', view: 'blackhole-galactic' },
  { archetypeKey: 'sys-gargantua', label: 'Gargantua', group: 'Systèmes', seed: 'interstellar', view: 'blackhole-gargantua' },
  { archetypeKey: 'sys-sol', label: 'Système solaire', group: 'Systèmes', seed: 'sol-system' },
  { archetypeKey: 'sys-quarantine', label: 'Quarantaine Noire', group: 'Systèmes', seed: 'deadspace' },
  { archetypeKey: 'sys-alderaan', label: 'Secteur Alderaan', group: 'Systèmes', seed: 'death-star' },
  { archetypeKey: 'sys-twinsun', label: 'Deux-Soleils', group: 'Systèmes', seed: 'film-twinsun' },
  { archetypeKey: 'sys-spice', label: 'Frontière des Épices', group: 'Systèmes', seed: 'film-spice' },
  { archetypeKey: 'sys-jungle', label: 'Lune des Tempêtes', group: 'Systèmes', seed: 'film-jungle' },
  { archetypeKey: 'sys-hoth', label: 'Hoth', group: 'Systèmes', seed: 'film-ice' },
  // --- столицы фракций (#stage6) ---
  { archetypeKey: 'sys-cap-alliance', label: 'Premier Chantier', group: 'Systèmes', seed: 'capital-alliance' },
  { archetypeKey: 'sys-cap-imperial', label: 'Trône de Cendres', group: 'Systèmes', seed: 'capital-imperial' },
  { archetypeKey: 'sys-cap-swarm', label: 'Premier Jardin', group: 'Systèmes', seed: 'capital-swarm' },
  { archetypeKey: 'sys-cap-syndicate', label: 'Méridien Zéro', group: 'Systèmes', seed: 'capital-syndicate' },
  { archetypeKey: 'sys-cap-cartel', label: 'Port-Libre', group: 'Systèmes', seed: 'capital-cartel' },
  { archetypeKey: 'sys-cap-precursor', label: 'Hall du Silence', group: 'Systèmes', seed: 'capital-precursor' },
  // --- объекты ---
  { archetypeKey: 'endurance', label: 'Station « Endurance »', group: 'Objets', view: 'endurance', seed: 'interstellar' },
  { archetypeKey: 'ishimura', label: 'USG Ishimura', group: 'Objets', view: 'ishimura', seed: 'deadspace' },
  { archetypeKey: 'deathstar', label: 'Étoile de la Mort « La Main »', group: 'Objets', view: 'deathstar', seed: 'death-star' },
  { archetypeKey: 'dragon', label: 'Crew Dragon', group: 'Objets', view: 'dragon', seed: 'sol-system' },
  // --- планеты ---
  { archetypeKey: 'pl-earth', label: 'Terre', group: 'Planètes', seed: 'sol-system', planetLabel: 'Terre', race: 'humanity' },
  { archetypeKey: 'pl-mars', label: 'Mars', group: 'Planètes', seed: 'sol-system', planetLabel: 'Mars' },
  { archetypeKey: 'pl-alderaan', label: 'Alderaan', group: 'Planètes', seed: 'death-star', planetLabel: 'Alderaan' },
  { archetypeKey: 'pl-aegis7', label: 'Égide VII', group: 'Planètes', seed: 'deadspace', planetLabel: 'Égide VII' },
  { archetypeKey: 'pl-tau', label: 'Tau Volantis', group: 'Planètes', seed: 'deadspace', planetLabel: 'Tau Volantis', race: 'signbuilders' },
  { archetypeKey: 'pl-tatooine', label: 'Tatooine', group: 'Planètes', seed: 'film-twinsun', planetLabel: 'Tatooine' },
  { archetypeKey: 'pl-arrakis', label: 'Arrakis', group: 'Planètes', seed: 'film-spice', planetLabel: 'Arrakis', race: 'fremen' },
  { archetypeKey: 'pl-pandora', label: 'Pandora', group: 'Planètes', seed: 'film-jungle', planetLabel: 'Pandora', race: 'navi' },
  { archetypeKey: 'pl-hoth', label: 'Hoth', group: 'Planètes', seed: 'film-ice', planetLabel: 'Hoth' },
  // --- миры столиц фракций (#stage6) ---
  { archetypeKey: 'pl-aela', label: 'Aela', group: 'Planètes', seed: 'capital-alliance', planetLabel: 'Aela', race: 'aelari' },
  { archetypeKey: 'pl-hesht', label: 'Hesht', group: 'Planètes', seed: 'capital-imperial', planetLabel: 'Hesht' },
  { archetypeKey: 'pl-anvil', label: 'L’Enclume', group: 'Planètes', seed: 'capital-imperial', planetLabel: 'L’Enclume', race: 'hesht' },
  { archetypeKey: 'pl-firstgarden', label: 'Berceau', group: 'Planètes', seed: 'capital-swarm', planetLabel: 'Berceau', race: 'porosl' },
  { archetypeKey: 'pl-prime', label: 'Prime', group: 'Planètes', seed: 'capital-syndicate', planetLabel: 'Prime' },
  { archetypeKey: 'pl-fatman', label: 'Le Gros', group: 'Planètes', seed: 'capital-cartel', planetLabel: 'Le Gros' },
  { archetypeKey: 'pl-tablet', label: 'La Tablette', group: 'Planètes', seed: 'capital-precursor', planetLabel: 'La Tablette', race: 'precursors' },
];
const SPECIAL_BY_KEY = Object.fromEntries(SPECIAL_CATALOG.map((s) => [s.archetypeKey, s]));
const SPECIAL_SYSTEM_BY_SEED = Object.fromEntries(
  SPECIAL_CATALOG.filter((s) => s.group === 'Systèmes').map((s) => [s.seed, s.archetypeKey]),
);
const SPECIAL_PLANET_BY_SEED_LABEL = {};
for (const s of SPECIAL_CATALOG) {
  if (s.group === 'Planètes') SPECIAL_PLANET_BY_SEED_LABEL[`${s.seed}::${s.planetLabel}`] = s;
}

const CATALOGS = {
  planet: PLANET_CATALOG,
  race: RACE_CATALOG,
  ruin: RUIN_CATALOG,
  ship: SHIP_CATALOG,
  station: STATION_CATALOG,
  special: SPECIAL_CATALOG,
};

/** The finite codex categories, in a stable order. 'system' is NOT one of
 *  these — it has no finite catalog (see codex.js's progress()). */
export const CATEGORIES = Object.keys(CATALOGS);

/** @returns {Array|null} the archetype list for `category`, or null if it has
 *  no finite catalog (e.g. 'system'). */
export function catalogFor(category) {
  return CATALOGS[category] || null;
}

// --- recording helpers (main.js) -------------------------------------------

/** The special-system codex key for a system seed, or null if it isn't one of
 *  the hand-crafted systems. Called when the player warps into a system. */
export function specialSystemKey(seed) {
  return SPECIAL_SYSTEM_BY_SEED[seed] || null;
}

// --- the «Фракции» shelf (#stage6) ------------------------------------------
// One section per fleet faction: its chronicle, its capital/race/flagship refs
// and its slice of the ship + station catalogs. Which codex keys belong to
// which faction is enumerated here (there's no generator table for it).
const FACTION_CODEX_REFS = {
  alliance: { capitalKey: 'sys-cap-alliance', raceKey: 'aelari' },
  imperial: { capitalKey: 'sys-cap-imperial', raceKey: 'hesht' },
  swarm: { capitalKey: 'sys-cap-swarm', raceKey: 'porosl' },
  syndicate: { capitalKey: 'sys-cap-syndicate', raceKey: null }, // многорасовый — по контракту
  cartel: { capitalKey: 'sys-cap-cartel', raceKey: null }, // сброд всех рас
  precursor: { capitalKey: 'sys-cap-precursor', raceKey: 'precursors' },
};

/** Everything the codex «Фракции» tab lays out, one item per faction, in the
 *  canonical FACTIONS order. Pure data lookups — no discovery state here. */
export function factionShelf() {
  return FACTIONS.map((f) => {
    const refs = FACTION_CODEX_REFS[f.id] || {};
    const cap = refs.capitalKey ? SPECIAL_BY_KEY[refs.capitalKey] : null;
    const race = refs.raceKey ? RACE_BY_KEY[refs.raceKey] : null;
    return {
      id: f.id,
      name: f.name,
      tagline: f.lore || '',
      capitalKey: refs.capitalKey || null,
      capitalName: cap ? cap.label : '',
      raceName: race ? race.label : 'Mixte',
      flagshipName: (FLAGSHIP_LORE[f.id] || {}).name || '',
      lore: FACTION_LORE[f.id] || null,
      ships: SHIP_CATALOG.filter((c) => c.factionId === f.id),
      stations: STATION_CATALOG.filter((c) => c.factionId === f.id),
    };
  });
}

/** The special-planet catalog entry for a (system seed, planet label), or null.
 *  Its `race` (if any) is the named race that planet unlocks. */
export function specialPlanetFor(seed, label) {
  return SPECIAL_PLANET_BY_SEED_LABEL[`${seed}::${label}`] || null;
}

/** The homeworld ref (seed + planet label) a race entry links to, or null for a
 *  future race with no planet yet. Used by «Перейти к объекту» for races. */
export function racePlanetRef(archetypeKey) {
  const r = RACE_BY_KEY[archetypeKey];
  return (r && r.planetRef) || null;
}

/** The special-object builder key for a special entry (system black hole or a
 *  one-off object), or null — drives «Рассмотреть» / the thumbnail. */
export function specialViewKey(archetypeKey) {
  const s = SPECIAL_BY_KEY[archetypeKey];
  return (s && s.view) || null;
}

/** The (seed, planetLabel) a special-planet entry rebuilds from, or null. */
export function specialPlanetRef(archetypeKey) {
  const s = SPECIAL_BY_KEY[archetypeKey];
  return s && s.group === 'Planètes' ? { seed: s.seed, label: s.planetLabel } : null;
}

/** The system seed a special entry lives in (for «Перейти к объекту»). */
export function specialSeed(archetypeKey) {
  const s = SPECIAL_BY_KEY[archetypeKey];
  return (s && s.seed) || null;
}

/** Does this entry have a standalone 3D form «Рассмотреть» can open? Systems
 *  and races have none; a special is viewable only if it's a black-hole/object
 *  builder or a signature planet with a recorded instance. */
export function isRebuildable(entry) {
  switch (entry.category) {
    case 'ship':
    case 'station':
    case 'planet':
    case 'ruin':
      return true;
    case 'special':
      return !!(specialViewKey(entry.archetypeKey) || (entry.sourceRef && entry.sourceRef.planetIndex != null));
    default:
      return false; // 'system', 'race'
  }
}

// Signature specials (phenomena / named objects) that have a hand-painted card.
// Other specials — planets, races, ordinary systems — have none and keep the
// live 3D render / group glyph.
const HERO_SPECIALS = new Set(['deathstar', 'ishimura', 'dragon', 'endurance', 'sys-sagittarius', 'sys-gargantua']);

/** Optional hand-painted hero illustration for a find. Ships (54: 9 roles × 6
 *  factions, incl. flagship) and stations (18) have a full painted set under
 *  media/hero/<faction>_<role|type>.webp — keyed straight off archetypeKey with
 *  ':' → '_'; the signature specials above live under media/hero/special/<key>.webp.
 *  Everything else has no card and keeps the live 3D render. Returns null then. */
export function heroPathFor(entry) {
  if (!entry) return null;
  const key = String(entry.archetypeKey || '');
  if (entry.category === 'ship' || entry.category === 'station') {
    return key.includes(':') ? `media/hero/${key.replace(':', '_')}.webp` : null;
  }
  if (entry.category === 'special' && HERO_SPECIALS.has(key)) {
    return `media/hero/special/${key}.webp`;
  }
  return null;
}

/** The Особое sub-group ('Системы'|'Объекты'|'Планеты') for a special key, so a
 *  recorded entry (which stores no group) can pick the right placeholder glyph. */
export function specialGroup(archetypeKey) {
  const s = SPECIAL_BY_KEY[archetypeKey];
  return (s && s.group) || null;
}

// --- detail-dialog descriptions --------------------------------------------

/** RU category headings — the tab strip and the detail dialog's subtitle. */
export const CATEGORY_LABELS = {
  system: 'Système',
  planet: 'Planète',
  race: 'Race',
  ruin: 'Ruines',
  ship: 'Navire',
  station: 'Station',
  special: 'Spécial',
};

// Planet-type encyclopedia: what it is, typical climate, resources, and how a
// world of this type comes to be.
const PLANET_INFO = {
  lava: {
    desc: 'Un monde de volcans et de lave-glaces s\'épuise trop près de l\'étoile pour vivre. Il se formera à l\'étoile elle-même ou se réchauffera avec les marées des géants voisins.',
    climate: 'Corbe fondue, centaines de degrés',
    resources: 'Métaux lourds, soufre, isotopes rares',
  },
  rocky: {
    desc: 'Un monde sans eau de pierre avec une croûte de cratères creusée, un petit corps qui n\'a pas retenu l\'atmosphère et l\'eau de l\'étoile brûlée par la proximité ou gelée par le Dalek.',
    climate: 'Des vagues de nuit et de jour',
    resources: 'Minerais, silicates, pierre de construction',
  },
  desert: {
    desc: 'La planète sèche des sables et des plaines fissurées sous le soleil dur, c\'est généralement un monde de ceinture modérée qui a perdu presque toute l\'eau.',
    climate: 'Froide et neigeuse, tempêtes de poussière',
    resources: 'Crème, sel, glace près des pôles',
  },
  terran: {
    desc: 'Le monde de la terre: l\'eau, l\'atmosphère, la ceinture modérée, le berceau de la vie, se développe dans une ceinture habitée, où l\'eau est maintenue liquide et l\'atmosphère stable.',
    climate: 'Eau et air modérés, liquides',
    resources: 'Eau, organismes, sols fertiles',
  },
  ocean: {
    desc: 'Une planète d\'océans avec des archipels rares, un monde chaud de ceinture habitée où l\'eau est plus abondante que les terres.',
    climate: 'Océan humide, mondial',
    resources: 'Eau, biomasse, sel dissous',
  },
  ice: {
    desc: 'Le monde glacial en orbite longue ♪ les panneaux glacés et les dysoles d\'azote sont formés derrière la ligne de neige, où l\'étoile est trop loin pour la chaleur.',
    climate: 'Froid, neige azotée et glace d &apos; eau',
    resources: 'glace, composés volatiles, eau propre',
  },
  gas: {
    desc: 'Un géant gazier géant avec des bandes de nuages et un système de bagues, le noyau de masse a pris une enveloppe d\'hydrogène et d\'hélium dans la partie extérieure froide du système.',
    climate: 'Pas de surface dure, des tempêtes éternelles.',
    resources: 'Hydrogène, hélium, combustible pour les scimers',
  },
};

// Ruin-flavour reference: what a ruined world of this flavour looks like and
// how it got that way.
const RUIN_INFO = {
  plain: {
    desc: 'Les ruines silencieuses d\'une civilisation ancienne et éteinte, ni corps ni raison, se sont éteintes calmement: maladie, climat, déclin.',
    fate: 'Décédés sans catastrophe',
  },
  robotic: {
    desc: 'Un monde où il n\'y a plus que des voitures: les usines et les dépôts fonctionnent toujours avec des propriétaires morts de longue date, pourchassant des cargaisons sur des orbites vides.',
    fate: 'Les gens ont disparu, l\'auto-détective est en vie.',
  },
  destroyed: {
    desc: 'Le monde détruit par la guerre ou la catastrophe, les villes fondues, la cicatrice sur la croûte, l\'orbite dans les débris, et quelqu\'un a survécu et a fui vers le monde voisin.',
    fate: 'Une partie de la catastrophe a été sauvée.',
  },
  obliterated: {
    desc: 'Un monde détruit: une civilisation entière est à peine intacte, une planète divisée en un nuage de griffes par des armes étrangères.',
    fate: 'La planète a été déchirée de l\'extérieur.',
  },
};

// Named-race flavour (real ones; future ones show a "coming" note instead).
const RACE_INFO = {
  humanity: 'Une vue curieux qui a à peine dépassé la planète, mais qui rêve déjà des étoiles.',
  fremen: 'Une nation du désert qui vit sur l\'eau et qui s\'étend sur les grès de la terre.',
  navi: 'Un peuple éphémère qui s\'est transformé en réseau vivant de sa lune jungle et qui la protège par toute la tribu.',
  signbuilders: 'Une race de zods qui a disparu depuis longtemps, laissant des signes mystérieux sur un monde gelé.',
  aelari: 'Le peuple des chantiers de l\'Alliance, l\'une des principales fondatrices du Traité, est un peuple de chantier.',
  hesht: 'Un peuple divisé qui a transformé le deuil en discipline et le serment de ◆ en État.',
  porosl: 'Monorace le collectif de Roy, une sorte de créature de la culture de la terre qui se baladent entre les étoiles, et les cartographes de l\'étranger.',
  precursors: 'Les silhouettes de la race aînée sont très calmes; elles sont rarement vues, de loin et toujours après le travail.',
};

// Special-content flavour + facts, by archetypeKey.
const SPECIAL_INFO = {
  'sys-sagittarius': { desc: 'Un trou noir supermassif au cœur de la galaxie, la lumière elle-même est ouverte.', facts: [['Type', 'CA supermassive'], ['Masse', '~ 4 millions de soleils']] },
  'sys-gargantua': { desc: 'Un trou noir rotatif géant avec un disque brillant et fin, la même Gargantua de l\'Interstellar.', facts: [['Type', 'PD tournant'], ['À côté', '○ Endurance ○']] },
  'sys-sol': { desc: 'Notre système est composé de huit planètes autour du nain jaune, berceau de l\'humanité.', facts: [['Étoile', 'Nain jaune'], ['Planet', '8']] },
  'sys-quarantine': { desc: 'Système mort en quarantaine: Egida VII est en train de faire une épave, l\'équipe est morte.', facts: [['Statut', 'quarantaine'], ['Menace', 'nécromorphes']] },
  'sys-alderaan': { desc: 'Un secteur où la station de combat a brisé le monde entier avec une seule bagarre de spiritueux, il reste un nuage de gravier.', facts: [['Événement', 'Destruction d &apos; Alderaan']] },
  'sys-twinsun': { desc: 'Le monde des deux soleils: sous la lumière double se trouve le Tatwin désertique.', facts: [['Étoiles', '2']] },
  'sys-spice': { desc: 'Une limite désertique où l\'on trouve une épice précieuse et où les cavités se déplacent sous le sable.', facts: [['Ressources', 'Épreuve']] },
  'sys-jungle': { desc: 'Un satellite de géant gazier, qui a été peuplé de jungles vivantes, la maison du peuple Na\'vi.', facts: [['Type', 'Luna-Jungli']] },
  'sys-hoth': { desc: 'Une planète gelée de neiges et de tempêtes de glace.', facts: [['Climat', 'pergélisol éternel']] },
  endurance: { desc: 'Une station de recherche annulaire qui tourne pour la gravité artificielle,  faire de l\'Endurance chez Gargantua.', facts: [['Type', 'Station annulaire']] },
  ishimura: { desc: 'Un vaisseau fêlé qui brise les planètes pour le minerai. L\'équipe est morte à bord d\'un neuromorphe.', facts: [['Classe', 'planetcracker'], ['Longueur', '~1,6 km']] },
  deathstar: { desc: 'Une station blindée de combat de la taille d\'une petite lune; un super laser explose la planète en une seule bagarre.', facts: [['Type', 'Station de combat'], ['Taille', '~160 km']] },
  dragon: { desc: 'Un vaisseau privé à équipage multiples en route pour Mars .. capsule-capsule sur le module de propulsion.', facts: [['Équipage', 'Jusqu &apos; à 4'], ['Cours', 'Terre Mars']] },
  'pl-earth': { desc: 'Le monde bleu de l\'eau et de l\'air est la seule maison connue pour la vie et l\'esprit.', facts: [['Biome', 'Terre'], ['Race', 'Humanité']] },
  'pl-mars': { desc: 'Une planète désertique rouillée, la cible la plus proche de la première expédition interplanétaire de l\'humanité.', facts: [['Biome', 'désert'], ['Satellites', '2']] },
  'pl-alderaan': { desc: 'Une planète pacifique détruite par une station de combat par une seule bagarre,  faire maintenant un champ de décombres.', facts: [['Statut', 'détruit']] },
  'pl-aegis7': { desc: 'Le monde minier mort: le sous-sol a été relevé par l\'Obélisque Rouge, et la colonie est devenue folle.', facts: [['Statut', 'Mort'], ['Au-dessus de lui.', 'Ishimura']] },
  'pl-tau': { desc: 'Un monde froid qui garde les Signaux des Zods disparus.', facts: [['Biome', 'glace'], ['Race', 'Bâtisseurs de Signes']] },
  'pl-tatooine': { desc: 'Une planète déserte sous deux soleils . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .', facts: [['Biome', 'désert'], ['Étoiles', '2']] },
  'pl-arrakis': { desc: 'Le monde désert d\'épices et de sable, la maison des Freeman.', facts: [['Biome', 'désert'], ['Race', 'Fremen']] },
  'pl-pandora': { desc: 'La lune-jungli du géant gazier, maison du peuple Na\'vi.', facts: [['Biome', 'jungle'], ['Race', 'Na’vi']] },
  'pl-hoth': { desc: 'La planète des neiges et des tempêtes de glace.', facts: [['Biome', 'glace']] },
  // --- столицы фракций (#stage6) ---
  'sys-cap-alliance': { desc: 'Le premier chantier de la galaxie sur le monde des Aélars, où le Traité a été signé.', facts: [['Faction', 'Alliance'], ['Drapeau', '♪ La Havane tranquille ♪']] },
  'sys-cap-imperial': { desc: 'Le champ des débris de Hesht et la colonne de la blessure autour de laquelle l\'Empire a été construit.', facts: [['Faction', 'Empire des Cendres'], ['Drapeau', '♪ Trisme ♪']] },
  'sys-cap-swarm': { desc: 'La vermine, la boulangerie et les pâturages polypéens, tous les noms sont donnés par des cartographes étrangers.', facts: [['Faction', 'Essaim'], ['Drapeau', '♪ Ispolin ♪']] },
  'sys-cap-syndicate': { desc: 'Meridian zéro sur tous les itinéraires de la galaxie: l\'horloge de référence de Prime assure la moitié des opérations de la flotte.', facts: [['Faction', 'Syndicat'], ['Drapeau', '♪ Un sac de contrôle ♪']] },
  'sys-cap-cartel': { desc: 'Le plus vieux port libre de la galaxie: le plus grand rameau de la côte de la Grande et des docks, où les plaques ne s\'éteignent pas.', facts: [['Faction', 'Carte'], ['Drapeau', '♪ Maman ♪']] },
  'sys-cap-precursor': { desc: 'Un système que toutes les cartes indiquent de la même façon: ne pas déranger. Les villes sont balayées, le jardin est arrosé par les propriétaires.', facts: [['Faction', 'Précurseurs'], ['Drapeau', '♪ Celui qui est resté ♪']] },
  'pl-aela': { desc: 'Le monde des Aelars, les villes le long des côtes, le rocade de l\'Hub, au-dessus de l\'équateur et les vieilles chansons dans le rythme du travail.', facts: [['Biome', 'Terre'], ['Race', 'Aelari']] },
  'pl-hesht': { desc: 'Le monde des hachts, le sanctuaire et la blessure, s\'est brisé; ils viennent ici pour se taire en bloquant le moteur.', facts: [['Statut', 'détruit'], ['Mémoire', 'Des fragments dans les quilles des navires']] },
  'pl-anvil': { desc: 'Le monde du trône de l\'Empire: les villes noires harsenales et le ciel, où est toujours vu le Hasht brisé.', facts: [['Biome', 'roche'], ['Race', 'Hesht']] },
  'pl-firstgarden': { desc: 'Un monde-shad sans feu unique des villes: les villes ne sont pas construites ici, elles grandissent ici.', facts: [['Biome', 'jungle'], ['Race', 'Progéniture']] },
  'pl-prime': { desc: 'Le monde sous la vitre: le méridien zéro mesure les itinéraires et le temps de la moitié de la galaxie.', facts: [['Biome', 'Ville'], ['Propriétaire', 'Syndicat  la Meridian']] },
  'pl-fatman': { desc: 'Un géant chevelu qui allaite la moitié du cartel: les collecteurs de gaz, les docks et la file d\'attente, qui sont plus respectueux des lois.', facts: [['Type', 'Gigant gazier'], ['Rôle', 'Port principal']] },
  'pl-tablet': { desc: 'Un monde ancien dont les villes sont lues comme des lignes de texte; le seul jardin est encore en train d\'être arrosé.', facts: [['Biome', 'désert'], ['Race', 'Précurseurs']] },
};

/**
 * Rich display info for a discovered (or catalog) entry, for the detail dialog:
 * a title, an RU category subtitle, a description, and a list of `[label, value]`
 * facts. Everything comes from the same constants the catalogs use plus the
 * flavour tables above, so it works for any entry.
 *
 * @param {object} entry a codex.js Entry ({category, archetypeKey, label, ...})
 * @returns {{category: string, title: string, subtitle: string, desc: string, facts: Array<[string, string]>}}
 */
export function describeEntry(entry) {
  const category = entry.category;
  const subtitle = CATEGORY_LABELS[category] || category;
  const title = entry.label || entry.archetypeKey;
  const facts = [];
  let desc = '';
  let stats = null; // ships only: the 1–10 characteristics block (#stage6)
  const key = entry.archetypeKey || '';

  switch (category) {
    case 'ship': {
      const [factionId, roleId] = key.split(':');
      const role = ROLE_BY_ID[roleId];
      const faction = FACTION_BY_ID[factionId];
      if (role) {
        desc = role.desc;
        // transports keep their payload in `arm` (cargo, fuel, colonists) — an
        // honest «Нагрузка» beats calling 4 000 colonists an armament.
        const armLabel = role.cat === 'transport' ? 'Charge' : 'Armement';
        facts.push(['Nomination', role.purpose], ['Longueur', `${role.lengthM}m`], ['Équipage', String(role.crew)], [armLabel, role.arm]);
      }
      if (faction) {
        facts.push(['Navire', faction.name]);
        if (faction.lore) desc += (desc ? ' ' : '') + faction.lore;
      }
      // the flagship of each fleet is a NAMED legend (#stage6) — its story
      // replaces the generic role blurb (the visual style line stays).
      const fl = roleId === 'flagship' && FLAGSHIP_LORE[factionId];
      if (fl) {
        desc = `${fl.desc} ${fl.history}`;
        facts.unshift(['Nom', fl.name]);
      }
      // the 1–10 characteristics block + the fleet-wide quirk (#stage6)
      stats = getShipStats(roleId, factionId);
      if (stats && stats.quirk) facts.push(['Caractéristiques', stats.quirk]);
      break;
    }
    case 'station': {
      const [factionId, type] = key.split(':');
      const faction = FACTION_BY_ID[factionId];
      // per-faction station lore (#stage6) — what a hub/outpost/collector IS
      // to that culture; falls back to the neutral type blurb.
      const STATION_DESC = {
        ring: 'Le hub au-dessus du monde de la civilisation, sa capitale orbitale.',
        outpost: 'Avant-poste colonial: une petite station orbitale au-dessus de la colonie.',
        collector: 'Un gars qui collecte du gaz, un smmer qui récupère du carburant dans l\'atmosphère d\'un géant gazeux.',
      };
      desc = (STATION_LORE[factionId] && STATION_LORE[factionId][type]) || STATION_DESC[type] || '';
      if (faction) facts.push(['Faction', faction.name]);
      break;
    }
    case 'planet': {
      const info = PLANET_INFO[key];
      if (info) {
        desc = info.desc;
        facts.push(['Climat', info.climate], ['Ressources', info.resources]);
      }
      break;
    }
    case 'ruin': {
      const info = RUIN_INFO[key];
      if (info) {
        desc = info.desc;
        facts.push(['Le destin', info.fate]);
      }
      break;
    }
    case 'race': {
      const r = RACE_BY_KEY[key];
      if (r && r.future) {
        desc = 'Cette espèce n\'est pas encore apparue dans le jeu \'carte-bouchon\', et il aura son histoire et sa planète.';
        facts.push(['Statut', 'dans la mise au point']);
      } else {
        desc = RACE_INFO[key] || '';
        if (r && r.planetRef) facts.push(['Monde', r.planetRef.label]);
      }
      break;
    }
    case 'special': {
      const info = SPECIAL_INFO[key];
      if (info) {
        desc = info.desc;
        facts.push(...(info.facts || []));
      }
      break;
    }
    case 'system':
      desc = 'Le système stellaire qui est en jeu dans cette galaxie.';
      break;
    default:
      break;
  }
  return { category, title, subtitle, desc, facts, stats };
}
