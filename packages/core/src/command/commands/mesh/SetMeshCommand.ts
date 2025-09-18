import { EntityId } from "../../../common";
import { EntityNotFoundError } from "../../../common/errors";
import { State } from "../../../state";
import { Command } from "../../types";

type MeshRef = string;

export class SetMeshCommand
  implements Command
{
  readonly type = "SetMesh";

  constructor(
    private id: EntityId,
    private meshRef: MeshRef,
    private prevMesh?: string,
  ) {}

  execute(state: State): State {
    if (!state.entities[this.id]) {
      throw new EntityNotFoundError(
        this.id,
      );
    }

    const prevMesh =
      state.components.mesh?.[this.id];

    const nextState: State = {
      ...state,
      components: {
        ...state.components,
        mesh: {
          ...(state.components.mesh ??
            {}),
          [this.id]: this.meshRef,
        },
      },
    };

    this.prevMesh = prevMesh;

    return nextState;
  }

  undo(state: State): State {
    const mesh = {
      ...(state.components.mesh ?? {}),
    };

    if (this.prevMesh) {
      mesh[this.id] = this.prevMesh;
    } else {
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
}
