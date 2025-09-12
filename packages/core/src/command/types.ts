import type { State } from "../state/types";

export interface Command {
  readonly type: string;
  readonly description?: string;

  execute(state: State): State;
  undo(state: State): State;
}
