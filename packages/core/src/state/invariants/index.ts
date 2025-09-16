import { curry } from "es-toolkit";

import { State } from "../types";
import { registries } from "./registry";

export type InvariantMode =
  | "onupdate"
  | "onload";

export const assertInvariants = curry(
  function (
    mode: InvariantMode,
    state: State,
  ) {
    const registry = registries[mode];

    if (mode === "onload") {
      for (const checker of registry) {
        checker.onLoad &&
          checker.onLoad(state);
      }
    }

    if (mode === "onupdate") {
      // entities iteration
      for (const [
        entityId,
        entity,
      ] of Object.entries(
        state.entities,
      )) {
        for (const checker of registry) {
          checker.onEntityIteration &&
            checker.onEntityIteration(
              state,
              entityId,
              entity,
            );
        }
      }

      // transform iteration
      for (const [
        entityId,
        transform,
      ] of Object.entries(
        state.components.transform,
      )) {
        for (const checker of registry) {
          checker.onTransformIteration &&
            checker.onTransformIteration(
              state,
              entityId,
              transform,
            );
        }
      }
    }

    return state;
  },
);
