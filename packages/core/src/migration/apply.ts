import {
  CURRENT_SCHEMA_VERSION,
  assertInvariants,
} from "../state";
import { NoMigrationPathError } from "./errors";
import { MIGRATIONS } from "./registry";
import { parseVersioned } from "./validation/parseVersioned";

import {
  LatestSchema,
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

export interface MigrateOptions {
  // future version 허용 상한 (undefined면 허용 안 함)
  allowFutureVersionsUpTo?: number;
}

export function migrateState(
  input: unknown,
  options?: MigrateOptions,
) {
  const migrateTo =
    options?.allowFutureVersionsUpTo ??
    CURRENT_SCHEMA_VERSION;

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
    migratedState.version !== migrateTo
  ) {
    const currentMigration =
      migrationMap.get(
        migratedState.version,
      );

    if (!currentMigration) {
      throw new NoMigrationPathError(
        migratedState.version,
        migrateTo,
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
