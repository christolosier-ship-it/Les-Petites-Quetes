import { useEffect } from 'react';
import type { FamilyAppController } from '../../app/controller/FamilyAppController';
import { Button } from '../../components/primitives/Button';
import { Card } from '../../components/primitives/Card';
import { findRewardDefinition } from '../../content/world/fireflyWorld';
import { playCelebrationSound } from '../../platform/audio/playCelebrationSound';

interface RewardCelebrationProps {
  readonly app: FamilyAppController;
  readonly childId: string;
  readonly onViewWorld: () => void;
}

export function RewardCelebration({ app, childId, onViewWorld }: RewardCelebrationProps) {
  const grant = app.state.rewardGrants.find(
    (candidate) => candidate.childId === childId && !app.state.acknowledgedRewardGrantIds.includes(candidate.id),
  );
  const reward = grant ? findRewardDefinition(grant.rewardDefinitionId) : undefined;

  useEffect(() => {
    if (grant) playCelebrationSound(app.state.settings.soundEnabled);
  }, [app.state.settings.soundEnabled, grant]);

  if (!grant || !reward) return null;

  async function close(showWorld: boolean) {
    await app.acknowledgeReward(grant!.id);
    if (showWorld) onViewWorld();
  }

  return (
    <Card as="section" className="reward-celebration" aria-live="polite" data-reward-celebration>
      <div className="celebration-sparkles" aria-hidden="true">✨ ✦ ✨</div>
      <p className="eyebrow">Nouvelle découverte</p>
      <h3>{reward.label}</h3>
      <p>{reward.description}</p>
      <p>Cette petite action a fait grandir la Forêt des Lucioles.</p>
      <div className="button-row">
        <Button onClick={() => void close(true)}>Voir dans mon monde</Button>
        <Button variant="quiet" onClick={() => void close(false)}>Continuer</Button>
      </div>
    </Card>
  );
}
