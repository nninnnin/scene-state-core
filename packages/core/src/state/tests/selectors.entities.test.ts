import { describe, it, expect } from "vitest";
import {
  createEmptyState,
  addEntity,
  removeEntity,
} from "..";
import { diffEntities } from "../selectors";

describe("selectors.diffEntities", () => {
  it("이름이 동일하면 변경으로 기록하지 않음", () => {
    const state1 = addEntity(
      createEmptyState(),
      "e1",
      "A",
    );

    const state2 = addEntity(
      createEmptyState(),
      "e1",
      "A",
    );

    const changeSet = diffEntities(state1, state2);

    expect(changeSet.size).toBe(0);
  });

  it("이름이 변경되면 changeSet에 기록", () => {
    const state1 = addEntity(
      createEmptyState(),
      "e1",
      "A",
    );

    const state2 = {
      ...state1,
      entities: {
        ...state1.entities,
        e1: { name: "B" }, // name of 'e1' is changed
      },
    };

    const changeSet = diffEntities(state1, state2);

    expect(changeSet.has("e1")).toBe(true);
  });

  it("엔티티가 추가되면 추가된 id 기록", () => {
    const state1 = createEmptyState();
    const state2 = addEntity(
      createEmptyState(),
      "e2",
      "X",
    );

    const changeSet = diffEntities(state1, state2);

    expect(changeSet.has("e2")).toBe(true);
  });

  it("엔티티가 제거되면 제거된 id 기록", () => {
    const state1 = addEntity(
      createEmptyState(),
      "e1",
      "A",
    );
    const state2 = removeEntity(state1, "e1");

    const changeSet = diffEntities(state1, state2);

    expect(changeSet.has("e1")).toBe(true);
  });
});
