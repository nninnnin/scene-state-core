import { describe, it, expect } from "vitest";
import {
  createEmptyState,
  addEntity,
  State,
} from "..";
import {
  changedEntity,
  changedAny,
  diffEntities,
} from "../selectors";

describe("selectors predicates", () => {
  it("changedEntity: 해당 id만 true", () => {
    const state1 = addEntity(
      createEmptyState(),
      "a",
      "A",
    );
    const state2: State = {
      ...state1,
      entities: {
        ...state1.entities,
        a: { name: "B" },
      },
    };

    const changeSet = diffEntities(state1, state2);

    expect(changedEntity("a", changeSet)).toBe(true);
    expect(changedEntity("x", changeSet)).toBe(false);
  });

  it("changedAny: 하나라도 포함되면 true", () => {
    const state1 = addEntity(
      createEmptyState(),
      "a",
      "A",
    );

    const state2: State = {
      ...state1,
      entities: {
        ...state1.entities,
        a: { name: "B" },
      },
    };

    const changeSet = diffEntities(state1, state2);

    console.log(changeSet);

    expect(
      changedAny(["x", "a", "y"], changeSet),
    ).toBe(true);

    expect(changedAny(["x", "y"], changeSet)).toBe(
      false,
    );
  });
});
