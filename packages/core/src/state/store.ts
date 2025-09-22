import { State } from "./types";
import { collectChanges } from "./selectors"; // NEW: 변경 집합 계산

let current: State;

export function init(initial: State) {
  current = initial;
}

export function getState(): State {
  return current;
}

export type Listener = (arg: {
  prev: State;
  next: State;
  changes: ReturnType<typeof collectChanges>;
}) => void;

const listeners = new Set<Listener>();

export function replace(next: State) {
  const prev = current;

  if (prev === next) return;

  current = next;

  const changes = collectChanges(prev, next);

  for (const l of listeners)
    l({ prev, next, changes });
}

export function subscribe(
  listener: Listener,
): () => void {
  listeners.add(listener);

  return () => listeners.delete(listener);
}
