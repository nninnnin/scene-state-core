import {
  State,
  validateState,
} from "../state";

import { Command } from "./types";

export interface ExecuteOptions {
  validate?: boolean;
}

export function applyCommand(
  state: State,
  command: Command,
  options: ExecuteOptions = {},
) {
  const next = command.execute(state);

  return (options.validate ?? true)
    ? validateState(next)
    : next;
}

export function undoCommand(
  state: State,
  command: Command,
  options: ExecuteOptions = {},
) {
  const next = command.undo(state);

  return (options.validate ?? true)
    ? validateState(next)
    : next;
}
