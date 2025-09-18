import { EntityId } from "../common";
import type { State } from "../state/types";

export interface Command {
  readonly type: string;
  readonly description?: string;

  execute(state: State): State;
  undo(state: State): State;
}

export interface Transform {
  position: [number, number, number];
  rotation: [number, number, number]; // radians
  scale: [number, number, number];
}

export type MeshRef = string;
export type MaterialRef = string;

export type MeshRefMap = Record<
  EntityId,
  MeshRef
>;

export type MaterialRefMap = Record<
  EntityId,
  MaterialRef
>;
