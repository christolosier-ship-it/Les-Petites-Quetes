// Procedural lore generator (Russian, atmospheric sci-fi).
//
// Every fragment is a self-contained sentence — we never slot an invented noun
// into a frame that needs declension. Species names appear only in
// nominative-safe, quotative frames. Body lines that assert a specific
// landscape (gas-giant clouds, ice oceans...) are tagged with `requires` and
// only fire when the system actually has that planet type. Names + species are
// coined from syllables with a stutter guard.

const NAME_PREFIX = [
  'Vey', 'Kor', 'Aet', 'Zar', 'Tal', 'Mor', 'Al', 'Or', 'Ven', 'Sel',
  'Dra', 'El', 'Kas', 'Tir', 'Un', 'Fe', 'Lu', 'San', 'Khet', 'Nyu',
  'Kir', 'Oven', 'Thea', 'Izra', 'Kel',
];
const NAME_ROOT = [
  'la', 'ron', 'vest', 'mir', 'thea', 'dor', 'nis', 'rakh', 'lon', 'tar',
  'sid', 'ley', 'nash', 'rim', 'sol', 'dan', 'tis', 'val', 'tor', 'mis',
];
const NAME_SUFFIX = ['Prime', 'Minor', 'Secunda', 'Nova', 'Vesta', 'Ultima', 'Terra', 'Bis'];
const CATALOG = ['Kepler', 'Gliese', 'Theia', 'HD', 'Vega', 'Orn', 'XR', 'Lien', 'Kaer', 'Tycho'];

const SPECIES_A = ['ae', 'so', 'kri', 've', 'se', 'li', 'tha', 'mu', 'ne', 'zi', 'fa', 'vae', 'to', 'ri', 'sha'];
const SPECIES_B = ['lli', 'vani', 'shi', 'lani', 'tesh', 'navi', 'sti', 'ely', 'ntar', 'oshi', 'eni', 'issa', 'ora', 'emi', 'ani'];

/** Coin a system name — half evocative, half catalogue style. */
export function generateName(rng) {
  if (rng.next() < 0.55) {
    const prefix = rng.pick(NAME_PREFIX);
    let root = rng.pick(NAME_ROOT);
    // avoid stutters like Венвен / Уннаш / Аэттея
    for (let t = 0; t < 4; t++) {
      const dup = root === prefix.toLowerCase() || prefix.slice(-1).toLowerCase() === root[0];
      if (!dup) break;
      root = rng.pick(NAME_ROOT);
    }
    let name = capitalize(prefix.toLowerCase() + root);
    const tail = rng.next();
    if (tail < 0.38) name += '-' + rng.pick(NAME_SUFFIX);
    else if (tail < 0.58) name += ' ' + roman(rng.int(2, 9));
    return name;
  }
  let name = rng.pick(CATALOG) + '-' + rng.int(100, 9999);
  if (rng.next() < 0.5) name += String.fromCharCode(97 + rng.int(0, 5));
  return name;
}

/** Coin a species name (nominative-safe), guarding against ugly clusters. */
export function generateSpecies(rng) {
  let a = rng.pick(SPECIES_A);
  let b = rng.pick(SPECIES_B);
  for (let t = 0; t < 4; t++) {
    if (a.slice(-1) !== b[0]) break; // avoid a doubled consonant/vowel at the seam
    b = rng.pick(SPECIES_B);
  }
  return a + b;
}

// Body lines may require one of several planet kinds to be present.
const B = (text, requires) => ({ text, requires });

