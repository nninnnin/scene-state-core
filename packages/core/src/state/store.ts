import { State } from "./types";
import { collectChanges } from "./selectors";

export class Store {
  private currentState: State;
  private updateListeners: Set<Listener> = new Set();

  constructor(initialState: State) {
    this.currentState = initialState;
  }

  get state() {
    return this.currentState;
  }

  update(next: State) {
    if (this.currentState === next) return;

    const prev = this.currentState;
    this.currentState = next;

    // call update listeners with changes
    const changes = collectChanges(prev, next);

    for (const listener of this.updateListeners) {
      listener({
        prev,
        next,
        changes,
      });
    }
  }

  subscribe(listener: Listener) {
    this.updateListeners.add(listener);

    const unsubscribe = () =>
      this.updateListeners.delete(listener);

    return unsubscribe;
  }

  destroy() {
    this.updateListeners.clear();
  }
}

export type Listener = (arg: {
  prev: State;
  next: State;
  changes: ReturnType<typeof collectChanges>;
}) => void;

let current: State;
