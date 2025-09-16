import {
  describe,
  expect,
  it,
} from "vitest";

import { createEmptyState } from "../types";
import {
  addEntity,
  removeEntity,
} from "../mutations";
import { setTransform } from "../../transform";
import { EntityNotFoundError } from "../../common/errors";
import { DuplicateEntityError } from "../errors";

describe("Invariants tests", () => {
  it("Transform은 반드시 존재하는 엔티티에만 연결", () => {
    const emptyState =
      createEmptyState();

    const entityAdded = addEntity(
      emptyState,
      "a",
      "Box",
    );

    expect(() =>
      setTransform(entityAdded, "b", {
        position: [0, 0, 0],
      }),
    ).toThrow(
      new EntityNotFoundError("b"),
    );
  });

  it("엔티티 삭제 시 고아 Transform을 남기지 않음", () => {
    const emptyState =
      createEmptyState();
    const boxAdded = addEntity(
      emptyState,
      "a",
      "Box",
    );
    const transformSet = setTransform(
      boxAdded,
      "a",
      { position: [0, 0, 0] },
    );
    const entityRemoved = removeEntity(
      transformSet,
      "a",
    );

    expect(
      Object.keys(
        entityRemoved.components
          .transform,
      ),
    ).toHaveLength(0);
  });

  it("엔티티 이름 중복 금지", () => {
    const emptyState =
      createEmptyState();

    const entityAdded = addEntity(
      emptyState,
      "a",
      "Box",
    );

    expect(() =>
      addEntity(
        entityAdded,
        "a",
        "Box",
      ),
    ).toThrow(DuplicateEntityError);
  });
});