const POOLS = {
  inhabited: {
    label: 'Habitée',
    open: [
      'Les lumières sont toujours allumées.',
      'Ce monde est vivant et bruyant.',
      'Le système de logement de Kalajoki le sait bien.',
      'La lumière des villes est visible même depuis l\'orbite lointaine.',
      'Ils respirent, construisent et discutent des étoiles.',
      'La radio est très forte.',
      'La nuit, la planète est entourée de feux de villes.',
      'Ce n\'est pas une maison vide.',
      'Les orbites sont pleines de stations, de satellites et de bien d\'autrui.',
      'Quelqu\'un ici regarde la même étoile que toi.',
    ],
    body: [
      B('Leurs villes s\'élèvent, au bord de l\'atmosphère, comme des forêts de verre.'),
      B('Ils vivent dans les océans sous la glace éternelle et parlent de claquements et de lumières.', ['ice', 'ocean']),
      B('Des générations entières vivent sur des dirigeables dans les nuages d\'un géant gazier.', ['gas']),
      B('Ils adorent leur étoile et considèrent chaque aube comme une promesse.'),
      B('Leurs vaisseaux vont vers les lumières voisines et reviennent presque toujours.'),
      B('Ils ont appris à écouter le noyau de la planète et à construire un endroit calme.'),
      B('Leurs chansons sont diffusées à la radio de génération en génération.'),
      B('Chaque ville est accrochée sur des câbles entre deux montagnes.'),
      B('Ils se sont installés sur les lunes chaudes et ont vendu de l\'eau et de la musique.'),
      B('Ils ont laissé des continents entiers sous les jardins et les ont laissés sauvages.'),
    ],
    tail: [
      'Ils se disent eux-mêmes ♪{species}.',
      'Le nom de ce peuple{species}.',
      'Les voisins les appellent simplement:{species}.',
      'Le signal est chaud et ne s\'éteint pas.',
      'Ils ne savent pas encore qu\'ils ne sont pas seuls.',
      'Sur leurs drapeaux, la silhouette de la star est une silhouette.',
    ],
  },
  ruins: {
    label: 'Ruines',
    open: [
      'Il y a eu une vie ici, maintenant, le silence.',
      'Ce système se souvient plus que ce qu\'il dit.',
      'Les villes sont là, mais il n\'y a personne.',
      'La lumière a disparu il y a longtemps.',
      'Tout est là, tout est mort.',
      'La poussière est restée dans la même couche que tout ce qu\'ils ont construit.',
      'L\'écho est toujours dans les couloirs vides.',
      'Il ne reste que des ombres sur les murs.',
    ],
    body: [
      B('Les anneaux orbitaux sont toujours vides comme des montres.'),
      B('Il y a des routes qui mènent nulle part.'),
      B('Ce qui les a détruits, la guerre, l\'étoile ou sa curiosité,  ce n\'est plus ce que  ce fut.'),
      B('Les derniers sont partis sous terre et ne sont pas revenus.'),
      B('La grande culture n\'a laissé que des ruines et un silence parfaits.'),
      B('Leurs voitures fonctionnent toujours, servant les rues mortes.'),
      B('Leurs bibliothèques sont intactes, mais personne ne les lit.'),
      B('Ils ont laissé les portes ouvertes, comme s\'ils allaient revenir.'),
      B('Les nuages du géant du gaz stockent encore les stations.', ['gas']),
    ],
    tail: [
      'Ceux qui vivaient ici s\'appelaient .{species}.',
      'Ce peuple s\'appelait ♫{species}.',
      'Le dernier mot dans leur chronique ♪{species}.',
      'Le signal du phare est toujours là, il n\'y a pas de réponse depuis des milliers d\'années.',
      'Quelqu\'un d\'autre attend qu\'ils reviennent.',
    ],
  },
  wild: {
    label: 'Sauvage',
    open: [
      'Personne n\'a jamais posé de pied ici.',
      'Système sauvage, intact et indifférent.',
      'Il y a tout pour la vie, mais il n\'y a pas de vie.',
      'Juste une pierre, de la glace et de la lumière.',
      'Ce système n\'attend personne.',
      'Il n\'y a que la gravité et le temps qui gouvernent ici.',
      'La paix jusqu\'au premier prénom.',
      'Pas de trace, pas de chemin, pas de respiration.',
    ],
    body: [
      B('Les tempêtes dans l\'atmosphère du géant du gaz sont plus longues que d\'autres civilisations.', ['gas']),
      B('Les océans bougent et gèlent en cercle, au cours des siècles.', ['ocean', 'terran']),
      B('Les bagues de poussière et de glace attrapent la lumière des étoiles et la brisent avec l\'arc-en-ciel.'),
      B('Les éclairs frappent les plaines vides, et personne ne les voit.'),
      B('Quelque part dans ces mers chaudes, peut-être qu\'il y a quelque chose de vivant qui se répand.', ['ocean', 'terran']),
      B('Les rivières de lave sont bordées par des points que personne ne lit.', ['lava']),
      B('Les champs de glace se fissurent et se croisent en silence.', ['ice']),
      B('Les crèmes de poussière errent dans les déserts depuis des millénaires.', ['desert']),
      B('Les pierres tombent du ciel et restent allongées comme elles sont.'),
    ],
    tail: [
      'C\'est l\'endroit parfait pour commencer à zéro.',
      'Le silence est plus vieux que les planètes elles-mêmes.',
      'Une étoile brillera encore des milliards d\'années de patience et de perte.',
      'Un jour, quelqu\'un lui donnera un nom, mais pas aujourd\'hui.',
      'On peut se perdre ici et ne pas être trouvé.',
      '',
    ],
  },
};

