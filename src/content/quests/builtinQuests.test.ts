import { describe, expect, it } from 'vitest';
import { allRewards } from '../world/worldCatalog';
import { builtinQuestFamilies, builtinQuestTemplates, findQuestVariantForAge } from './builtinQuests';

describe('catalogue des quêtes multi-univers', () => {
  it('contient 30 familles et 90 variantes', () => {
    expect(builtinQuestFamilies).toHaveLength(30);
    expect(builtinQuestTemplates).toHaveLength(90);
    expect(new Set(builtinQuestFamilies.map((family) => family.id)).size).toBe(30);
    expect(new Set(builtinQuestTemplates.map((template) => template.id)).size).toBe(90);
  });

  it('propose exactement une variante par âge dans chaque famille', () => {
    for (const family of builtinQuestFamilies) {
      const variants = builtinQuestTemplates.filter((template) => template.familyId === family.id);
      expect(variants).toHaveLength(3);
      expect(variants.map((template) => template.ageBands[0]).sort()).toEqual(['3-5', '6-8', '9-10']);
      expect(new Set(variants.map((template) => template.worldId))).toEqual(new Set([family.worldId]));
      for (const ageBand of ['3-5', '6-8', '9-10'] as const) {
        expect(findQuestVariantForAge(family.id, ageBand, [])?.id).toBe(`${family.id}.${ageBand}`);
      }
    }
  });

  it('utilise uniquement des récompenses du même univers', () => {
    const rewards = new Map(allRewards.map((reward) => [reward.id, reward]));
    for (const template of builtinQuestTemplates) {
      expect(rewards.get(template.rewardDefinitionId)?.worldId).toBe(template.worldId);
    }
  });
});
