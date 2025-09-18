import {
  describe,
  expect,
  it,
} from "vitest";
import {
  CURRENT_SCHEMA_VERSION,
  State,
} from "../types";
import { assertInvariants } from ".";
import { InvalidComponentError } from "./errors";

describe("컴포넌트 고아 테스트", () => {
  it("메쉬 키에 해당하는 엔티티가 상태 내부에 존재한다.", () => {
    const state: State = {
      version: CURRENT_SCHEMA_VERSION,
      entities: {
        e1: { name: "Cube" },
      },
      components: {
        transform: {
          e1: {
            position: [0, 0, 0],
            rotation: [0, 0, 0],
            scale: [1, 1, 1],
          },
        },
        mesh: { e1: "mesh:cube01" },
        material: {},
      },
    };

    expect(() =>
      assertInvariants("onload")(state),
    );

    expect(() =>
      assertInvariants("onupdate")(
        state,
      ),
    );
  });

  it("메쉬 키에 해당하는 엔티티가 상태 내부에 존재하지 않는다면 에러 던지기", () => {
    const state = {
      entities: {},
      components: {
        transform: {},
        mesh: { ghost: "mesh:x" },
        material: {},
      },
    } as unknown as State;

    expect(() =>
      assertInvariants("onload")(state),
    ).toThrow(InvalidComponentError);
  });

  it("머티리얼 키에 해당하는 엔티티가 상태 내부에 존재한다.", () => {
    const state: State = {
      version: CURRENT_SCHEMA_VERSION,
      entities: {
        e1: { name: "Sphere" },
      },
      components: {
        transform: {
          e1: {
            position: [0, 0, 0],
            rotation: [0, 0, 0],
            scale: [1, 1, 1],
          },
        },
        mesh: {},
        material: { e1: "mat:std#1" },
      },
    };
    expect(() =>
      assertInvariants("onload")(state),
    ).not.toThrow();
  });

  it("머티리얼 키에 해당하는 엔티티가 상태 내부에 존재하지 않는다면 에러 던지기", () => {
    const state = {
      entities: { e1: { name: "ok" } },
      components: {
        transform: {
          e1: {
            position: [0, 0, 0],
            rotation: [0, 0, 0],
            scale: [1, 1, 1],
          },
        },
        mesh: {},
        material: { ghost: "mat:x" },
      },
    } as unknown as State;
    expect(() =>
      assertInvariants("onload")(state),
    ).toThrow(InvalidComponentError);
  });
});
