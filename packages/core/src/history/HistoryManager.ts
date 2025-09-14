import { CompositeCommand } from "../command/CompositeCommand";
import { Command } from "../command/types";
import {
  State,
  validateState,
} from "../state";
import {
  rollbackTo,
  Snapshot,
  takeSnapshot,
} from "../state/snapshot";

type Entry = {
  label: string;
  command: Command;
};

type CollectCommand = (
  command: Command,
) => void;

type JumpOptions = {
  history?: "replace" | "preserve";
};

export class HistoryManager {
  private _undo: Entry[] = [];
  private _redo: Entry[] = [];
  private _state: State;

  private checkpoints: Map<
    string,
    Snapshot
  > = new Map();

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
    this._redo = []; // reset future
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

  createCheckpoint(
    id: string,
  ): Snapshot {
    const snap = takeSnapshot(
      this._state,
    );

    this.checkpoints.set(id, snap);

    return snap;
  }

  jumpToSnapshot(
    snapshot: Snapshot,
    opts: JumpOptions = {
      history: "replace",
    },
  ) {
    const next = rollbackTo(snapshot);
    validateState(next);

    this._state = next;

    if (opts.history === "replace") {
      this._undo = [];
      this._redo = [];
    }

    return this._state;
  }

  jumpToCheckpoint(
    id: string,
    opts?: JumpOptions,
  ): State {
    const snap =
      this.checkpoints.get(id);

    if (!snap) return this._state;

    return this.jumpToSnapshot(
      snap,
      opts,
    );
  }

  listCheckpoints(): string[] {
    return Array.from(
      this.checkpoints.keys(),
    );
  }

  removeCheckpoint(
    id: string,
  ): boolean {
    return this.checkpoints.delete(id);
  }

  clearCheckpoints(): void {
    this.checkpoints.clear();
  }
}
