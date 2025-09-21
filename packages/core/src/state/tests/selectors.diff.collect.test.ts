import { describe, it, expect } from "vitest";
import { createEmptyState, State } from "..";
import { diff, collectChanges } from "../selectors";

function withEntity(state: State, id: string, name = "ent"): State {
  return { ...state, entities: { ...state.entities, [id]: { name } } };
}

function withTransform(
  state: State,
  id: string,
  t: { position?: [number, number, number]; rotation?: [number, number, number]; scale?: [number, number, number] },
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

describe("selectors diff & collectChanges", () => {
  it("diff: 서로 다른 컴포넌트 변경은 합집합으로 수집", () => {
    const base = withEntity(createEmptyState(), "e1");
    const state1 = base;
    const state2 = withTransform(base, "e1", { position: [1, 0, 0] });
    const all = diff(state1, state2);
    expect(all.size).toBe(1);
    expect(all.has("e1")).toBe(true);
  });

  it("collectChanges: 분리된 집합과 all 일관성", () => {
    const base = withEntity(createEmptyState(), "e1");
    const state1 = base;
    const state2 = { ...base, entities: { ...base.entities, e1: { name: "B" } } };
    const c = collectChanges(state1, state2);
    expect(c.entities.has("e1")).toBe(true);
    expect(c.transform.size).toBe(0);
    expect(c.all.has("e1")).toBe(true);
  });
});