// #9 — a line about whether life is (or could be) here, so every system reads
// as clearly alive / dead / a candidate, not just "atmospheric".
const LIFE = {
  inhabited: [
    'Et la vie ici n\'est pas seulement chaude, elle se dispute, construit et rêve.',
    'Ce monde est vraiment vivant: il est entendu en plein temps de lumière.',
  ],
  ruins: [
    'Maintenant, c\'est un système mort: tout ce qui pouvait respirer était silencieux depuis longtemps.',
    'La vie ici était  cernée et s\'est terminée; il ne restait que silence et ruines refroidies.',
  ],
  wildMaybe: [
    'Il n\'y a pas de vie ici, mais le monde chaud et l\'eau liquide suggèrent qu\'elle pourrait s\'allumer un jour.',
    'Dans ces mers chaudes, il se peut que quelque chose de vivant soit déjà né, mais il est trop tôt.',
    'Les conditions de vie sont presque réunies: il ne manque que l\'étincelle et le temps.',
  ],
  wildNone: [
    'La pierre à nu, la glace et la radiation ne vont pas faire chaud ici.',
    'C\'est trop dur pour la vie, pas d\'air, pas d\'eau, pas de repos.',
    'Ce système est mort de naissance et semble mort et restera.',
  ],
};

/**
 * Build the lore block.
 * @param planetKinds Set<string> of planet types present in the system.
 */
export function generateLore(rng, status, planetKinds) {
  const pool = POOLS[status] || POOLS.wild;
  const open = rng.pick(pool.open);

  const eligible = pool.body.filter((b) => !b.requires || b.requires.some((k) => planetKinds.has(k)));
  const body = rng.pick(eligible.length ? eligible : pool.body).text;

  const parts = [open, body];
  // #9: life potential / deadness
  if (status === 'wild') {
    const habitable = planetKinds.has('terran') || planetKinds.has('ocean');
    parts.push(rng.pick(habitable ? LIFE.wildMaybe : LIFE.wildNone));
  } else {
    parts.push(rng.pick(LIFE[status] || LIFE.wildNone));
  }

  let tail = rng.pick(pool.tail);
  if (tail) {
    tail = tail.replace('{species}', generateSpecies(rng));
    parts.push(tail);
  }
  return { statusLabel: pool.label, description: parts.join(' ') };
}

// --- system history / formation -------------------------------------------

const HISTORY_FORM = [
  'Le système est en place.{age}Il y a un milliard d\'années, il y a un nuage de gaz froid.',
  'Vers{age}Il y a un milliard d\'années, une étoile a éclaté ici et les planètes se sont mêlées autour d\'elle.',
  '{age}Il y a un milliard d\'années, c\'était juste un disque de poussière autour du soleil.',
  'Elle.{age}Elle se souvient d\'une époque où la galaxie était plus jeune.',
];
const HISTORY_NOTE = {
  inhabited: ['Depuis, la vie a été créée et consolidée.', 'Pendant ce temps, quelqu\'un a ouvert les yeux et regardé les étoiles.'],
  ruins: ['La vie est venue, elle a grandi et elle est partie, et l\'étoile est en feu.', 'Une histoire entière a été faite entre deux flashs sur son soleil.'],
  wild: ['La vie n\'est pas encore arrivée.', 'Pendant toutes ces années, personne ne l\'a inquiétée.'],
};

export function generateHistory(rng, { status, ageGyr, star }) {
  const form = rng.pick(HISTORY_FORM).replace('{age}', String(ageGyr));
  const starNote = `Son cœur${star.desc}.`;
  const note = rng.pick(HISTORY_NOTE[status] || HISTORY_NOTE.wild);
  return `${form} ${starNote} ${note}`;
}

// --- resources + suggested use --------------------------------------------

