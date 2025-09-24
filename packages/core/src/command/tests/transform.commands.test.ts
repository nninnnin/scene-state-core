import { expect, it } from "vitest";
import {
  createEmptyState,
  CURRENT_SCHEMA_VERSION,
  State,
} from "../../state";
import {
  applyCommand,
  undoCommand,
} from "../utils/executor";
import { SetTransformCommand } from "../commands/transform/SetTransformCommand";
import { EntityNotFoundError } from "../../common/errors";

it("SetTransformCommand updates transform and undo restores previous", () => {
  const initial: State = {
    version: CURRENT_SCHEMA_VERSION,
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

  const transformCommand = new SetTransformCommand(
    "E1",
    {
      position: [5, 5, 5],
    },
  );

  let state = applyCommand(initial, transformCommand);

  expect(state.components.transform["E1"]).toEqual({
    position: [5, 5, 5],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
  });

  state = undoCommand(state, transformCommand);

  expect(
    state.components.transform["E1"].position,
  ).toEqual([1, 2, 3]);
});

it("SetTransformCommand no-ops if entity does not exist", () => {
  const state = createEmptyState();

  const transformCommand = new SetTransformCommand(
    "ghost",
    {
      rotation: [100, 120, 200],
    },
  );

  expect(() =>
    applyCommand(state, transformCommand),
  ).toThrow(EntityNotFoundError);
});
