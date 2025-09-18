import {
  describe,
  expect,
  it,
} from "vitest";

import {
  createEmptyState,
  CURRENT_SCHEMA_VERSION,
  State,
} from "../../state";
import { AddEntityCommand } from "../commands/entity/AddEntityCommand";
import {
  applyCommand,
  undoCommand,
} from "../executor";
import { RemoveEntityCommand } from "../commands/entity/RemoveEntityCommand";
import { SetTransformCommand } from "../commands/transform/SetTransformCommand";
import { EntityNotFoundError } from "../../common/errors";

describe("Command system", () => {
  it("AddEntityCommand adds a new entitiy and undo removes it", () => {
    let state = createEmptyState();

    const addCmd = new AddEntityCommand(
      "E1",
      "Cube",
    );

    state = applyCommand(state, addCmd);
    expect(
      state.entities["E1"],
    ).toEqual({ name: "Cube" });

    state = undoCommand(state, addCmd);
    expect(
      state.entities["E1"],
    ).toBeUndefined();
  });

  it("RemoveEntityCommand removes an entity and undo restores it with transform", () => {
    const initial: State = {
      version: CURRENT_SCHEMA_VERSION,
      entities: {
        E1: { name: "Sphere" },
      },
      components: {
        transform: {
          E1: {
            position: [1, 2, 3],
            rotation: [0, 0, 0],
            scale: [1, 1, 1],
          },
        },
      },
    };

    const removeCommand =
      new RemoveEntityCommand("E1");

    let state = applyCommand(
      initial,
      removeCommand,
    );

    expect(
      state.entities["E1"],
    ).toBeUndefined();
    expect(
      state.components.transform["E1"],
    ).toBeUndefined();

    state = undoCommand(
      state,
      removeCommand,
    );

    expect(
      state.entities["E1"],
    ).toEqual({ name: "Sphere" });
    expect(
      state.components.transform["E1"],
    ).toEqual({
      position: [1, 2, 3],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
    });
  });

  it("RemoveEntityCommand no-ops if entity does not exist", () => {
    const state = createEmptyState();
    const removeCmd =
      new RemoveEntityCommand("E404");

    const next = applyCommand(
      state,
      removeCmd,
    );
    expect(next).toEqual(state);
  });
});