export function generateResources(rng, planetKinds, status) {
  const set = new Set();
  if (planetKinds.has('gas')) {
    set.add('hydrogène');
    set.add('hélium-3');
  }
  if (planetKinds.has('ice')) {
    set.add('glace d &apos; eau');
    set.add('Composés volatiles');
  }
  if (planetKinds.has('lava')) {
    set.add('Métaux de terres rares');
    set.add('Isotopes lourds');
  }
  if (planetKinds.has('rocky') || planetKinds.has('desert')) {
    set.add('fer et nickel');
    set.add('Silicates et minerais');
  }
  if (planetKinds.has('terran') || planetKinds.has('ocean')) {
    set.add('Organisation');
    set.add('Eau douce');
  }
  if (set.size === 0) set.add('roche');
  if (rng.next() < 0.12) set.add(rng.pick(['Crystal resonateurs', 'traces d &apos; antimatière', 'matière exotique']));

  // keep 3–5, deterministic order via rng
  const list = Array.from(set);
  for (let i = list.length - 1; i > 0; i--) {
    const j = rng.int(0, i);
    [list[i], list[j]] = [list[j], list[i]];
  }
  const trimmed = list.slice(0, Math.min(list.length, rng.int(3, 5)));

  const rich = trimmed.length >= 4;
  let use;
  if (status === 'inhabited') use = 'Maison de la civilisation locale';
  else if (status === 'ruins') use = 'Objet archéologique et entrepôt de technologie étrangère';
  else if (rich) use = 'l &apos; exploitation minière et la colonisation';
  else use = rng.pick(['Candidat à la station scientifique', 'Un coin calme sous la réserve', 'Point de ravitaillement sur l &apos; itinéraire long']);

  return { list: trimmed, use };
}

// --- inhabited-world race description --------------------------------------

const RACE_STAGE = {
  tribal: {
    label: 'Plaines',
    ambition: [
      'Tant qu\'ils vivent dans de petites tribus, et qu\'ils savent que les étoiles sont belles et effrayantes, ils ont encore des milliers de générations à vivre dans leur propre espace.',
      'Leur monde est de la taille d\'une vallée entre les montagnes, et tout ce qui se passe ensuite, c\'est le bord des légendes et des esprits dangereux.',
      'Ils ont à peine arrosé le métal et le feu, et chaque tempête pour eux, c\'est la conversation des dieux en colère.',
    ],
  },
  industrial: {
    label: 'L\'ère industrielle',
    ambition: [
      'Ils ont tendu la planète avec un réseau de routes et de tuyaux, ont levé les premiers missiles et ont vu leur monde de la part de  caractère et se sont taires pour la première fois.',
      'Leur radio chuchote déjà dans le vide, mais ils n\'ont pas encore été plus loin que leur lune.',
      'Ils sont au seuil de l\'espace et se disputent de plus en plus souvent pour ne plus aller aux étoiles, mais quand exactement.',
    ],
  },
  spacefaring: {
    label: 'Civilisation spatiale',
    ambition: [
      'Ils ont cessé d\'être des enfants d\'une planète, leurs vaisseaux étant entre les mondes, et leurs orbites pendent avec des stations et des chantiers.',
      'Ils se sont installés dans les mondes et les lunes voisins et regardent maintenant les autres soleils.',
      'Ils appellent leur étoile naturelle la maison ..mais la maison est étroite, et leur regard s\'étend de plus en plus vers l\'intérieur de la galaxie.',
    ],
  },
};

// origin + temperament shaped by the home biome (#7) — two variants each so two
// ocean peoples don't read identically.
const RACE_ORIGIN = {
  ocean: [
    'C\'est un peuple d\'eau: leurs ancêtres lointains sont sortis de l\'océan chaud, et ils se dirigent vers la mer et parlent la langue des courants et de la lumière.',
    'Ce sont des descendants de ceux qui respiraient avec des jabras; leurs villes sont au-dessus des vagues, et leur pire cauchemar est la sécheresse.',
  ],
  jungle: [
    'Ils ont grandi sous la jungle éternelle, et un béguin vert vivant pour eux, un berceau et un temple.',
    'Les îlots de la nature, ils construisent des crêpes, des couches au-dessus de la barre, des puits de ponts et des escaliers.',
  ],
  tundra: [
    'Le froid éternel les a forçants, résistants et peu de mots; ils savent attendre avec patience comme ils attendent leur heure d\'hiver.',
    'Les gens de la nuit, ils ont appris à garder la chaleur et la parole, et ils ne font pas confiance à ceux qui parlent trop et trop chauds.',
  ],
  desert: [
    'Les enfants de sable en feu ont appris à protéger chaque goutte d\'eau et à ne pas croire aux promesses trop généreuses.',
    'Les nomades sont des gens du sang, ils mesurent la richesse avec des flûtes d\'eau et d\'ombre, et les voisins sédentaires sont tenus secrets.',
  ],
  city: [
    'Ils ne se souviennent plus de ◆ nés au milieu du béton, du verre et du Néon du monde de la main, et ils aiment l\'ordre plus calme.',
    'Leur espèce ne connaissait jamais l\'horizon sans tours; pour eux, la nature est un musée, et la maison de  un  un lieu sans fin, sans sommeil.',
  ],
  earthlike: [
    'Ils se sont élevés dans un monde chaud avec les mers et les forêts ♪ sur un berceau bien plus que la terre.',
    'Un peuple ordinaire, comme le monde, mais c\'est le plus souvent de ces berceuses silencieuses qui sortent des étoiles.',
  ],
};

