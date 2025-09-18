import { InvariantMode } from "./index";

import { duplicatedEntityName } from "./checkers/entity/duplicatedEntityName";

import { InvariantChecker } from "./checkers";
import { noOrphanTransform } from "./checkers/components/transform/noOrphanTransform";
import { noOrphanMesh } from "./checkers/components/mesh/noOrphanMesh";
import { noOrphanMaterial } from "./checkers/components/material/noOrphanMaterial";

export const registries: Record<
  InvariantMode,
  Array<InvariantChecker>
> = {
  onupdate: [
    duplicatedEntityName,
    noOrphanTransform,
    noOrphanMesh,
    noOrphanMaterial,
  ],
  onload: [
    duplicatedEntityName,
    noOrphanTransform,
    noOrphanMesh,
    noOrphanMaterial,
  ],
};
