import { InvariantMode } from "./index";

import { duplicatedEntityName } from "./checkers/entity/duplicatedEntityName";

import {
  checkEntityShape,
  checkTransformShape,
} from "./checkers/scheme";

import { InvariantChecker } from "./checkers";
import { noOrphanTransform } from "./checkers/transform/noOrphanTransform";

export const registries: Record<
  InvariantMode,
  Array<InvariantChecker>
> = {
  onupdate: [
    duplicatedEntityName,
    noOrphanTransform,
    checkEntityShape, // TODO: replace as Zod's schema validation
    checkTransformShape, // TODO: replace as Zod's schema validation
  ],
  onload: [
    duplicatedEntityName,
    noOrphanTransform,
  ],
};
