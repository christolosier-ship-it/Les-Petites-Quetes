// Canonical fleet lore (#stage6): every faction's NAMED flagship legend and
// what its three station types are to that culture. Pure data — consumed by
// the codex detail dialog (codexData.js) and mirrored by the capitals'
// `flagshipOverride` in systemData.js (same names: one canon, two surfaces).

export const FLAGSHIP_LORE = {
  alliance: {
    name: 'Havre Silencieux',
    desc: 'Un porte-avions à deux coques, un vaisseau de classe Havan, deux bâtiments reliés par un pont de quai, où se trouvent les deux éléments de chasse, et une corvette endommagée.',
    history:
      '♪ La Tête de La Havane ♪ a été rassemblée dans deux bâtiments inoccupés abandonnés par la guerre sur des statues brisées ♪ ♪ et le pont entre eux est devenu l\'atelier commun des survivants avant même que le vaisseau ne soit formé à voler ♪ Il n\'y a pas de drapeau ennemi sur son compte ♪ ♪ mais la cloison de l\'avion est battue avec les noms des équipages enlevés des navires de l\'Empire et de Roy ♪ ♪ La liste a été transplantée en 6 000 $ ♪ ♪ La liste des navigateurs de l\'Alliance a un proverbe: tu ne sais pas où aller ♪',
  },
  imperial: {
    name: 'Veillée',
    desc: 'Un 4x50 noir avec des lames de marquage avares, la classe de l\'Empire de Pepla, un vaisseau de guerre et une salle de commémoration sous un même blindage.',
    history:
      'La tête de Trysna, c\'est une armure de vaisseaux tués lors de la rupture de Hesht, et sa quille est encerclée par le plus gros fragment jamais soulevé du champ des débris. Le couloir principal est entouré par les noms de  ce que les 2 000 membres d\'équipage passent chaque jour à leur poste. La classe n\'est pas en train de faire: Čtrizna, n\'est pas en marche: le doc quitte seulement lorsque l\'Empire a déjà décidé de tirer.',
  },
  swarm: {
    name: 'Colosse',
    desc: 'Le plus vieux des léviathans de Roy: 400 mètres de chitine vivante, des côtes de côtes et une lumière violette lente au fond de la carapace.',
    history:
      'Les scouts de l\'Alliance ont donné un nom: loin, quand il conduit une meute le long de la frontière, sa silhouette bosse à moitié ciel, comme si une île avait été retirée. Les couches de la carcasse pensent que les bagues annuelles sont plus âgées que le premier contact. Un jour, il a traversé le blocus impérial sans changer de cap ni avoir donné une seule bouchée; la ligne est tombée derrière son fourrage, et les deux parties se disputent encore sur ce qu\'il a fait. La seule chose qu\'il a fait est de quitter le chemin de Prétec.',
  },
  syndicate: {
    name: 'Bloc de Contrôle',
    desc: 'Un graphite de 4x00 mm, un bocal de prédateurs, des lignes de cyane du nez au dus, des batteries qui dorment le long de la dorsale, pas un négociateur du siège qui vient vous voir.',
    history:
      'Il est sur les pattes d\'un chantier de navigation acheté à la flotte morte, le Syndicat appelle ça de la prudence. Il a signé le règlement du monopole de l\'après-guerre et s\'est acquitté de chaque point de ce règlement. Aucun tir n\'a été enregistré contre le navire; cependant, dans une douzaine de systèmes, son arrivée en orbite a été prise dans la chronologie par le mot "absorptions ."',
  },
  cartel: {
    name: 'La Matrone',
    desc: 'Le drapeau du cartel libre: 400 mètres de corps, 40 écluses, docks, marchés et 2 000 équipage, pas tant un vaisseau de combat que le port volant qui arrive là où il n\'y a pas de port.',
    history:
      'La dernière année, la guerre de St. Flags a commencé à se faire à bord de navires qui avaient quitté leur flotte et qui ne pouvaient pas revenir. Dans la coque, les plaques de six chantiers différents étaient visibles et aucune n\'a été repeindre. Que la maison soit visible. Au fil des siècles, Maman a pris plus de fugitifs que d\'autres mondes de colons. Quand le port est venu, on dit que c\'était la mère de l\'homme, ce qui signifie que tout est maintenant à l\'écart.',
  },
  precursor: {
    name: 'Celui qui est resté',
    desc: 'Le vaisseau-rune doré: un monolith-obélisque dans une bague de fragments en chute libre, le plus grand des vaisseaux de la Pretech. Le nom \'Sur son bateau, la traduction de la rune par des cartographes étrangers; les Prétètes ne l\'appellent pas \' ou l\'appellent si calmement que personne n\'a entendu.',
    history:
      'Le seul vaisseau de la Pretet, avec un itinéraire circulaire: il ne va nulle part, il ne va nulle part. Dans la guerre de St. Flags, sa ligne a traversé les fronts trois fois, et il a traversé la ligne sans ouvrir le feu trois fois, sans jamais être rétabli. Les Navigateurs d\'Aelar ont transféré la rune à son bord en trois mots, et le quatrième débat au troisième siècle. Une fois en quarante et un an, il se rend à un collecteur de gaz du géant ♪ Bien que ses dues, à la connaissance des observateurs, n\'aient jamais été abattus.',
  },
};

