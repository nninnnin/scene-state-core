import { Command } from "../types";
import { CompositeCommand } from "../commands/CompositeCommand";

export function group(
  commands: Command[],
): CompositeCommand {
  return new CompositeCommand(commands);
}
