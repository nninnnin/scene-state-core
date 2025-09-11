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
import { EntityNotFoundError } from "../common/errors";

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

    const secondState = setTransform(
      firstState,
      "e1",
      {
        position: [1, 2, 3],
        rotation: [0, 0.5, 0],
        scale: [2, 2, 2],
      },
    );

    expect(
      secondState.components.transform[
        "e1"
      ],
    ).toEqual({
      position: [1, 2, 3],
      rotation: [0, 0.5, 0],
      scale: [2, 2, 2],
    });

    // immutability checks
    // 1) reference of whole state is changed
    expect(secondState).not.toBe(
      firstState,
    );

    // 2) reference of components is changed
    expect(
      secondState.components,
    ).not.toBe(firstState.components);

    // 3) reference of transform component is changed
    expect(
      secondState.components.transform,
    ).not.toBe(
      firstState.components.transform,
    );
  });
});
