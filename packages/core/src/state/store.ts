import { State } from "./types";

let current: State;

export function init(initial: State) {
  current = initial;
}

export function getState(): State {
  return current;
}
