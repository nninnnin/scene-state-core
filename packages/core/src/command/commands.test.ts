import {
  describe,
  expect,
  it,
} from "vitest";

import {
  createEmptyState,
  State,
} from "../state";
import { AddEntityCommand } from "./commands/AddEntityCommand";
import {
  applyCommand,
  undoCommand,
} from "./executor";
import { RemoveEntityCommand } from "./commands/RemoveEntityCommand";
import { SetTransformCommand } from "./commands/SetTransformCommand";
import { EntityNotFoundError } from "../common/errors";

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

  it("SetTransformCommand updates transform and undo restores previous", () => {
    const initial: State = {
      entities: {
        E1: { name: "Cube" },
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

    const transformCommand =
      new SetTransformCommand("E1", {
        position: [5, 5, 5],
      });

    let state = applyCommand(
      initial,
      transformCommand,
    );

    expect(
      state.components.transform["E1"],
    ).toEqual({
      position: [5, 5, 5],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
    });

    state = undoCommand(
      state,
      transformCommand,
    );

    expect(
      state.components.transform["E1"]
        .position,
    ).toEqual([1, 2, 3]);
  });

  it("SetTransformCommand no-ops if entity does not exist", () => {
    const state = createEmptyState();

    const transformCommand =
      new SetTransformCommand("ghost", {
        rotation: [100, 120, 200],
      });

    expect(() =>
      applyCommand(
        state,
        transformCommand,
      ),
    ).toThrow(EntityNotFoundError);
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
