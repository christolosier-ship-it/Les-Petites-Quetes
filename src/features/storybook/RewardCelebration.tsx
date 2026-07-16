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
  const grantId = grant?.id;
  const soundEnabled = app.state.settings.soundEnabled;
  const durationSeconds = app.state.settings.celebrationDurationSeconds;
  const acknowledgeReward = app.acknowledgeReward;

  useEffect(() => {
    if (grantId) playCelebrationSound(soundEnabled);
  }, [grantId, soundEnabled]);

  useEffect(() => {
    if (!grantId) return undefined;
    const timeout = globalThis.setTimeout(
      () => void acknowledgeReward(grantId),
      durationSeconds * 1_000,
    );
    return () => globalThis.clearTimeout(timeout);
  }, [acknowledgeReward, durationSeconds, grantId]);

  if (!grant || !reward) return null;
  const activeGrantId = grant.id;

  async function close(showWorld: boolean) {
    await app.acknowledgeReward(activeGrantId);
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
