import { describe, expect, it } from "vitest";
import { migrateState } from "../apply";
import { CURRENT_SCHEMA_VERSION } from "../../state";
import { NoMigrationPathError } from "../errors";

describe("마이그레이션 체인", () => {
  it("v0 부터 current까지", () => {
    const v0 = {
      entities: {},
      components: {
        transform: {
          E: {
            position: [0, 0],
          },
        },
      },
    };

    const migrated = migrateState(v0);

    expect(migrated.version).toBe(
      CURRENT_SCHEMA_VERSION,
    );
  });

  it("throws when no path exists", () => {
    const overVersionState: unknown = {
      version: CURRENT_SCHEMA_VERSION + 1,
      entities: {},
      components: { transform: {} },
    };

    expect(() =>
      migrateState(overVersionState),
    ).toThrow(NoMigrationPathError);
  });
});