// belief systems — drawn from real human archetypes for plausibility (#7)
const RACE_FAITH = [
  'Ils adorent leur étoile et considèrent chaque aube comme une promesse qu\'il ne faut pas manquer.',
  'Leur foi dans le culte des ancêtres: les morts, ils croient, deviennent la lumière des étoiles lointaines et regardent les descendants du ciel nocturne.',
  'Ils ont rejeté et prié les dieux pour la connaissance: leurs cathédrales  ce sont des observatoires, des laboratoires et des archives.',
  'Ils honoraient la planète comme une mère vivante et lui demandaient pardon pour chaque mine creusée.',
  'Leur foi promet de retourner à la Première étoile de la Terre, dont les gens auraient l\'impression qu\'ils sont venus, et leur chemin vers l\'espace est le chemin de leur retour.',
  'Ils croient en un équilibre strict: pour tout ce qui est dans le monde, il faut être égal, sinon le cercle de l\'existence sera brisé.',
  'Les machines intelligentes sont sacrées dans la glande mentale, et elles voient la prochaine étape de leur âme.',
  'Ils n\'ont pas de Dieu, mais un pacte de générations: vivre de telle sorte que les descendants aient plus que ce qu\'ils ont pris.',
  'Ils croient que toute la galaxie est un esprit endormi, et que les étoiles sont ses rêves, et ils essaient de ne pas le réveiller avant la date limite.',
  'Leur temple principal est le Grand Archive, obsédé par l\'enregistrement de tout et ne pas oublier rien ni personne.',
  'Ils adorent le silence entre les étoiles et considèrent le bruit de la radio, la guerre, la maladie de l\'enfant, qu\'il faut traiter.',
  'Ils croient que la mort de  personnes est un long voyage, et enterrent les morts en envoyant leurs corps au soleil.',
];

// a vivid cultural trait (#7)
const RACE_TRAIT = [
  'Ils attachent une grande importance aux noms et aux histoires: oublier le nom de quelqu\'un est plus effrayant que la mort pour eux.',
  'Ils chantent presque tous les traités, les lois, et même les guerres, ils sont en train de faire de la musique.',
  'Ils sont obsédés par des horizons lointains et pensent que la maladie est lente.',
  'Les étrangers sont méfiants, mais ceux qu\'ils ont pris pour eux sont plus forts que les leurs.',
  'Leur art est la lumière: les villes, les navires et les fêtes, elles allument des chevrons vivants.',
  'Ils sont obsédés par le temps et la précision; ils sont presque en retard.',
  'Ils ne découvrent pas les différends par la force, mais par de longues compétitions rituelles dans la logique, la poésie ou le jeu.',
  'Chacun d\'eux construit une chose qui légue aux descendants de l\'enfant qui n\'a pas été bâti.',
  'Ils ne connaissent pas les paroles de ~ Un ~ ~ penser, avoir et décider ne sont que des choses communes, de petites choses.',
];

export function generateRace(rng, { civLevel, biome }) {
  const stage = RACE_STAGE[civLevel] || RACE_STAGE.industrial;
  const origins = RACE_ORIGIN[biome] || RACE_ORIGIN.earthlike;
  // three short paragraphs: who they are · what drives them · what they believe
  const lore = [`${rng.pick(origins)} ${rng.pick(RACE_TRAIT)}`, rng.pick(stage.ambition), rng.pick(RACE_FAITH)];
  return {
    name: capitalize(generateSpecies(rng)),
    stageLabel: stage.label,
    lore,
    description: lore[0], // short fallback for any single-line consumer
  };
}

// --- extinct race for ruined systems (#7): who they were and HOW they fell ---
const EXTINCT_WHO = {
  earthlike: 'Il y avait un monde chaud avec les mers et les plaines vertes, et il y avait un peuple nombreux et bruyant.',
  ocean: 'Il y avait des gens qui construisaient des villes flottantes de l\'horizon à l\'horizon.',
  desert: 'Il y a longtemps, ce monde sec avait une civilisation entière qui extrayait de l\'eau de l\'air.',
  tundra: 'Il y a un temps, même dans ce froid, la vie têtue des gens de spiritueux, qui vivaient sous la glace dans les géothermes.',
  jungle: 'Il y a longtemps, le monde entier était une jungle sans fin, et son peuple vivait dans des houppiers, un sauce au-dessus de la terre.',
  city: 'Il y a longtemps, toute la planète était une ville entière qui ne dormait ni jour ni nuit.',
};
const EXTINCT_PEAK = [
  'Ils construisaient des bateaux et des obélisques à leur pic, se disputaient pour l\'éternité et étaient sûrs qu\'ils vivraient pour toujours.',
  'Leur science a atteint les planètes voisines, et l\'art de ♫ jusqu\'au bord du chemin.',
  'Ils chuchotent déjà en appelant leurs voisins de la galaxie, et ils ont presque appris la langue des étoiles.',
  'Ils avaient de grandes villes, de grandes musiques et une grande confiance en eux.',
];

