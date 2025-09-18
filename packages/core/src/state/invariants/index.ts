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

    // mesh iteration
    for (const [
      entityId,
      mesh,
    ] of Object.entries(
      state.components.mesh ?? {},
    )) {
      for (const checker of registry) {
        checker.onMeshIteration &&
          checker.onMeshIteration(
            state,
            entityId,
            mesh,
          );
      }
    }

    // material iteration
    for (const [
      entityId,
      material,
    ] of Object.entries(
      state.components.material ?? {},
    )) {
      for (const checker of registry) {
        checker.onMaterialIteration &&
          checker.onMaterialIteration(
            state,
            entityId,
            material,
          );
      }
    }

    return state;
  },
);
