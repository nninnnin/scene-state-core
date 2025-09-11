import { State } from "../types";
import { entityInvariants } from "./entity";
import { transformInvariants } from "./transform";

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
  for (const validator of registry) {
    validator(state);
  }
}

export function registerInvariant(
  rule: StateInvariant,
) {
  registry.push(rule);
}
