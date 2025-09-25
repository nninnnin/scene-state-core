import { describe, expect, it } from "vitest";
import {
  AddEntityCommand,
  createEmptyState,
} from "@ssc/core";
import {
  fireEvent,
  render,
  screen,
} from "@testing-library/react";

import { useHistory } from "./useHistory";
import { SceneStateProvider } from "../components/SceneStateProvider";
import { useSceneState } from "./useSceneState";

function AddEntityButton() {
  const { historyManager } = useHistory();

  const handleClick = () => {
    historyManager.execute(
      new AddEntityCommand("my-id", "Justin"),
    );
  };

  return (
    <button
      data-testid="add-entity-button"
      onClick={handleClick}
    >
      Add Entity Button
    </button>
  );
}

function UndoButton() {
  const { historyManager } = useHistory();

  const handleClick = () => {
    historyManager.undo();
  };

  return (
    <button
      data-testid="undo-button"
      onClick={handleClick}
    >
      Undo Button
    </button>
  );
}

function EntityCount() {
  const { sceneState } = useSceneState();

  return (
    <div data-testid="entity-count">
      {Object.keys(sceneState.entities).length}
    </div>
  );
}

describe("Tests for useHistory", () => {
  it("first", () => {
    render(
      <SceneStateProvider
        initialState={createEmptyState()}
      >
        <EntityCount />

        <AddEntityButton />
        <UndoButton />
      </SceneStateProvider>,
    );

    // Render check
    expect(
      screen.getByTestId("add-entity-button")
        .textContent,
    ).toBe("Add Entity Button");
    expect(
      screen.getByTestId("undo-button").textContent,
    ).toBe("Undo Button");

    expect(
      screen.getByTestId("entity-count").textContent,
    ).toBe("0");

    // Add entity
    fireEvent.click(
      screen.getByTestId("add-entity-button"),
    );

    // Check state update
    expect(
      screen.getByTestId("entity-count").textContent,
    ).toBe("1");

    // Undo
    fireEvent.click(screen.getByTestId("undo-button"));

    expect(
      screen.getByTestId("entity-count").textContent,
    ).toBe("0");
  });
});
