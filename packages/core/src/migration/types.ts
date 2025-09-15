import type { State } from "../state";

export interface Migration {
  from: number;
  to: number;
  apply(s: State): State;
}

export class MigrationError extends Error {
  name = "MigrationError";
}
