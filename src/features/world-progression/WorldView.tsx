import type { FamilyAppController } from '../../app/controller/FamilyAppController';
import { Card } from '../../components/primitives/Card';
import { ParallaxScene } from '../../components/world/ParallaxScene';
import { chaptersForWorld, findWorldDefinition, rewardsForWorld } from '../../content/world/worldCatalog';
import type { WorldId } from '../../domain/world/WorldDefinition';

interface WorldViewProps {
  readonly app: FamilyAppController;
  readonly childId?: string;
  readonly worldId?: WorldId;
  readonly compact?: boolean;
}

const stageLabels = ['Le monde sommeille', 'Les premiers signes', 'Le refuge grandit', 'Le monde rayonne'] as const;

export function WorldView({ app, childId, worldId = 'world.firefly-forest', compact = false }: WorldViewProps) {
  const selectedChildId = childId ?? app.state.settings.activeChildId;
  const child = app.state.children.find((candidate) => candidate.id === selectedChildId);
  const world = findWorldDefinition(worldId);
  const progress = app.state.worldProgress.find((candidate) => candidate.childId === selectedChildId && candidate.worldId === worldId);
  const stage = progress?.stage ?? 0;
  const rewards = rewardsForWorld(worldId).filter((reward) => progress?.unlockedRewardIds.includes(reward.id));
  const chapters = chaptersForWorld(worldId).filter((chapter) => progress?.unlockedStoryChapterIds.includes(chapter.id));
  if (!child) return <Card><p>Choisis ou crée un profil pour découvrir les univers.</p></Card>;
  const reducedMotion = app.state.settings.reducedMotion === 'reduce';

  return (
    <div className={compact ? 'world-layout world-layout--compact' : 'world-layout'}>
      <Card className={`world-scene world-scene--stage-${stage}`}>
        <ParallaxScene world={world} stage={stage} reducedMotion={reducedMotion} />
        <div className="world-scene__caption"><p className="eyebrow">{world.mascotName} t’accompagne</p><h3>{stageLabels[stage]}</h3><p>{child.ageBand === '3-5' ? 'Chaque quête ajoute un petit changement dans ce monde.' : `${progress?.completionCount ?? 0} quête${(progress?.completionCount ?? 0) > 1 ? 's' : ''} ont fait évoluer cet univers.`}</p></div>
      </Card>
      <div className="world-details">
        <Card as="section"><p className="eyebrow">Trésor de l’univers</p><h3>Objets et habitants</h3>{rewards.length === 0 ? <p>La première découverte apparaîtra après une quête terminée.</p> : <div className="reward-grid">{rewards.map((reward) => <div key={reward.id} className="reward-token"><span aria-hidden="true">✦</span><strong>{reward.label}</strong><small>{reward.description}</small></div>)}</div>}</Card>
        <Card as="section"><p className="eyebrow">Histoire</p><h3>Chapitres découverts</h3>{chapters.length === 0 ? <p>L’histoire commencera avec la première récompense.</p> : chapters.map((chapter) => <details key={chapter.id} className="story-chapter"><summary>{chapter.order}. {chapter.title}</summary><p>{chapter.body}</p></details>)}</Card>
      </div>
    </div>
  );
}
