import { describe, expect, it } from "vitest";
import {
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import {
  AddEntityCommand,
  createEmptyState,
} from "@ssc/core";

import useCommand from "./useCommand";
import { SceneStateProvider } from "../components/SceneStateProvider";
import { useSceneState } from "./useSceneState";

function TestButton() {
  const { dispatch } = useCommand();

  const handleClick = () =>
    dispatch(
      new AddEntityCommand("new-entity", "Justin"),
    );

  return (
    <button onClick={handleClick}>
      Create Entity
    </button>
  );
}

function EntityCounter() {
  const { sceneState } = useSceneState();

  return (
    <div data-testid="entity-count">
      {Object.keys(sceneState.entities).length}
    </div>
  );
}

describe("useCommand tests", () => {
  it("Dispatching command triggers state update", () => {
    render(
      <SceneStateProvider
        initialState={createEmptyState()}
      >
        <TestButton />
        <EntityCounter />
      </SceneStateProvider>,
    );

    const entityCountPrevious = screen.getByTestId(
      "entity-count",
    ).textContent;

    expect(entityCountPrevious).toBe("0");

    fireEvent.click(screen.getByText("Create Entity"));

    const entityCountNext = screen.getByTestId(
      "entity-count",
    ).textContent;

    expect(entityCountNext).toBe("1");
  });
});
