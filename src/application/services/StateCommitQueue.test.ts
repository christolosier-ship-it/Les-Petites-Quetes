import { describe, expect, it } from 'vitest';
import { StateCommitQueue } from './StateCommitQueue';

function deferred(): { readonly promise: Promise<void>; readonly release: () => void } {
  let resolvePromise: (() => void) | undefined;
  const promise = new Promise<void>((resolve) => {
    resolvePromise = () => resolve();
  });
  return {
    promise,
    release: () => resolvePromise?.(),
  };
}

describe('StateCommitQueue', () => {
  it('sérialise les transformations et les écritures', async () => {
    const firstWrite = deferred();
    const events: string[] = [];
    const published: number[] = [];
    const queue = new StateCommitQueue(
      0,
      (_current, next) => {
        events.push(`save-${next}`);
        return next === 1 ? firstWrite.promise : Promise.resolve();
      },
      (next) => {
        events.push(`publish-${next}`);
        published.push(next);
      },
    );

    const first = queue.enqueue((current) => current + 1);
    const second = queue.enqueue((current) => current + 1);
    await Promise.resolve();
    expect(events).toEqual(['save-1']);

    firstWrite.release();
    await Promise.all([first, second]);
    expect(events).toEqual(['save-1', 'publish-1', 'save-2', 'publish-2']);
    expect(published).toEqual([1, 2]);
    expect(queue.current()).toBe(2);
  });

  it('ne publie pas un état dont la persistance échoue', async () => {
    const published: number[] = [];
    let fail = true;
    const queue = new StateCommitQueue(
      0,
      () => fail ? Promise.reject(new Error('écriture refusée')) : Promise.resolve(),
      (next) => published.push(next),
    );

    await expect(queue.enqueue((current) => current + 1)).rejects.toThrow('écriture refusée');
    expect(queue.current()).toBe(0);
    expect(published).toEqual([]);

    fail = false;
    await queue.enqueue((current) => current + 1);
    expect(queue.current()).toBe(1);
    expect(published).toEqual([1]);
  });
});
