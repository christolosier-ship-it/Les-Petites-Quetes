import type { FamilyAppController } from '../../app/controller/FamilyAppController';
import { Card } from '../../components/primitives/Card';
import { chaptersForWorld, findWorldDefinition, rewardsForWorld } from '../../content/world/worldCatalog';
import type { WorldId } from '../../domain/world/WorldDefinition';

interface TreasurePanelProps {
  readonly app: FamilyAppController;
  readonly childId: string;
  readonly worldId: WorldId;
}

export function TreasurePanel({ app, childId, worldId }: TreasurePanelProps) {
  const world = findWorldDefinition(worldId);
  const progress = app.state.worldProgress.find((candidate) => candidate.childId === childId && candidate.worldId === worldId);
  const rewards = rewardsForWorld(worldId).filter((reward) => progress?.unlockedRewardIds.includes(reward.id));
  const chapters = chaptersForWorld(worldId).filter((chapter) => progress?.unlockedStoryChapterIds.includes(chapter.id));

  return (
    <div className="panel-grid">
      <Card as="section"><p className="eyebrow">Mon trésor</p><h3>Découvertes de {world.shortName}</h3>{rewards.length === 0 ? <p>Termine une quête de cet univers pour faire apparaître la première découverte.</p> : <div className="treasure-list">{rewards.map((reward) => <div key={reward.id} className="treasure-item"><span aria-hidden="true">✦</span><div><strong>{reward.label}</strong><p>{reward.description}</p></div></div>)}</div>}</Card>
      <Card as="section"><p className="eyebrow">Mon histoire</p><h3>Le livre de {world.mascotName}</h3>{chapters.length === 0 ? <p>La première page attend encore une aventure.</p> : chapters.map((chapter) => <article key={chapter.id} className="storybook-page"><span>{chapter.order}</span><div><h4>{chapter.title}</h4><p>{chapter.body}</p></div></article>)}</Card>
    </div>
  );
}
