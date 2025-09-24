import { State } from "../../state";
import { Command } from "../types";

export class CompositeCommand implements Command {
  readonly type = "composite";
  readonly label: string;
  private readonly commands: Command[];

  constructor(commands: Command[]) {
    this.label = "composite";
    this.commands = commands;
  }

  execute(state: State): State {
    let next = state;

    // sweep
    for (const cmd of this.commands) {
      next = cmd.execute(next);
    }

    return next;
  }

  undo(state: State): State {
    let next = state;

    // reverse sweep
    for (
      let i = this.commands.length - 1;
      i >= 0;
      i--
    ) {
      next = this.commands[i].undo(next);
    }

    return next;
  }

  isEmpty(): boolean {
    return this.commands.length === 0;
  }
}
