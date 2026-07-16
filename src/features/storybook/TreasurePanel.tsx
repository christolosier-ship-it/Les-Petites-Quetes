import type { FamilyAppController } from '../../app/controller/useFamilyApp';
import { Card } from '../../components/primitives/Card';
import { fireflyChapters, fireflyRewards, FIREFLY_WORLD_ID } from '../../content/world/fireflyWorld';

interface TreasurePanelProps {
  readonly app: FamilyAppController;
  readonly childId: string;
}

export function TreasurePanel({ app, childId }: TreasurePanelProps) {
  const progress = app.state.worldProgress.find(
    (candidate) => candidate.childId === childId && candidate.worldId === FIREFLY_WORLD_ID,
  );
  const rewards = fireflyRewards.filter((reward) => progress?.unlockedRewardIds.includes(reward.id));
  const chapters = fireflyChapters.filter((chapter) => progress?.unlockedStoryChapterIds.includes(chapter.id));

  return (
    <div className="panel-grid">
      <Card as="section">
        <p className="eyebrow">Mon trésor</p>
        <h3>Objets et amis découverts</h3>
        {rewards.length === 0 ? <p>Termine une quête pour réveiller la première lumière.</p> : (
          <div className="treasure-list">{rewards.map((reward) => <div key={reward.id} className="treasure-item"><span aria-hidden="true">✦</span><div><strong>{reward.label}</strong><p>{reward.description}</p></div></div>)}</div>
        )}
      </Card>
      <Card as="section">
        <p className="eyebrow">Mon histoire</p>
        <h3>Le livre de Lumo</h3>
        {chapters.length === 0 ? <p>La première page attend encore sa luciole.</p> : chapters.map((chapter) => <article key={chapter.id} className="storybook-page"><span>{chapter.order}</span><div><h4>{chapter.title}</h4><p>{chapter.body}</p></div></article>)}
      </Card>
    </div>
  );
}
