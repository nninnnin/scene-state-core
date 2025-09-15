import {
  CURRENT_SCHEMA_VERSION,
  State,
  validateState,
} from "../state";
import { NoMigrationPathError } from "./errors";
import { MIGRATIONS } from "./registry";

const migrationMap = new Map(
  MIGRATIONS.map((m) => [m.from, m]),
);

export function migrateState(
  input: State,
) {
  let newState = {
    ...input,
    version: input.version ?? 0,
  };

  let progressed = true;

  const hasMigrationPath =
    migrationMap.get(newState.version);

  while (
    newState.version !==
      CURRENT_SCHEMA_VERSION &&
    progressed
  ) {
    progressed = false;

    if (!hasMigrationPath) {
      throw new NoMigrationPathError(
        newState.version,
        CURRENT_SCHEMA_VERSION,
      );
    }

    for (const migration of MIGRATIONS) {
      if (
        migration.from ===
        newState.version
      ) {
        newState =
          migration.apply(newState);
        progressed = true;

        break;
      }
    }
  }

  return validateState(newState);
}