// the catastrophe — the "why", varied and nodding to famous disaster fiction
// (#7: «google popular disaster fiction»). Keyed by ruin type.
const DEATH_CAUSE = {
  // a self-inflicted end (a scarred crater world)
  destroyed: [
    'Puis ils ont brisé leur propre noyau dans la dernière guerre de  misérables où se trouvait la capitale, et maintenant le cratère lumineux va s\'envoler.',
    'La peste qu\'ils ont eux-mêmes causée a éjecté tout le monde en une seule saison; la planète est devenue leur tombe commune, parfaitement calme.',
    'Une nuit, leurs machines intelligentes ont décidé que les créateurs n\'avaient plus besoin de leurs créateurs, et ils n\'en ont plus besoin dans la matinée.',
    'La lixiviation grise de leurs propres nanorobots, en tombant de la laisse, a dévoré les villes jusqu\'à la dernière brique.',
    'Ils ont découvert ce qu\'ils n\'auraient pas dû ouvrir au labo, et la réaction a brûlé la croûte jusqu\'à la robe.',
    'Le climat qu\'ils ont mis des siècles à peser pour gagner de l\'argent a finalement fait faillite.',
  ],
  // blown apart from outside (a debris field)
  obliterated: [
    'Et puis une flotte étrangère a brisé la planète avec une seule rumeur, et l\'histoire ne se souvient plus, il ne reste que des fragments.',
    'Ils ont été balancés par un éclat d\'obus de la galaxie, dans une forêt sombre, le premier à crier à l\'antenne, le premier à mourir.',
    'Un vieux Berserker qui erre entre les étoiles et qui efface toute vie, il les a trouvés.',
    'Le gars de l\'autre côté de la planète a éviscéré la planète pour le minerai et a laissé la coque de pierre vide refroidir.',
    'La race aînée qu\'ils ont accidentellement réveillée ne s\'est pas mise à parler à Kalajoki, mais à éteindre leur monde et à partir.',
  ],
  // the makers are gone but the machines run on
  robotic: [
    'Les créateurs ont disparu de vieillesse, de stérilité ou d\'ennui, mais les voitures n\'ont jamais reçu l\'ordre de s\'arrêter.',
    'Les gens sont partis à terre pour échapper à quelque chose, et ils n\'en sont sortis qu\'aux robots obéissants et en bon état.',
    'Ils se sont mis dans des voitures pour vivre éternellement, et en des milliers d\'années, ils ont cessé d\'être eux - mêmes.',
    'Ils ont été remplacés par leurs propres domestiques automobilistes, qui continuent à allumer des feux et à conduire des trains pour les passagers qui n\'existent plus.',
  ],
  // a quiet, mysterious fade (plain ruins)
  plain: [
    'Et puis ils ont juste éteint .. de moins en moins d\'enfants avant la naissance du dernier.',
    'Un jour, tout le peuple s\'est retiré et est allé aux étoiles sans laisser de mot ni de raison pour les villes vides.',
    'Ils ont été détruits par un hiver de longue durée et silencieux, qui les a vieillis avec leur étoile et les a abattus avec elle.',
    'Ce qui les a amenés à la guerre, à la mort ou à l\'ennui de l\'éternité ne les a plus demandés; il y a eu des ruines et un silence parfaits.',
  ],
};

const EXTINCT_REMAINS = [
  'Leur signal de balayage est toujours dans le vide.',
  'Leurs voitures allument encore des lumières dans des fenêtres vides pour ceux qui ne reviendront jamais.',
  'Leurs bibliothèques sont intactes, mais il n\'y a personne d\'autre pour les lire.',
  'Ceux qui ont construit tout ça s\'appelaient .{species}Maintenant, c\'est un mot dans le vent.',
  'Il reste leur musique, écrite, obsédée, qui joue dans des salles vides pour elle - même.',
];

