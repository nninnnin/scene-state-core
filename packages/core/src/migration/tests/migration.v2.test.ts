import {
  describe,
  expect,
  it,
} from "vitest";
import { migrateState } from "../apply";
import { DEFAULT_TRANSFORM } from "../../transform";

describe("v2 migration test", () => {
  it("Sanitize transform values on v2 from v1", () => {
    const v1_weird: unknown = {
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

    const migrated = migrateState(
      v1_weird,
      {
        allowFutureVersionsUpTo: 2,
      },
    );

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
    ).toBeUndefined();

    // Sanitization 확인
    const transformA =
      migrated.components.transform.a;

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
});
