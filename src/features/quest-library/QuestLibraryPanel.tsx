import { useState } from 'react';
import type { FamilyAppController } from '../../app/controller/useFamilyApp';
import { getAssetUrl } from '../../assets/registry/catalog';
import { Button } from '../../components/primitives/Button';
import { Card } from '../../components/primitives/Card';
import { categoryLabels } from '../../content/copy/labels';
import type { QuestTemplate } from '../../domain/quest/QuestTemplate';
import type { QuestCategoryId } from '../../domain/shared/types';
import { CustomQuestForm } from './CustomQuestForm';
import { QuestScheduleForm } from './QuestScheduleForm';

interface QuestLibraryPanelProps {
  readonly app: FamilyAppController;
}

export function QuestLibraryPanel({ app }: QuestLibraryPanelProps) {
  const [category, setCategory] = useState<'all' | QuestCategoryId>('all');
  const [selected, setSelected] = useState<QuestTemplate>();
  const [customOpen, setCustomOpen] = useState(false);
  const templates = [...app.builtinTemplates, ...app.state.customQuestTemplates].filter(
    (template) => !template.isArchived && (category === 'all' || template.categoryId === category),
  );

  if (selected !== undefined) {
    return (
      <Card as="section" className="editor-card">
        <p className="eyebrow">Planification</p>
        <h3>{selected.title}</h3>
        <p>{selected.instruction}</p>
        <QuestScheduleForm app={app} template={selected} onDone={() => setSelected(undefined)} />
      </Card>
    );
  }

  if (customOpen) {
    return (
      <Card as="section" className="editor-card">
        <p className="eyebrow">Nouvelle quête</p>
        <h3>Créer depuis zéro</h3>
        <CustomQuestForm app={app} onDone={() => setCustomOpen(false)} />
      </Card>
    );
  }

  return (
    <section className="stack" aria-labelledby="library-title">
      <div className="section-heading">
        <div><p className="eyebrow">40 idées prêtes</p><h3 id="library-title">Bibliothèque de quêtes</h3></div>
        <Button onClick={() => setCustomOpen(true)}>Créer une quête</Button>
      </div>
      <div className="filter-row" role="group" aria-label="Filtrer par catégorie">
        <button className={category === 'all' ? 'chip chip--active' : 'chip'} type="button" onClick={() => setCategory('all')}>Toutes</button>
        {Object.entries(categoryLabels).map(([id, label]) => (
          <button key={id} className={category === id ? 'chip chip--active' : 'chip'} type="button" onClick={() => setCategory(id as QuestCategoryId)}>{label}</button>
        ))}
      </div>
      <div className="quest-library-grid">
        {templates.map((template) => (
          <Card key={template.id} className="quest-template-card">
            <img src={getAssetUrl(template.illustrationId)} alt="" />
            <div>
              <span className="category-tag">{categoryLabels[template.categoryId]}</span>
              <h4>{template.title}</h4>
              <p>{template.instruction}</p>
            </div>
            <Button variant="secondary" onClick={() => setSelected(template)}>Préparer</Button>
          </Card>
        ))}
      </div>
    </section>
  );
}
