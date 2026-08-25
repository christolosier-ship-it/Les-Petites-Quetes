const FINAL_REPLACEMENTS = [
  ['Régén. vie +${v}/秒', 'Régén. vie +${v}/s'],
  ['Régén. mana +${v}/秒', 'Régén. mana +${v}/s'],
  ['`${zd.name}(需击败${BOSS_DEFS[zd.req].name})`', '`${zd.name} (vaincre ${BOSS_DEFS[zd.req].name})`'],
  ['☠ 中毒', '☠ Poison'],
  ['Général · 常驻Attaque de base', 'Général · Attaque de base permanente'],
  ['I Sac  C 角色  M Musique  H 帮助', 'I Sac  C Personnage  M Musique  H Aide'],
  ['仓库 · Molly', 'Coffre · Molly'],
  ["${which === 'char' ? '角色' : '共享'}Coffre", "${which === 'char' ? 'Personnel · ' : 'Partagé · '}Coffre"],
  ['存入100', 'Déposer 100'],
  ['存全部', 'Tout déposer'],
  ['取出100', 'Retirer 100'],
  ['取全部', 'Tout retirer'],
  ['+0.6 攻击 · +0.6 Armure', '+0.6 Attaque · +0.6 Armure'],
  ['+0.4% 技伤 · +0.12 Mana回', '+0.4% dégâts talent · +0.12 régén. mana'],
  ['+0.45% 暴击 · +0.5% 暴伤', '+0.45% critique · +0.5% dégâts crit.'],
  ["burn: '灼烧'", "burn: 'Brûlure'"],
  ["quake: '震地'", "quake: 'Onde de choc'"],
  ["chill: '冰缓'", "chill: 'Givre'"],
  ["leech: '吸Vie'", "leech: 'Vol de vie'"],
  ["haste: '迅捷'", "haste: 'Vitesse'"],
  ["thorns: '荆棘'", "thorns: 'Épines'"],
  ['」(', ' » ('],
  [' 施放)', ' pour lancer)'],
  ['`重置(${50 + P.lvl * 15}pièces)`', '`Réinitialiser (${50 + P.lvl * 15} pièces)`'],
  ['▼  points击下方槽位装备…', '▼ Touchez un emplacement ci-dessous pour équiper…'],
  [' 解锁', ' requis'],
  ["txt('攻'", "txt('ATQ'"],
  ['Gorm le forgeron · Reforger台', 'Gorm le forgeron · Forge'],
  ['开始新游戏', 'Nouvelle partie'],
  ["isCur ? 'Continuer' : '进入'", "isCur ? 'Continuer' : 'Jouer'"],
];

export function finalizeOriginFrench(source) {
  let output = source;
  for (const [from, to] of [...FINAL_REPLACEMENTS].sort((a, b) => b[0].length - a[0].length)) {
    output = output.replaceAll(from, to);
  }
  return output;
}