// Faction chronicles for the codex «Фракции» shelf (#stage6): essence (the
// section header line) + a five-chapter story per faction, written against
// the anti-AI-pattern checklist and judge-verified. Unlocks by visiting the
// capital. Chapter texts hold literal \n\n paragraph breaks — the codex UI
// splits on them.
export const FACTION_LORE = {
  alliance: {
    essence:
      'L\'Alliance des Verfées libres, le traité des survivants de Flagopad: des dizaines de peuples différents sans trône, mais avec des chantiers communs, une flotte commune et une promesse dans une centaine de langues .',
    chapters: [
      {
        title: 'Appels de morts',
        text:
          'Les vieux ne disent pas la guerre des St. Flags. Ils disent: "Il y a un Flagopad. Avant elle, chaque peuple volait sous son propre drapeau; les chroniques de ces années sont lues comme un appel de morts. Le vainqueur n\'a pas désigné personne. Quand les cendres d\'âne sont restées six signes, l\'un d\'eux était un accord, et non un signe. Des escadrons brisés de races différentes, trop faibles, se sont mis en contact avec une seule station et ont convenu: jamais plus.\n\nSur la cloison du dock le plus ancien, il y a 100 drapeaux de nations qui ne sont plus en vue, qui marchent lentement, même en retard.',
      },
      {
        title: 'Signature par soudage',
        text:
          'Le traité a été soudé par une soudée sur une cloison de l\'ancien dock; ce soudage n\'est pas peint par la génération; le Conseil Stapelei siège maintenant directement dans le dock, et la décision est prise lorsque le soudage est posé, et non pas signé; les affaires communes des membres du Traité ont trois navals, une flotte et une défense; le reste du monde décide de ses propres lois et aucune race n\'a de majorité.\n\nLe système orange de nain s\'appelle le premier Verfuge. Son phare bleu est visible avant la station elle-même; en orbite, se trouvent les aélars d\'Ael, le monde de la datte de Stapel et le géant énergétique de Ballast, avec trois lunes. Le drapeau de l\'avion .. le porte-avions de la ville de Silence. Personne n\'a annoncé la capitale du premier Wirf, mais n\'importe quel itinéraire de l\'Alliance nous amènera tôt ou tard à la rénovation.',
      },
      {
        title: 'Spike',
        text:
          'Le chantier de l\'Alliance est une ville: des docks de la taille d\'un canyon, des marchés de la taille d\'un pantin, des quartiers de différentes tailles d\'air et de poids. La langue commune est appelée "Soupy - ♪ un mot de pont de centaines de mots, où \'domeste\' et doc\', un mot de haut. Les couloirs sont délibérément différents: l\'équipage n\'a pas la même taille.\n\nLes coutumes sont vieilles et simples. Le premier point de la nouvelle embarcation est le plus jeune de l\'équipage; la courbe qui tremble, elle reste à jamais; les noms des morts sont battus sur les poutres qui portent les poutres ♪ les morts continuent de tenir le corps. Le soir, à la hauteur du marché, on chante un berceau aélara sur le jardin; le dernier achat d\'aélaras ne le transfère à personne, et dans leurs atlas stars, il y a un secteur sans aucune marque. Au bord de la manche longue, le monde est un jeune et les océans bleus sont comme les aélares.',
      },
      {
        title: 'Collaborateurs à la manche',
        text:
          'Avec l\'Empire Pepla, l\'Alliance garde des barrages sur tous les itinéraires: elle est plus que jamais comprise ici par l\'Empire, et elle ne sera jamais laissée passer. Roy ne peut pas contredire; les scouts apprennent où va la marée et l\'Alliance ne construit pas de route. Les syndicats paient les routes, vérifient chaque lettre de voiture et se rappellent que le monopole de  ce qui est aussi un siège. Le cartel est regardé de travers les doigts: les contrebandiers connaissent les sentiers plus calmes que les scouts, et les meilleurs d\'entre eux se trouvent sur le pont en forme. Les ruines de Pretech sont en train de s\'approcher de la tête non couverte et ne les démasqueront jamais sur le métal.\n\nUn étranger va se faire bouffer, trouver un lit et prendre l\'air, et l\'équipage abandonné ne se fait pas pardonner.',
      },
      {
        title: '♪ C\'est une chemise de chalet ♪',
        text:
          'La première Verfi aime l\'histoire de la corvée de la Lunette. Sa première cicatrice a été ridiculisée par Aelarca depuis 16 ans, elle a été taillée comme elle l\'était. Vingt ans plus tard, la Lune de la Tortue a attrapé un débris dans une pomme près de la frontière de Roy et a percé trois points de la courbe . .. et l\'équipage l\'a hermétiquement bloqué. La Corvette a été déclassée et une partie de cette cloison a été placée dans le plancher de la salle du Conseil Stapelei; les nouveaux arrivants le surpassent.\n\nL\'autre cas est moins important, l\'année où Roy a grandi, la caravane de marchandises de l\'Empire a perdu son chemin dans le secteur contesté, l\'Alliance a retiré 400 hashts et l\'a conduit jusqu\'au poste impérial, sans remercier, mais les capitaines impérialistes de ce secteur ont été les premiers à écouter les armes depuis.',
      },
    ],
  },
  imperial: {
    essence:
      'Les Hashts, le peuple qui a perdu sa planète au cours des dernières années, la guerre des St. Flags, et qui vit au milieu de ses décombres, sont rassemblés autour d\'un seul serment, et ne seront plus jamais vulnérables: la flotte noire dans le deuil d\'État, la citoyenneté par le service, la mémoire comme un règlement.',
    chapters: [
      {
        title: 'Page vide',
        text:
          'La guerre des St. Flags a un peu de place dans les chroniques impériales, et une page est vide. Le jour où Hest a été brisé, il n\'est pas décrit: au lieu d\'une histoire, la liste des noms est encore en train de l\'être.\n\nAvant la guerre, les hachts étaient construits selon des plans, des échanges, des différends sur les itinéraires, dans le Flagopad, ils choisissaient le camp, puis l\'autre, ils se battaient pour eux-mêmes, à la fin, ils tiraient tout et tout, et les chroniqueurs ne disaient pas: l\'Empire refusait de nommer le coupable par un a posteriori, et la conclusion était pire que toute vengeance: les faibles étaient en quête, sous n\'importe quel drapeau.\n\nLes survivants parcouraient des camions, des pétroliers, des bâtiments sous-développés avec du bois de store, et beaucoup d\'autres s\'étaient assis dans leur système, étaient restés dans les décombres et avaient commencé à construire.',
      },
      {
        title: 'Cachet dans le gant',
        text:
          'On met des cendres sur le gant, et on les met dans le gant. Chacun choisit ses mots; le poing comprimé est contraignant; le trône n\'est pas un serment.\n\nLa citoyenneté ne donne que service, et seul le hasht peut être sur le pont de bataille. Les peuples des mondes associés sont des sujets: les impôts sont annoncés à l\'avance, les lois sont appliquées, la garnison impériale meurt pour leurs villes comme pour les siennes. L\'Empire appelle cela l\'honnêteté. Il n\'y a pas de voix dans les affaires de la flotte du sujet et ses enfants n\'auront pas de voix.\n\nLe noir, c\'est la couleur du service, le deuil, le deuil, le service public, la salle de commémoration, chaque vaisseau est plus grand que la corvette, l\'empereur est coronalement coronalement, les épaules sont entourées d\'une robe de vampelaine de vaisseaux tués lors de la rupture, et le jour du Raccol ne décolle que par des patrouilles de garde.',
      },
      {
        title: 'Le ciel, où Hest est toujours visible',
        text:
          'La lumière du Saint-Siège est froide, comme dans le bloc.\n\nHash, mon cher monde, maintenant  caractère lent des débris, et il n\'y a pas de débris sur les débris. Le vaisseau de pèlerinage éclipse le moteur à la limite du champ et dérive le temps que l\'équipage peut supporter. Il ne reçoit que des fragments de douilles, qui sont d\'abord mis en place, jusqu\'à tout acier.\n\nLa première leçon d\'astronomie se trouve dans le noir: le maître ouvre le dôme et ne parle que jusqu\'à ce que chacun trouve les débris. À la limite glaciale du système, la veille est faite. Le changement est fait en deux mots \' \'Hash se souvient \' et prend un seul: \'Et moi\'.',
      },
      {
        title: 'Cinq voisins et une route cédée',
        text:
          'La frontière avec l\'Alliance des Vertes libres est la plus calme et la plus forte: dans leur serment, nous ne perdrons pas \' l\'Empire voit son miroir et ne croyons pas en leur contrat. Roy craint à haute voix, le seul à ne pas avoir de flotte contre lui. Le syndicat \'Meridian \' se souvient qui a financé les deux côtés de Flagopad: il vend par contrat et ne prend pas de dette. Le cartel libre est un déserteur dans ses statuts, même si les instincts achètent dans ses ports des choses dont ils ne rendent pas compte. Les bateaux de Prettech sont tenus de se retirer de la route \'le seul cas où l\'Empire s\'éloigne de la première route.\n\nAvec les étrangers, l\'Empire est honnête sur sa propre voie: la parole est littéralement la même chose qu\'elle exige. Elle ne veut pas de galaxie ♪ Elle veut qu\'elle ne soit plus jamais atteinte.',
      },
      {
        title: 'Le nom qui a cessé de parler',
        text:
          'Le capitaine qui a abandonné le bateau avec les colons n\'a pas été condamné dans les archives. Son nom a été arrêté dans la marine, dans les listes, dans sa famille. Les Heshts considèrent que c\'est la plus dure de leurs exécutions: un vaisseau sacré pour 4 000 lits, un souvenir d\'évacuation pour tout ce qui a gardé l\'air.\n\nLa deuxième histoire est celle des instincts, l\'appartement de Bdnie a emprunté un petit prêt au Syndicat pour construire un entrepôt. Quand cela a été découvert, l\'Empire a remboursé sa dette en un jour, et l\'entrepôt a été démonté et recollé avec son métal. L\'appartement n\'a pas été démuni; il a servi à Bdnie pendant 20 ans.',
      },
    ],
  },
  swarm: {
    essence:
      'Roy  ceinture de créatures de la plupart des paysages qui se forment entre les étoiles: des léviathans vivants sans équipage ni capitaine, sans reine ni frontières; pour les cinq autres flottes, il est plus une marée que l\'ennemi.',
    chapters: [
      {
        title: 'C\'est écrit comme le temps.',
        text:
          'Dans les premiers atlas de Roy, on a vu un phénomène météorologique.\n\nRoy n\'a pas participé à la guerre, et personne ne l\'a touché, ni n\'a fait de distinction entre les drapeaux, et quand six flottes ont compté les morts, le bord de la manche était déjà clair, les éclats de bataille lui ont fait du tort: aujourd\'hui, il y a encore des créatures qui, au-dessus des champs de bataille anciens, sont de nouveau sur le chemin de la mort, dont les noms sont ceux des criminations des morts: des échauffourées, des côtés chauds, des battements de l\'Alliance, qui se disputent encore, les profanés ou la résurrection.',
      },
      {
        title: 'Comment la solution se fait - elle?',
        text:
          'La reine a été recherchée pendant un demi-siècle, et les xénologues de six flottes ont ouvert des carapaces mortes et ont procédé à des recensements de meutes et ont fini par reconnaître qu\'ils cherchaient ce qu\'ils avaient l\'habitude de trouver. Le trône de Roy n\'est pas, non plus, le conseil; même Ispolin, le premier léviathan de la meute, n\'a donné aucun ordre à personne. La décision se fait avec effet immédiat: la collusion chimique se divise en une centaine de disputes et de vagues de lumière violette, et il n\'y a rien qui se passe pendant longtemps, et tout se passe immédiatement et de façon irréversible.\n\nLa bête blessée est assommée comme une blessure sur le côté d\'une grande bête: une semaine plus tard, sous la croûte, une nouvelle chitine, un nouveau bateau plus sombre que l\'ancien; l\'âge est considéré comme étant la marque des cicatrices; le petit homme qui a trouvé la plus importante se désintégrera sur le site de la découverte . Un an plus tard, la marée monte dans ce secteur.',
      },
      {
        title: 'Trois mondes avec un nain jaune',
        text:
          '♪ Le premier Sad est un nom étranger, Roy ne dit rien. Les cartographes ont trouvé le système après des décennies de contact: ils ont fait des débats sur le courant comme ils cherchent l\'origine du fleuve. Le nain jaune chaud et les trois mondes dans l\'affaire ♪ ♪ La prud\'hommes sous la jungle du pôle au pôle, avec une anneau de ruelle en orbite; la pitomnik de l\'océan, où les jeunes kilis se mettent à briller la nuit; et l\'eau de la nuit, l\'homme géant du gaz, qui fait des paupières dans les nuages supérieurs.\n\nLes vieilles créatures qui meurent dans l\'océan de Pytomnik, la panthère se couche sur le récif, les nouveaux kiles sur le récif, les vieilles carciries de l\'anneau de la ruelle plus vieille que Flagopad, et personne ne sait ce qui était avant eux.',
      },
      {
        title: 'Rubage et voisinage',
        text:
          'L\'Alliance tient la frontière contre la marée. Roy ne sait pas que la frontière existe; les pertes sont de part et d\'autre, et il en est de même. L\'Empire Pepla brûle le crâne de  personnes sur Helt après avoir brûlé une patrouille, et sept ans plus tard, les gars sont revenus avec les carcasses des patrouilleurs. Le Syndicat a envoyé trois fois des négociateurs, tout est revenu intact et incompréhensible, et le rapport de Meridian a laissé une ligne: \'Le Contrôleur n\'a pas été retrouvé.\n\nSes familles vivent dans des tas de grandes créatures, connaissent les rythmes de la meute et traversent la marée, où les escadrons des autres sont perdus.',
      },
      {
        title: 'Des tasses sur les tables.',
        text:
          'Les colons qui ont fui de Vegle avant la marée sont revenus dix ans plus tard, les maisons étaient entières, sous la croûte des rosiers, les tasses étaient restées sur les tables, Roy a tout gâché et n\'a rien brisé, et les rapatriés ont dit que le plus dur était de s\'habituer à la pensée: Roy ne les avait pas vus.\n\nLe remorquage de la même évacuation, qui a été vu dans une meute, avec des dunes qui travaillent, et le phare de l\'Alliance à la frontière est toujours là, il clignote honnêtement de la frontière de l\'intérieur de la ruelle, et il n\'y a pas eu de passage.',
      },
    ],
  },
  syndicate: {
    essence:
      'Le Syndicat Meridian  cerne une société de plus d\'un État: la nationalité est constituée par un capital, l\'armée remplace le département juridique, et le pouvoir est dominé par des itinéraires qui volent tout ce qui vole.',
    chapters: [
      {
        title: 'Rapport sur les transactions pour la période',
        text:
          'Les archives de la guerre de Prime portent un document de \'Rapport sur les transactions de la période \'. Les prêts des deux parties sont regroupés en deux colonnes, le résultat étant cyané. Pour cette guerre, Meridian n\'a envoyé que des factures: il assure les deux convois d\'une bataille, prêtait à tous ceux qui avaient des cautions, et quand les flottes ont brûlé, il a acheté des dettes, des chantiers et des itinéraires au prix de la ferraille.\n\nSix des centaines de drapeaux ont survécu, et le vainqueur n\'a pas appelé la guerre \'s n\'importe où. Dans la chronique du Syndicat, il y a une note de bas de page sur cette ligne: le vainqueur n\'était pas parmi les guerriers. Quelqu\'un devait réduire le bilan des morts; le Syndicat a bougé, pris une commission, et depuis cette période, le monopole des itinéraires entre dans sa définition.',
      },
      {
        title: 'Prix d &apos; une action',
        text:
          'La citoyenneté est vendue par des paquets de l\'option hôte pour un an à un électeur. Un enfant né à Prime reçoit une action de la société; à la majorité, il décide d\'acheter le reste. La plupart des achètes. Les tables voisines sont entourées d\'un aelar, d\'un descendant de réfugiés impérial et d\'une créature dont le nom n\'est pas traduit: les coutumes de la race sont traitées sur papier comme la culture de la division.\n\nL\'armée ne tient pas, mais les dépenses du département juridique sont supérieures à la flotte, et l\'embargo de Meridian a détruit les mondes sans violer aucun des points signés, le seul crime qui n\'a pas de prix, c\'est de violer le contrat sous lequel le Syndicat lui-même est signé, et ce genre de choses est aussi percutant que les autres.',
      },
      {
        title: 'Meridian zéro',
        text:
          'Le système de la maison \'Méridian-Nol: une étoile blanche de classe A et trois actifs sur son bilan. Prim \'oh-stream\', une ville entière sous la vitre; l\'anneau de transbordement sur son orbite est appelé un méridien zéro: d\'où les tarifs, les horaires et le temps galactique -- \'L\'horloge de référence de Prime confirme les transactions comme un notaire. \'activ 2\' \'Le monde minier où les villes minières louent de l\'air; au-dessus du géant de la réserve de gaz, les collecteurs de gaz sont accrochés à des collecteurs de gaz sombres, et le prix du deutérium pour la polygalactique naît ici deux fois par jour.\n\nUne fois par an, la bourse de Prime ferme une heure, et personne ne l\'appelle "Traure de guerre," l\'heure passe comme une maintenance, et on met du noir pour la maintenance.',
      },
      {
        title: 'Registre des parties',
        text:
          'Les cinq parties sont inscrites dans le registre des cocontractants. L\'Alliance des Verfées libres ∙ ~partenaire/control -- le plus gros client avec l\'habitude de distribuer gratuitement ce qui est disponible; le contrat de non-agression n\'a pas été signé  . .; l\'Alliance paie à temps. L\'Empire Pepla  ∙ prêteur de première catégorie: le prêt à la reconstruction est assuré de façon inflexible, le point de révision des taux d\'expansion est inscrit à la fin. Roy ne signe pas et passe par la section assurance, entre les éruptions d\'étoiles et les tempêtes de gravité; les contributions dans les secteurs de croissance sont recalculées tous les trimestres et toujours en haut.\n\nLe cartel libre est officiellement poursuivi, de manière informelle, par des actions en justice: où il n\'y a pas de port propre, où il y a un vol rouillé, et les deux lignes ne sont pas signalées. Le Syndicat n\'a jamais compté: leurs itinéraires sont plus anciens que le monopole, et le propriétaire de l\'entreprise  ce mot est \'n\'est pas notre \'non\', qui n\'est nulle part ailleurs dans ses documents. Les étrangers rencontrent la même chose: une table blanche, une odeur brevetée d\'ozone et de thé blanc, un contrat sur la table.',
      },
      {
        title: 'Paragraphe 14.2',
        text:
          'Les contrats de Meridian sont sur papier: ils ne sont ni entravés ni piratés. Il y a 40 ans, un courrier avec un prêt impérial prolongé a été pris à l\'abordage à la frontière du cartel, le courrier a brûlé le sac avec lui, et le cas prévu au paragraphe 14.2 a été signalé comme étant le cas de la deuxième ligne, et le crédit a été prolongé. Le port libre, qui hébergeait l\'équipe d\'abats, a découvert qu\'aucun pétrolier ne prenait son carburant en compte et a réglé ses actifs.\n\nLes chasseurs du Syndicat volent sous les numéros d\'inventaire de .. les voitures ne donnent pas, mais chaque personne a la meilleure assurance de la galaxie.',
      },
    ],
  },
  cartel: {
    essence:
      'Le cartel libre  jeune, un réseau de ports de merde soudés à partir de merde d\'autrui: un refuge pour déserteurs, réfugiés et débiteurs, que personne d\'autre n\'a pris, et la loi ici, c\'est de ne pas abandonner les siens.',
    chapters: [
      {
        title: 'Navires de croisière',
        text:
          'Quand des centaines de flottes se sont brûlées les unes pour les autres, chaque escadron a refusé de tirer sur les anneaux et les équipages dont les maisons avaient déjà brûlé; ils ont été marqués par des déserteurs et les réfugiés n\'ont jamais été pris par une seule flotte: chacun les considérait comme des étrangers; les fugitifs sont allés vers un endroit où il n\'y avait rien d\'autre que des nains rouges au bord de la mangue, qui n\'étaient inutiles pour aucun des cent drapeaux.\n\nLe premier dock a été fait à partir de ses propres bateaux cassés, le deuxième vaisseau, le dixième, le centième ème ème ♪ n\'ont pas été expulsés, chacun a trouvé un quai et un travail, et la guerre s\'est terminée sans eux, il en restait six sur des centaines de flottes, le vainqueur n\'a pas été désigné. À La Havane, on dit brièvement: nous sommes partis de cette guerre.',
      },
      {
        title: 'Une couche qui ne s\'éteint pas',
        text:
          'Dans chaque port libre, il y a une cuisinière qui brûle:  un repas amarré, un nom est demandé. Le port pousse autour de la cuisinière. Une deuxième tour est faite vers la cale, une corvette morte, une traversée, le marché .. et après 20 ans, personne ne se souvient de la première chaine.\n\nIls font le port des principaux sur le quai: ceux qui réparent les navires les plus anciens et qui mentent le moins sur les prix. La dette est écrite avec de la craie sur la cloison des cabines, à la vue de tous; seuls ceux qui doivent la faire disparaître peuvent la faire disparaître. Le paiement n\'est pas peint sous la couleur de la coque . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .',
      },
      {
        title: 'Le nain rouge.',
        text:
          'La capitale de la Vallée s\'appelle les étrangers, c\'est le plus vieux port du monde, la vie ici.\n\nLe gros géant gazier, rayonné, nourrit La Havane: les collecteurs de gaz, des centaines de docks, qui se baladent en travers de la voie; les régulateurs ne font pas la queue, et ils le respectent plus que les lois. Beaucoup de boules de pierre sous la benne de vaisseau des trois siècles, de décharges et de nageurs en un seul morceau; les enfants y lisent les débris avant les lettres: le mur de la panguate sera appelé un chantier et un an, le bronze sur le bronze que l\'on a tué. La cave, le monde de glace en orbite longue, entre en possession d\'une cargaison qui ne devrait pas exister et de personnes qu\'il ne faut pas trouver.',
      },
      {
        title: 'Cinq drapeaux en approche.',
        text:
          'Avec l\'Alliance Verfei, à La Havane, les deux parties ont trouvé les survivants de cette guerre, l\'Alliance du traité et le Cartel, mais en fait, l\'Empire Pepla ♪ pire ennemi que jamais ♪ ♪ les cartels pour elle ♪ les caveurs de fugitifs ♪ et le raid impérial sur le port libre ♪ la seule chose qui fait disparaître les plaques à La Havane ♪ ♪ avec Roy ♪ les panciris lâchés sont coûteux ♪ et les mineurs désespérés les suivent au bord des poumons ♪ ils ne reviennent pas ♪ Le Syndicat bloque les routes et pend l\'embargo ♪ Cartel vit dans les fentes entre eux ♪ ♪ La moitié de la contrebande de La Havane de l\'assurée, ironiquement, dans les bureaux de Maridian ♪ La lune d\'or de Pretecch ne se brise pas dans les docks ♪\n\nUn étranger, sous un drapeau, est devenu un étranger, il a failli s\'amarrer et ne s\'est pas moqué.',
      },
      {
        title: 'Deux rumeurs de fourneaux.',
        text:
          'La première est celle de Lasca Rouge. Son capitaine Mora doit à la mécanicienne de Kuchy pour le refroidissement, et le mécanicien est mort dans un collecteur de gaz avant d\'effacer la craie. Personne ne pouvait annuler la dette, et quand EscoLascu est passé à la prise de contrôle impériale, la vieille cloison de la nouvelle coque a été mise en place. ♫Lasca est partie avec cette vidéo pendant quatre décennies.\n\nLe deuxième, à propos du port de Tri Kovsha, où l\'Empire est venu chercher un soudeur à cendre, le chef du barrage a négocié six heures avec le capitaine impérial sur les droits de douane et les droits de fouille, pendant que les pétroliers emmenaient les gens par l\'ombre d\'un géant gazier, et le chargement a pénétré dans un port vide, et le four ne brûle que: il n\'est pas gourmand, même pour l\'Empire.',
      },
    ],
  },
  precursor: {
    essence:
      'Les présomptions de ◆ sont les dernières races de la galaxie: des bateaux en or sur des routes qui ont été tracées avant toutes les guerres, des villes vides et des villes silencieuses où les étrangers eux-mêmes ont perdu leur voix.',
    chapters: [
      {
        title: 'Qui sont partis avant le premier tir',
        text:
          'Quand la guerre a éclaté, les Prétentieux étaient déjà un souvenir, et sur les cartes les plus anciennes que les six flottes ont gardées, leurs villes sont vides et les navires sont déjà sur leurs lignes.\n\nDes centaines de flottes ont divisé la galaxie, et les routes d\'or n\'ont pas changé de cheveux pendant toutes les années de guerre; les états-majors des parties en guerre ont franchi ces lignes sans un seul accord, sans un seul accord. Les archives des six flottes se séparent presque partout. Les lignes sont exactement les mêmes: . . ♪ ont traversé la structure. ♪ Le feu n\'a pas été ouvert. ♪ La ligne n\'a pas repris ♪',
      },
      {
        title: 'Calendrier sans objet',
        text:
          'Les bateaux-blinds d\'or, avec des runes qui brûlent exactement, suivent les mêmes lignes depuis des siècles; le Syndicat a calculé le graphique jusqu\'à une seconde et le vend comme un calendrier. Une partie des lignes mène aux mondes morts, une partie de .. vers les ruines qui se trouvent à jour 24 heures sur 24. Un itinéraire se termine dans un endroit vide: le bateau arrive, attend trois heures, il tourne. Rien n\'a été trouvé au point le plus bas, bien qu\'on l\'ait vérifié trois fois.\n\nLe bateau-citerne rencontre un collecteur de gaz une fois tous les quarante et un ans, bien que les dues de Predech ne se souviennent jamais, à la mesure des observateurs, Liner va à 4 000 places avec des fenêtres éclairées et dans les fenêtres de personne. Ces bateaux ne changent de cap pour personne.',
      },
      {
        title: 'Maison avec lumière non éteinte',
        text:
          'Le système de cartes de la maison est signé de différentes manières, le plus souvent par \'Brouillon du silence\'. Une vieille étoile blanche et jaune autour de laquelle tout est debout comme si le propriétaire était sorti d\'une minute. La tablette déserte \'monde dont les rues sont lues comme des lignes de texte; les aélaras croient qu\'au cours du siècle dernier une rue est plus longue; les archives glaciaires cachent sous la glace un dépôt, leurs portes ne sont pas fermées et elles sont chaudes, et c\'est pourquoi personne n\'entre.\n\nLes propriétaires sont rarement vus: une grande silhouette au bout de la rue, toujours après le travail,  jetant, redressant, arrosant le seul jardin, bien que les pluies sur les tablettes n\'aient pas été de quatre mille ans. Une telle silhouette se retournera, se penchera la tête, écoutera  jetons  je ne peux pas revenir sur le sujet. Les invités ne sont pas interdits. Ils s\'envolent avant de se préparer et ne peuvent pas expliquer.',
      },
      {
        title: 'Règles des voisins',
        text:
          'Chacune des cinq factions a appris sa règle. Dans les atlas d\'Aelarus, le secteur de Pretech n\'a pas été identifié. Sur les cartes impériales, il est signé un \'support\' et Pepel n\'explique pas pourquoi. La marée de Roy traverse des voies d\'or comme l\'eau coule une pierre. Dans le contrat type, le Syndicat de force inclut l\'intervention de Prétech. Il n\'a jamais été utilisé, mais les juristes refusent de le faire. Les anciens cartels se nourrissent des ruines des mondes morts et ne prennent rien des mondes de \'Israélites\', non pas selon la loi, mais selon la croyance qui est tenue par les lois du Cartel.\n\nLes étrangers jouent dans les ports, les enfants, ils ne se font pas prendre par un vaisseau or, les adultes ne sont pas enfermés et se tiennent à côté jusqu\'à ce que le vaisseau passe.',
      },
      {
        title: 'Six heures à l\'écluse',
        text:
          'Un contrebandier jure: quand son vaisseau a gelé un réacteur perforé près du monde mort, le bateau de Predtech a quitté l\'itinéraire et a ouvert une écluse devant lui. Il n\'a pas décidé d\'entrer. Liner a attendu six heures, a fermé l\'écluse et est retourné sur la ligne. Il n\'est pas possible de vérifier l\'histoire, mais le journal de bord du contrebandier montre six heures de stationnement à bord.\n\nLe deuxième cas est officiellement enregistré, l\'Empire Peplá a envoyé une fois l\'ambassade à Chertog Silchanie avec des demandes, le navire est rentré dans le temps, avec des réservoirs pleins, et l\'Ambassadeur a déposé un rapport long, qui ne contenait plus d\'exigences.',
      },
    ],
  },
};

