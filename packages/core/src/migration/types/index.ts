import {
  VersionedInput,
  VersionedStates,
} from "../validation/state.types";

export interface Migration {
  from: number;
  to: number;
  apply(
    s: VersionedStates,
  ): VersionedInput;
}

export class MigrationError extends Error {
  name = "MigrationError";
}
