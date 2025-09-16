import {
  addEntity,
  removeEntity,
  State,
} from "../../state";
import { setTransform } from "../../transform";

import {
  Command,
  Transform,
} from "../types";

export class RemoveEntityCommand
  implements Command
{
  readonly type = "RemoveEntity";
  private prevName?: string;
  private prevTransform?: Transform;

  constructor(
    private entityId: string,
  ) {}

  execute(state: State): State {
    const entity =
      state.entities[this.entityId];

    this.prevName = entity?.name;
    this.prevTransform =
      state.components.transform[
        this.entityId
      ];

    return removeEntity(
      state,
      this.entityId,
    );
  }

  undo(state: State) {
    if (this.prevName == null)
      return state;

    let next = addEntity(
      state,
      this.entityId,
      this.prevName,
    );

    if (this.prevTransform) {
      next = setTransform(
        next,
        this.entityId,
        this.prevTransform,
      );
    }

    return next;
  }
}
