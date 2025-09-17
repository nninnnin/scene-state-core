import { InvariantMode } from "./index";

import { duplicatedEntityName } from "./checkers/entity/duplicatedEntityName";

import { InvariantChecker } from "./checkers";
import { noOrphanTransform } from "./checkers/transform/noOrphanTransform";

export const registries: Record<
  InvariantMode,
  Array<InvariantChecker>
> = {
  onupdate: [
    duplicatedEntityName,
    noOrphanTransform,
  ],
  onload: [
    duplicatedEntityName,
    noOrphanTransform,
  ],
};
