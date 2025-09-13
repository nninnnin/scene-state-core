import { CompositeCommand } from "../command/CompositeCommand";
import { Command } from "../command/types";
import { State } from "../state";

type Entry = {
  label: string;
  command: Command;
};

type CollectCommand = (
  command: Command,
) => void;

export class HistoryManager {
  private _undo: Entry[] = [];
  private _redo: Entry[] = [];
  private _state: State;

  constructor(initial: State) {
    this._state = initial;
  }

  get state(): State {
    return this._state;
  }

  get stacks() {
    const mapEntryLabel = (
      entries: Entry[],
    ) =>
      entries.map(
        (entry) => entry.label,
      );

    return {
      undo: mapEntryLabel(this._undo),
      redo: mapEntryLabel(this._redo),
    };
  }

  group<T>(
    label: string,
    collector: (
      collectCommand: CollectCommand,
    ) => T,
  ): T {
    const bucket: Array<Command> = [];
    const snapshot = this._state;

    let result: T;

    try {
      result = collector((c: Command) =>
        bucket.push(c),
      );

      if (bucket.length === 0)
        return result;

      const composite =
        new CompositeCommand(bucket);
      const executed =
        composite.execute(snapshot);

      if (executed === snapshot)
        return result; // no-op

      this._undo.push({
        label,
        command: composite,
      });
      this._redo = [];
      this._state = executed;

      return result;
    } catch (error) {
      this._state = snapshot; // rollback

      throw error;
    }
  }

  execute(
    label: string,
    command: Command,
  ): void {
    const prev = this._state;
    const next = command.execute(prev);

    if (next === prev) {
      // no-op이면 기록 생략
      this._redo = [];
      return;
    }

    this._undo.push({ label, command });
    this._redo = [];
    this._state = next;
  }

  undo(): void {
    const entry = this._undo.pop();

    if (!entry) return;

    const next = entry.command.undo(
      this._state,
    );

    this._redo.push(entry);
    this._state = next;
  }

  redo() {
    const entry = this._redo.pop();

    if (!entry) return;

    const next = entry.command.execute(
      this._state,
    );

    this._undo.push(entry);
    this._state = next;
  }

  clear() {
    this._undo = [];
    this._redo = [];
  }
}
