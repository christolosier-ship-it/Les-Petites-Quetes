import type { FamilyAppController } from '../../app/controller/useFamilyApp';
import { getAssetUrl } from '../../assets/registry/catalog';
import { Card } from '../../components/primitives/Card';
import { fireflyChapters, fireflyRewards, FIREFLY_WORLD_ID } from '../../content/world/fireflyWorld';

interface WorldViewProps {
  readonly app: FamilyAppController;
  readonly childId?: string;
  readonly compact?: boolean;
}

const stageLabels = ['Clairière endormie', 'Premières lumières', 'Village réveillé', 'Forêt illuminée'] as const;

export function WorldView({ app, childId, compact = false }: WorldViewProps) {
  const selectedChildId = childId ?? app.state.settings.activeChildId;
  const child = app.state.children.find((candidate) => candidate.id === selectedChildId);
  const progress = app.state.worldProgress.find(
    (candidate) => candidate.childId === selectedChildId && candidate.worldId === FIREFLY_WORLD_ID,
  );
  const stage = progress?.stage ?? 0;
  const rewards = fireflyRewards.filter((reward) => progress?.unlockedRewardIds.includes(reward.id));
  const chapters = fireflyChapters.filter((chapter) => progress?.unlockedStoryChapterIds.includes(chapter.id));

  if (!child) return <Card><p>Choisis ou crée un profil pour découvrir la forêt.</p></Card>;

  return (
    <div className={compact ? 'world-layout world-layout--compact' : 'world-layout'}>
      <Card className={`world-scene world-scene--stage-${stage}`}>
        <img src={getAssetUrl(`world.forest-stage-${stage}`)} alt={`La Forêt des Lucioles, état ${stageLabels[stage]}.`} />
        <div className="world-scene__overlay">
          <span className="mascot-bubble">✨ Lumo veille sur le sentier</span>
          <h3>{stageLabels[stage]}</h3>
          <p>{progress?.completionCount ?? 0} petite(s) quête(s) ont fait grandir ce monde.</p>
        </div>
      </Card>
      <div className="world-details">
        <Card as="section">
          <p className="eyebrow">Trésor</p>
          <h3>Objets et habitants</h3>
          {rewards.length === 0 ? <p>La première lumière apparaîtra après une quête terminée.</p> : (
            <div className="reward-grid">{rewards.map((reward) => <div key={reward.id} className="reward-token"><span aria-hidden="true">✦</span><strong>{reward.label}</strong><small>{reward.description}</small></div>)}</div>
          )}
        </Card>
        <Card as="section">
          <p className="eyebrow">Histoire</p>
          <h3>Chapitres découverts</h3>
          {chapters.length === 0 ? <p>L’histoire commencera avec la première récompense.</p> : chapters.map((chapter) => <details key={chapter.id} className="story-chapter"><summary>{chapter.order}. {chapter.title}</summary><p>{chapter.body}</p></details>)}
        </Card>
      </div>
    </div>
  );
}
