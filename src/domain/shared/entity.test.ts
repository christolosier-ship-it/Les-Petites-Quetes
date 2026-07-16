import { describe, expect, it } from 'vitest';
import { DomainError } from './errors';
import { createEntityMetadata, incrementRevision } from './entity';

describe('métadonnées d’entité', () => {
  it('crée une première révision avec un identifiant stable', () => {
    expect(createEntityMetadata('child-1', '2026-07-16T07:00:00.000Z')).toEqual({
      id: 'child-1',
      createdAt: '2026-07-16T07:00:00.000Z',
      updatedAt: '2026-07-16T07:00:00.000Z',
      revision: 1,
    });
  });

  it('refuse un identifiant ou un instant vide', () => {
    expect(() => createEntityMetadata('   ', 'now')).toThrowError(DomainError);
    expect(() => createEntityMetadata('child-1', '   ')).toThrowError(DomainError);
  });

  it('préserve les métadonnées et incrémente la révision', () => {
    expect(
      incrementRevision(
        {
          id: 'child-1',
          createdAt: '2026-07-16T07:00:00.000Z',
          updatedAt: '2026-07-16T07:00:00.000Z',
          revision: 1,
        },
        '2026-07-16T08:00:00.000Z',
      ),
    ).toEqual({
      id: 'child-1',
      createdAt: '2026-07-16T07:00:00.000Z',
      updatedAt: '2026-07-16T08:00:00.000Z',
      revision: 2,
    });
  });
});
