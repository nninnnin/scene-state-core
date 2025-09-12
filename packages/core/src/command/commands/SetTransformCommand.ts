import { Transform } from "../../transform/types";
import { State } from "../../state";
import { Command } from "../types";
import { setTransform } from "../../transform";

export class SetTransformCommand
  implements Command
{
  readonly type = "SetTransform";
  private prev?: Transform;

  constructor(
    private entityId: string,
    private patch: Partial<Transform>,
  ) {}

  execute(state: State): State {
    this.prev =
      state.components.transform[
        this.entityId
      ];

    return setTransform(
      state,
      this.entityId,
      this.patch,
    );
  }

  undo(state: State): State {
    if (this.prev) {
      return setTransform(
        state,
        this.entityId,
        this.prev,
      );
    }

    return state;
  }
}
