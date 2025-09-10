import {
  describe,
  expect,
  it,
} from "vitest";

import {
  addEntity,
  createEmptyState,
} from "../state";
import {
  DEFAULT_TRANSFORM,
  setTransform,
} from ".";
import { EntityNotFoundError } from "./errors";

describe("transform/setTransform", () => {
  it("존재하지 않는 엔티티는 예외 처리한다.", () => {
    const state = createEmptyState();

    expect(() =>
      setTransform(
        state,
        "ghost-entity-id",
        DEFAULT_TRANSFORM,
      ),
    ).toThrow(EntityNotFoundError);
  });

  it("존재하는 엔티티의 Transform 설정", () => {
    const defaultState =
      createEmptyState();

    const firstState = addEntity(
      defaultState,
      "e1",
      "Cube",
    );

    console.log(
      "first state: ",
      firstState,
    );

    const secondState = setTransform(
      firstState,
      "e1",
      {
        position: [1, 2, 3],
        rotation: [0, 0.5, 0],
        scale: [2, 2, 2],
      },
    );

    console.log(secondState);
  });
});
