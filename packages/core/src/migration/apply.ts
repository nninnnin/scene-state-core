import {
  CURRENT_SCHEMA_VERSION,
  assertInvariants,
} from "../state";
import { NoMigrationPathError } from "./errors";
import { MIGRATIONS } from "./registry";
import { parseVersioned } from "./validation/parseVersioned";

import {
  StateV2 as LatestSchema,
  VersionedInput,
} from "./validation/state.types";

const migrationMap = new Map(
  MIGRATIONS.map((m) => [m.from, m]),
);

function checkOutVersioned(
  input: unknown,
) {
  const isObject =
    typeof input === "object" &&
    input !== null;

  const rawVersion = isObject
    ? (input as any).version
    : undefined;

  if (
    typeof rawVersion === "number" &&
    rawVersion > CURRENT_SCHEMA_VERSION
  ) {
    throw new NoMigrationPathError(
      rawVersion,
      CURRENT_SCHEMA_VERSION,
    );
  }
}

export function migrateState(
  input: unknown,
) {
  // 1) 스키마 유효성 검사
  const parsedState: VersionedInput =
    parseVersioned(input);

  // 버전 유효성 검사
  checkOutVersioned(input);

  let migratedState:
    | VersionedInput
    | LatestSchema = parsedState;

  // 2) 최신 스키마로 마이그레이션
  while (
    migratedState.version !==
    CURRENT_SCHEMA_VERSION
  ) {
    const currentMigration =
      migrationMap.get(
        migratedState.version,
      );

    if (!currentMigration) {
      throw new NoMigrationPathError(
        migratedState.version,
        CURRENT_SCHEMA_VERSION,
      );
    }

    migratedState =
      currentMigration.apply(
        migratedState,
      );
  }

  // 3) 무결성 검사
  const invariantCheckedState =
    assertInvariants("onload")(
      migratedState as LatestSchema,
    );

  return invariantCheckedState;
}
