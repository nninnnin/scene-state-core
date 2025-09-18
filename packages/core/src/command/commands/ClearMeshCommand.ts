import { EntityId } from "../../common";
import { EntityNotFoundError } from "../../common/errors";
import { State } from "../../state";

import { Command } from "../types";

export class ClearMeshCommand
  implements Command
{
  type = "ClearMesh";

  private prevMesh?: string;
  constructor(private id: EntityId) {}

  execute(state: State): State {
    if (!state.entities[this.id])
      throw new EntityNotFoundError(
        this.id,
      );

    const mesh = {
      ...(state.components.mesh ?? {}),
    };

    this.prevMesh = mesh[this.id];

    if (mesh[this.id] !== undefined) {
      delete mesh[this.id];
    }

    return {
      ...state,
      components: {
        ...state.components,
        mesh,
      },
    };
  }

  undo(state: State): State {
    const mesh = {
      ...(state.components.mesh ?? {}),
    };

    if (this.prevMesh) {
      mesh[this.id] = this.prevMesh;
    }

    return {
      ...state,
      components: {
        ...state.components,
        mesh,
      },
    };
  }
}