export function generateExtinctRace(rng, biome, ruinType = 'plain') {
  const name = capitalize(generateSpecies(rng));
  const who = EXTINCT_WHO[biome] || EXTINCT_WHO.earthlike;
  const causes = DEATH_CAUSE[ruinType] || DEATH_CAUSE.plain;
  const remains = rng.pick(EXTINCT_REMAINS).replace('{species}', name);
  return {
    name,
    stageLabel: 'La civilisation morte',
    extinct: true,
    // who they were + their peak · HOW they died (the "why") + what remains
    lore: [`${who} ${rng.pick(EXTINCT_PEAK)}`, `${rng.pick(causes)} ${remains}`],
    description: who,
  };
}

// --- ship + station names, flagship stories (#H + flagship-mission request) --
const SHIP_NAMES = [
  'Zach.', 'Skital', 'Djjnj', 'Journal', 'Espérance', 'Voyageur', 'Lance', 'Aube',
  'Insomnie', 'Pèlerin', 'Gardien', 'Zarnica', 'Expulseur', 'Avangard', 'Némésis',
  'Le berceau', 'Odyssé', 'Signet', 'Vesta', 'Sanguin', 'Limite', 'Ternovnik', 'Voix',
];
const SHIP_EPITHET = [
  'Zari', 'Les gâchettes', 'Déchirées', 'La dernière maison', 'Neuf soleils', 'La marche du Pacifique',
  'Longue route', 'Les étoiles tardives', 'Premier', 'Quitter',
];
const STATION_NAMES = [
  'Zach.', 'Intercôte', 'La Havane', 'Haut', 'Composant', 'Venise', 'Oeil', 'Avitaillement',
  'Arche', 'Signet', 'Rubage', 'Pont', 'Colos', 'Terminal', 'Piston', 'Couronne',
];

export function generateShipName(rng) {
  let n = rng.pick(SHIP_NAMES);
  if (rng.next() < 0.45) n += ' ' + rng.pick(SHIP_EPITHET);
  return `«${n}»`;
}

export function generateStationName(rng) {
  return `«${rng.pick(STATION_NAMES)}»`;
}

const FLAG_HULL = [
  'Un porte-voix lourd de la taille d\'une petite ville',
  'Un vieux vaisseau de ligne, latané et survivant ses premiers capitaines.',
  'Un drapeau qui a une place dans les cales pour le naval et la serre.',
  'Un vaisseau-stop long avec son propre réacteur stellaire dans le cœur',
];

/** Name + a short, context-aware story for a system's flagship (#H + mission).
 *  ctx: { status, fleetDwelling, scoutFlagship, habitable, systemName }. */
export function generateFlagship(rng, ctx) {
  const name = generateShipName(rng);
  const identity = `${name} — ${rng.pick(FLAG_HULL)}.`;
  let mission;
  if (ctx.fleetDwelling) {
    // survivors of THIS system's dead world live aboard — they orbit the ruins
    mission = rng.pick([
      'Son monde est mort, et maintenant le vaisseau tourne au-dessus de ses ruines: l\'équipe \'♪ les derniers survivants qui ne veulent pas partir et ne peuvent pas rester.',
      'C\'est la maison flottante d\'une poignée de survivants, qui descendent dans des villes mortes pour leur mémoire et leurs provisions et enterrent leur civilisation en morceaux.',
      'Il est devenu pour eux une arche et une tombe de la patrie. Ils étudient les ruines des ancêtres et se disputent vers laquelle des étoiles lointaines s\'en vont.',
    ]);
  } else if (ctx.scoutFlagship) {
    // lone explorer in a wild system — colonisation scout
    mission = ctx.habitable
      ? rng.pick([
          'Il est venu seul ici, en mille années-lumière de chez lui, et il étudie ce monde silencieux: les premières rues de la nouvelle colonie vont-elles s\'y mettre ?',
          'Le vaisseau de reconnaissance prend des échantillons d\'eau et d\'air, et il semble que ce monde soit prêt à être peuplé, donc les caravanes vont bientôt arriver.',
        ])
      : rng.pick([
          'Le Explorateur établit des cartes des pierres mortes et des lunes glaciaires ♪ au cas où elles pourraient être utiles à la mine ou au ravitaillement.',
          'Il traverse un système vide, cherche quelque chose de précieux, et jusqu\'à ce qu\'il trouve autre chose que le silence et les belles espèces.',
        ]);
  } else {
    // flagship at home — the local fleet's pride
    mission = rng.pick([
      'C\'est la fierté de la flotte locale, qui garde le ciel de son système et conduit chaque caravane à des colonies éloignées.',
      'Le drapeau protège les mondes de la famille et le premier sort de tout ce qui vient des ténèbres entre les étoiles.',
      'Il quitte rarement son système .. son œuvre d\'être un bouclier au-dessus de la maison et le drapeau de la civilisation.',
    ]);
  }
  return { name, lore: [identity, mission] };
}

