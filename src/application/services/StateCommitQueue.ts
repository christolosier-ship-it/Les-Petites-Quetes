export type StateTransform<T> = (current: T) => T;
export type StatePersist<T> = (current: T, next: T) => Promise<void>;

export class StateCommitQueue<T> {
  private currentState: T;
  private tail: Promise<void> = Promise.resolve();

  constructor(
    initialState: T,
    private readonly persist: StatePersist<T>,
    private readonly publish: (state: T) => void,
  ) {
    this.currentState = initialState;
  }

  current(): T {
    return this.currentState;
  }

  hydrate(state: T): void {
    this.currentState = state;
    this.publish(state);
  }

  enqueue(
    transform: StateTransform<T>,
    persistOverride: StatePersist<T> = this.persist,
  ): Promise<T> {
    const operation = this.tail.then(async () => {
      const current = this.currentState;
      const next = transform(current);
      await persistOverride(current, next);
      this.currentState = next;
      this.publish(next);
      return next;
    });
    this.tail = operation.then(
      () => undefined,
      () => undefined,
    );
    return operation;
  }
}
