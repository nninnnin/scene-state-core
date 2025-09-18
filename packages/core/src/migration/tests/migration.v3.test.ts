import {
  describe,
  expect,
  it,
} from "vitest";

import {
  z_v2,
  z_v3,
} from "../validation/schema";
import { m2_to_3 } from "../migrations/2_to_3";
import { assertInvariants } from "../../state";
import { StateV3 } from "../validation/state.types";

describe("v3 migration test", () => {
  it("mesh와 material이 없는 v2 상태의 v3 무결성 검사", () => {
    const rawV2 = z_v2.parse({
      version: 2,
      entities: { e1: { name: "ok" } },
      components: {
        transform: {
          e1: {
            position: [0, 0, 0],
            rotation: [0, 0, 0],
            scale: [1, 1, 1],
          },
        },
        mesh: {
          ghost: "mesh:x",
        },
        material: { e1: "mat:std#1" },
      },
    });

    const v3 = m2_to_3.apply(rawV2);

    expect(() =>
      assertInvariants("onload")(
        v3 as StateV3,
      ),
    ).not.toThrow();

    expect(
      (v3 as StateV3).components.mesh
        ?.ghost,
    ).toBeUndefined();

    expect(
      (v3 as StateV3).components
        .material?.ghost,
    ).toBeUndefined();

    expect(z_v3.parse(v3).version).toBe(
      3,
    );
  });
});
