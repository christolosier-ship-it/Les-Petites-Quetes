import { describe, expect, it } from 'vitest';
import { incrementRevision } from './entity';

describe('incrementRevision', () => {
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
