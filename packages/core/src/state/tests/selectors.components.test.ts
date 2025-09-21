import { describe, it, expect } from "vitest";
import { createEmptyState, State } from "..";
import {
  diffTransform,
  diffMesh,
  diffMaterial,
} from "../selectors";

function withEntity(
  state: State,
  id: string,
  name = "ent",
): State {
  return {
    ...state,
    entities: { ...state.entities, [id]: { name } },
  };
}

function withTransform(
  state: State,
  id: string,
  t: {
    position?: [number, number, number];
    rotation?: [number, number, number];
    scale?: [number, number, number];
  },
): State {
  const prev = state.components.transform[id] ?? {
    position: [0, 0, 0] as [number, number, number],
    rotation: [0, 0, 0] as [number, number, number],
    scale: [1, 1, 1] as [number, number, number],
  };

  return {
    ...state,
    components: {
      ...state.components,
      transform: {
        ...state.components.transform,
        [id]: {
          position: t.position ?? prev.position,
          rotation: t.rotation ?? prev.rotation,
          scale: t.scale ?? prev.scale,
        },
      },
    },
  };
}

function withMesh(
  state: State,
  id: string,
  ref?: string,
): State {
  const mesh = {
    ...(state.components.mesh ?? {}),
  } as Record<string, string>;
  if (ref === undefined) delete mesh[id];
  else mesh[id] = ref;

  return {
    ...state,
    components: { ...state.components, mesh },
  };
}

function withMaterial(
  state: State,
  id: string,
  ref?: string,
): State {
  const material = {
    ...(state.components.material ?? {}),
  } as Record<string, string>;
  if (ref === undefined) delete material[id];
  else material[id] = ref;

  return {
    ...state,
    components: { ...state.components, material },
  };
}

describe("selectors components diff", () => {
  describe("transform", () => {
    it("동일 Transform이면 변경 아님", () => {
      const base = withEntity(
        createEmptyState(),
        "e1",
      );

      const state1 = withTransform(base, "e1", {
        position: [1, 2, 3],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
      });

      const state2 = withTransform(base, "e1", {
        position: [1, 2, 3],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
      });

      const changeSet = diffTransform(state1, state2);

      expect(changeSet.size).toBe(0);
    });

    it("position 등 하나라도 달라지면 포함", () => {
      const base = withEntity(
        createEmptyState(),
        "e1",
      );

      const state1 = withTransform(base, "e1", {
        position: [1, 2, 3],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
      });

      const state2 = withTransform(state1, "e1", {
        position: [9, 9, 9],
      });

      const changeSet = diffTransform(state1, state2);

      expect(changeSet.has("e1")).toBe(true);
    });

    it("Transform 추가/제거도 포함", () => {
      const state1 = withEntity(
        createEmptyState(),
        "e1",
      );

      const state2 = withTransform(state1, "e1", {
        position: [0, 0, 0],
      });

      expect(
        diffTransform(state1, state2).has("e1"),
      ).toBe(true);
    });
  });

  describe("mesh", () => {
    it("같은 ref면 변경 아님", () => {
      const state1 = withMesh(
        withEntity(createEmptyState(), "e1"),
        "e1",
        "m1",
      );

      const state2 = withMesh(
        withEntity(createEmptyState(), "e1"),
        "e1",
        "m1",
      );

      expect(diffMesh(state1, state2).size).toBe(0);
    });

    it("set/change/clear 모두 포함", () => {
      const base = withEntity(
        createEmptyState(),
        "e1",
      );

      const a = base;
      const b = withMesh(base, "e1", "m1"); // set
      expect(diffMesh(a, b).has("e1")).toBe(true);

      const c = withMesh(b, "e1", "m2"); // change
      expect(diffMesh(b, c).has("e1")).toBe(true);

      const d = withMesh(c, "e1", undefined); // clear
      expect(diffMesh(c, d).has("e1")).toBe(true);
    });
  });

  describe("material", () => {
    it("같은 ref면 변경 아님", () => {
      const state1 = withMaterial(
        withEntity(createEmptyState(), "e1"),
        "e1",
        "mat1",
      );

      const state2 = withMaterial(
        withEntity(createEmptyState(), "e1"),
        "e1",
        "mat1",
      );

      expect(diffMaterial(state1, state2).size).toBe(
        0,
      );
    });

    it("set/change/clear 모두 포함", () => {
      const base = withEntity(
        createEmptyState(),
        "e1",
      );
      const a = base;
      const b = withMaterial(base, "e1", "mat1");
      const c = withMaterial(b, "e1", "mat2");
      const d = withMaterial(c, "e1", undefined);

      expect(diffMaterial(a, b).has("e1")).toBe(true);
      expect(diffMaterial(b, c).has("e1")).toBe(true);
      expect(diffMaterial(c, d).has("e1")).toBe(true);
    });
  });
});
