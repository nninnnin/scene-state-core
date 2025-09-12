import { State } from "../types";
import { entityInvariants } from "./checkers/entity";
import { transformInvariants } from "./checkers/transform";

export type StateInvariant = (
  state: State,
) => void;

const registry = [
  ...entityInvariants,
  ...transformInvariants,
];

export function validateState(
  state: State,
) {
  for (const checker of registry) {
    checker(state);
  }

  return state;
}

export function registerInvariant(
  rule: StateInvariant,
) {
  registry.push(rule);
}
