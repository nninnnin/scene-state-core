import { EntityId } from "../../../common";
import { EntityNotFoundError } from "../../../common/errors";
import { State } from "../../../state";

import { Command } from "../../types";

export class ClearMaterialCommand
  implements Command
{
  type = "ClearMaterial";

  private prevMaterial?: string;
  constructor(private id: EntityId) {}

  execute(state: State): State {
    if (!state.entities[this.id])
      throw new EntityNotFoundError(
        this.id,
      );

    const material = {
      ...(state.components.material ??
        {}),
    };

    this.prevMaterial =
      material[this.id];

    if (
      material[this.id] !== undefined
    ) {
      delete material[this.id];
    }

    return {
      ...state,
      components: {
        ...state.components,
        material,
      },
    };
  }

  undo(state: State): State {
    const material = {
      ...(state.components.material ??
        {}),
    };

    if (this.prevMaterial) {
      material[this.id] =
        this.prevMaterial;
    }

    return {
      ...state,
      components: {
        ...state.components,
        material,
      },
    };
  }
}
