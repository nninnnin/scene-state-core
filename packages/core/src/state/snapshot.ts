import { State } from "./types";

export type Snapshot = Readonly<State>;

export function takeSnapshot(
  state: State,
): Snapshot {
  return state as Snapshot;
}

export function rollbackTo(
  snapshot: Snapshot,
): State {
  return snapshot as State;
}
