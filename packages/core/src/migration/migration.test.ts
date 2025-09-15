import {
  describe,
  expect,
  it,
} from "vitest";
import { migrateState } from "./apply";
import {
  CURRENT_SCHEMA_VERSION,
  State,
} from "../state";
import { DEFAULT_TRANSFORM } from "../transform";
import { NoMigrationPathError } from "./errors";

describe("마이그레이션 체인", () => {
  it("v0 부터 v2(current)까지", () => {
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

  it("Sanitize transform values on v2", () => {
    const v1_weird: State = {
      version: 1,
      entities: {
        a: { name: "A" },
        b: { name: "B" },
      },
      components: {
        transform: {
          a: {
            position: [
              0,
              NaN,
              undefined as any,
            ],
            rotation: [Infinity, 1, 2],
            scale: [
              0,
              2,
              undefined as any,
            ],
          },
          ghost: DEFAULT_TRANSFORM,
        },
      },
    };

    const migrated =
      migrateState(v1_weird);

    // 버전 업그레이드 확인
    expect(migrated.version).toBe(2);

    // 고아 제거 확인
    expect(
      migrated.components.transform
        .ghost,
    ).toBeUndefined();

    expect(
      migrated.components.transform.a,
    ).toBeDefined();
    expect(
      migrated.components.transform.b,
    ).toBeDefined();

    // Sanitization 확인
    const transformA =
      migrated.components.transform.a;

    console.log(transformA);

    expect(transformA.position).toEqual(
      [
        0,
        DEFAULT_TRANSFORM.position[1],
        DEFAULT_TRANSFORM.position[2],
      ],
    );

    expect(transformA.rotation).toEqual(
      [
        DEFAULT_TRANSFORM.rotation[0],
        1,
        2,
      ],
    );

    expect(transformA.scale).toEqual([
      1, 2, 1,
    ]); // 0 -> 1, undefined -> 1
  });

  it("throws when no path exists", () => {
    const overVersionState: State = {
      version:
        CURRENT_SCHEMA_VERSION + 1,
      entities: {},
      components: { transform: {} },
    };

    expect(() =>
      migrateState(overVersionState),
    ).toThrow(NoMigrationPathError);
  });
});