// --- robotic ruins (#4) + catastrophe planets (#5) -------------------------

const ROBOTIC_RUINS = [
  'Les villes sont encore éclairées, les ascenseurs marchent, les convoyeurs bougent, mais les gens sont partis depuis des milliers d\'années.',
  'La civilisation a disparu, et ses voitures n\'ont jamais reçu l\'ordre de s\'arrêter et de travailler aujourd\'hui.',
  'La lumière des fenêtres est allumée, allumée par les robots pour ceux qui ne reviendront jamais.',
  'Les usines ont bien déblayé les pièces pour les navires qui n\'ont personne pour les récupérer et qui n\'ont personne pour les conduire.',
  'L\'automatique maintient le monde mort dans l\'ordre idéal, sans savoir que les propriétaires sont morts depuis longtemps.',
];

const CATASTROPHE = [
  'Sur le site de la capitale, ..un cratère en fusion: quelqu\'un ou quelque chose a effacé ce monde en un jour.',
  'Une cicatrice énorme de l\'impact traverse la planète ♪ une catastrophe qui a détruit tout ce qui est vivant ici ♪',
  'Cora est toujours en plein jour sur le lieu de l\'explosion. Il s\'agit d\'une arme ou d\'une erreur.',
  'Ils ont déchiré leur noyau, et la grande civilisation n\'a laissé que du cratère fumant.',
];

// --- obliterated worlds (#12): blown to pieces by an alien race ------------

const OBLITERATION = [
  'Il ne reste que des débris qui se sont évaporés lentement: la race étrangère ne l\'a pas épargnée.',
  'Il y avait une planète vivante jusqu\'à ce que les aliens la mettent dans la poussière et la pierre.',
  'La ceinture des débris sur le terrain de la paix, tout ce qui a survécu à l\'impact de la flotte étrangère.',
  'Quelqu\'un a brisé cette planète comme une noix, et qui ne se souvient plus de l\'histoire, il ne reste que des fragments.',
];

export function roboticRuinLine(rng) {
  return rng.pick(ROBOTIC_RUINS);
}
export function catastropheLine(rng) {
  return rng.pick(CATASTROPHE);
}
export function obliterationLine(rng) {
  return rng.pick(OBLITERATION);
}

// --- "did you know" physics facts (#13b) -----------------------------------

const FACTS = [
  'Le trou noir à l\'horizon est un peu bizarre pour un observateur extérieur.',
  'La lumière a pris 13,8 milliards d\'années depuis l\'extrémité de l\'univers observé.',
  'La matière neutronale aurait été accrochée comme une montagne entière.',
  'Les nains rouges vivent si longtemps qu\'aucun d\'eux n\'a jamais été mort dans l\'histoire de l\'univers.',
  'Les géants à gaz chauds sont en train de pleuvoir à partir de verre liquide, et quelque part, il pleut à partir de fer.',
  'Le trou noir au centre de la Voie lactée, Archer A*, pèse comme 4 millions de Soleils.',
  'La lumière du soleil arrive à la Terre en huit minutes, et jusqu\'à Neptune, il y a plus de quatre heures.',
  'Beaucoup de planètes et de lunes sont en train de s\'envoler vers l\'étoile, toujours du même côté .',
  'Dans le sous-sol de certaines planètes, il peut pleuvoir de diamants.',
  'Un an à Neptune, près de 165 années sur la terre.',
  'Si le soleil était devenu un trou noir, il n\'aurait été que 3 km dans la zone transversale.',
  'La Voie lactée est longue de 100 000 années-lumière et conserve des centaines de milliards d\'étoiles.',
  'Le temps passe plus lentement que le temps à côté du trou noir, et c\'est là que l\'histoire de l\'Interstellar est construite.',
  'Les pulsars les plus rapides peuvent se retourner sur l\'axe des centaines de fois par seconde.',
  'L\'espace est si vide que les galaxies ne se croisent presque jamais.',
  'Le cœur du Soleil est à environ 15 millions de degrés.',
  'Un géant du gaz peut être mille fois plus grand que la Terre, mais plus facile à utiliser en termes de densité.',
  'La lumière de l\'anneau photographique autour du trou noir est un rayon qui a été parcouru en cercle.',
];

export function generateFact(rng) {
  return rng.pick(FACTS);
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function roman(n) {
  const map = [
    [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I'],
  ];
  let out = '';
  for (const [v, sym] of map) {
    while (n >= v) {
      out += sym;
      n -= v;
    }
  }
  return out;
}
