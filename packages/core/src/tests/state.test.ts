import { describe, it, expect } from "vitest";
import { addEntity, createEmptyState } from "../state";

describe("State basic", () => {
  it("createEmptyState gives an empty entities object", () => {
    const state = createEmptyState();

    expect(state.entities).toEqual({});
  });

  it("addEntity adds one entity immutably", () => {
    const state1 = createEmptyState();
    const state2 = addEntity(state1, "entity1", "First");

    expect(Object.keys(state2.entities).length).toBe(1);
    expect(state2.entities["entity1"]).toEqual({ name: "First" });
    expect(state1).not.toBe(state2);
  });
});
