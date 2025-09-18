import { EntityId } from "../../../common";
import { EntityNotFoundError } from "../../../common/errors";
import { State } from "../../../state";
import { Command } from "../../types";

type MaterialRef = string;

export class SetMaterialCommand
  implements Command
{
  readonly type = "Setmaterial";

  constructor(
    private id: EntityId,
    private materialRef: MaterialRef,
    private prevMaterial?: string,
  ) {}

  execute(state: State): State {
    if (!state.entities[this.id]) {
      throw new EntityNotFoundError(
        this.id,
      );
    }

    const prevMaterial =
      state.components.material?.[
        this.id
      ];

    const nextState: State = {
      ...state,
      components: {
        ...state.components,
        material: {
          ...(state.components
            .material ?? {}),
          [this.id]: this.materialRef,
        },
      },
    };

    this.prevMaterial = prevMaterial;

    return nextState;
  }

  undo(state: State): State {
    const material = {
      ...(state.components.material ??
        {}),
    };

    if (this.prevMaterial) {
      material[this.id] =
        this.prevMaterial;
    } else {
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
}
