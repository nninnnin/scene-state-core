import {
  addEntity,
  removeEntity,
  State,
} from "../../state";
import { Command } from "../types";

export class AddEntityCommand
  implements Command
{
  readonly type = "AddEntity";
  readonly description?: string;

  constructor(
    private entityId: string,
    private name: string,
  ) {
    this.description = `Add entity(${entityId})`;
  }

  execute(state: State): State {
    return addEntity(
      state,
      this.entityId,
      this.name,
    );
  }

  undo(state: State) {
    return removeEntity(
      state,
      this.entityId,
    );
  }
}