export const STATION_LORE = {
  alliance: {
    ring: 'Le hab de l\'Alliance est une ville entourée d\'un arc de docks: des marchés dans les côtes des chenaux, des écoles de navigation, des quartiers avec des airs différents. Au-dessus de tous ces phares bleus qui ne se battent même pas: tant qu\'il brûle, il y a quelqu\'un pour y retourner. Et ensuite, il y a un phare ici qui est une trahison.',
    outpost:
      'L\'avant-poste de l\'Alliance commence par l\'hôpital et le dock du mur  cerné, la lumière bleue sur l\'écluse s\'allume le premier jour, jusqu\'au nom et jusqu\'au drapeau sur la carte, et la moitié des avant-postes de l\'Alliance ont été construits par une atterrissage d\'urgence.',
    collector:
      'Le récupérateur de gaz de l\'Alliance est un artiste honnête: il bourdonne, pend, change de filtre et reçoit une fois par an une couche de peinture fraîche qui tombe immédiatement sous le gaz. Les équipages se font appeler les plates-formes \'correspondantes\' et se vexent si quelqu\'un les appelle ainsi. C\'est à partir des cors que le bon tiers des capitaines de la flotte a commencé.',
  },
  imperial: {
    ring: 'Le hub de l\'Empire ♪ une forteresse sur la planète: des couches d\'artillerie à l\'extérieur, des docks et des arsenaux à l\'intérieur. Dans le cœur de l\'anneau ♪ Le mur des noms, la salle de commémoration où chaque équipage va devant la sortie, la liste des morts dans la division de Hesht continue de croître. Il n\'y a que les noms, ici, ici, ici, ici, ici, et il n\'y a pas de panneau de nom.',
    outpost:
      'L\'avant-poste impérial est construit de façon permanente: d\'abord les points d\'artillerie, puis la salle de commémoration, et seulement après le logement. Les blocs noirs marqués de l\'alice s\'infiltrent dans le sol comme s\'ils allaient rester assiégés le premier jour parce qu\'ils sont en train de se réunir.',
    collector:
      'Le collecteur de gaz de l\'Empire ♪ est une réserve stratégique: elle se souvient que la guerre est perdue dans des réservoirs vides. Les bastions noirs avec des gorges oranges enflammées fonctionnent sans arrêt et leurs réservoirs ne tombent jamais en dessous de la moitié de la limite. L\'autre moitié de ♪ est une évacuation ♪ et même l\'empereur ne la touche pas.',
  },
  swarm: {
    ring: 'Le hab Roy ♪ Un petit fiançailles coralliens cultivé autour de la planète ♪ à l\'intérieur de l\'os, l\'air chaud et humide et l\'odeur du beurre chaud ♪ Il n\'y a pas de quai ♪ Il y a des bouchons vivants qui se déversent et qui ne voient pas les étrangers ♪ Un bateau qui reste trop longtemps sur l\'anneau commence à pousser ♪ sans intention malfaisante ♪',
    outpost:
      'L\'avant-poste de Roy  cerise: un cul de nidification, doux et semi-transparent, au début moins de corvette. Il s\'est figé, noirci et grandit pendant des années jusqu\'à ce qu\'il devienne un nœud de nouveau calice. Les cartographes les mettent en point avec un parapluie: la taille d\'aujourd\'hui sera dépassée à la prochaine cadence.',
    collector:
      'Le collecteur de gaz de Roy a grandi de lui-même, dans un troupeau qui passe: la tempête de bulles polypétiques dans les nuages supérieurs, parmi les sauvages; en se nourrissant, elle devient lourde, sombre et s\'approche de l\'orbite . Le cartel jure que les collecteurs de gaz reconnaîtront ses pétroliers et les laisseront plus près que les autres.',
  },
  syndicate: {
    ring: 'Le hib du Syndicat  censuré est une roue de pont sombre et accrochée à un graphite avec un cœur de cyanure. Dans le ghetto, les horloges de réception et de référence sont ouvertes; à l\'extérieur, les feux de cyane des quais que le conducteur voit avant la douane sont gratuits. La store est gratuite.',
    outpost:
      'L\'avant-poste colonial du Syndicat est un sombre poste de surveillance avec un détecteur de cyane et un équateur de lumière cyane: une représentation jusqu\'au dernier détail. À l\'intérieur du bureau d\'enregistrement, le thé est excellent et le contrat en trois exemplaires; chaque colon arrive avec une option de bienvenue. Garnison n\'a pas de contrôleur et ses rapports ont peur de plus d\'armes.',
    collector:
      'Le collecteur de gaz du Syndicat est un cratère sombre avec une cheminée de cyanure, un corps grillé et des réservoirs en haut: loin de là, on ressemble à un lustre prédateur au-dessus d\'une tempête. C\'est essentiellement une bourse de carburant: les prix suivent les panneaux de cyane, et même ici il y a une cheminée avec une fleur vivante. Le carburant est chargé seulement après la signature de .., sans exception, même si les duses brûlent.',
  },
  cartel: {
    ring: 'Le hab Cartel est un hameau de ce qui s\'est passé: un collier de bouquets de broyeurs déchiquetés, coupés par des passages, avec un marché sur deux et une cuisinière qui ne s\'éteint pas, et qui est crevé, vendu, ment sur les prix et empoisonne les rumeurs jusqu\'à la fin de la garde, et là, on dirait un désastre sur le store, de l\'intérieur comme une maison.',
    outpost:
      'L\'avant-poste du cartel commence par une table et une cuisinière: d\'abord, l\'endroit où ils vont manger, puis tout le reste. Deux cales soudées ensemble, courbe l\'antenne, une lampe orange près de l\'écluse .. et c\'est un port, parce que c\'est là que vous êtes prêts à prendre le bateau de quelqu\'un d\'autre.',
    collector:
      'Le gars du gars du gaz est appelé le soutien de famille: son carburant maintient la moitié de la flotte libre en marche; un tonneau latané sur un long pantalon, gelé et toujours bruyant, autour duquel les bateaux-citernes sont pavés à tour de rôle; le travail le plus ennuyeux du cartel et le plus respecté.',
  },
  precursor: {
    ring: 'Le hub de Predetch n\'était pas construit ♪ Il était sur les cartes les plus anciennes, et aucune nouvelle n\'a été prise. Les éclats tournaient lentement autour du noyau lumineux, avec une lumière chaude; quand un bateau étranger arrive, il y a une lumière dans leur construction, selon sa taille exacte. Pas de docks, pas de robinets, pas de personnel, mais les gens qui s\'en vont jurent qu\'ils sont partis avec des réservoirs pleins de bouées.',
    outpost:
      'Les avant-postes de la Pretet sont sur les ruines des mondes morts: formation de fragments autour de la barre d\'or qui commence à briller quand quelqu\'un arrive. Les vieux cartels dorment plus chauds et, comme ils disent, plus calmes. La source de chaleur n\'a trouvé aucun appareil.',
    collector:
      'Le collecteur de gaz de Prethech boit l\'atmosphère sans un seul mécanisme visible: la lumière s\'enfuit dans les nuages et revient plus dur. Le Syndicat a calculé son agenda jusqu\'à une seconde et le vend comme un calendrier. Où est le produit, personne ne sait où  ce qu\'il a recueilli, personne ne sait avoir vu un seul chargement, sauf un pétrolier qui arrive une fois tous les quarante et un ans.',
  },
};
