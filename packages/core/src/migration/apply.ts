import {
  CURRENT_SCHEMA_VERSION,
  State,
  validateState,
} from "../state";
import { MIGRATIONS } from "./registry";

export function migrateState(
  input: State,
) {
  let newState = {
    ...input,
    version: input.version ?? 0,
  };

  let progressed = true;

  while (
    newState.version !==
      CURRENT_SCHEMA_VERSION &&
    progressed
  ) {
    progressed = false;

    for (const m of MIGRATIONS) {
      if (m.from === newState.version) {
        newState = m.apply(newState);
        progressed = true;

        break;
      }
    }
  }

  return validateState(input);
}
