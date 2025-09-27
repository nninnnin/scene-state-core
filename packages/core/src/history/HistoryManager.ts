import { isEqual } from "es-toolkit";

import { CompositeCommand } from "../command/commands/CompositeCommand";
import { Command } from "../command/types";
import { migrateState } from "../migration/apply";
import {
  State,
  Store,
  assertInvariants,
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

type CollectCommand = (command: Command) => void;

type JumpOptions = {
  history?: "replace" | "preserve";
};

export class HistoryManager {
  private undoStack: Entry[] = [];
  private redoStack: Entry[] = [];
  private store: Store;

  private checkpoints: Map<string, Snapshot> =
    new Map();

  constructor(store: Store) {
    this.store = store;
  }

  get state(): State {
    return this.store.state;
  }

  get stacks() {
    const mapEntryLabel = (entries: Entry[]) =>
      entries.map((entry) => entry.label);

    return {
      undoStack: mapEntryLabel(this.undoStack),
      redoStack: mapEntryLabel(this.redoStack),
    };
  }

  group<T>(
    label: string,
    collector: (collectCommand: CollectCommand) => T,
  ): T {
    const bucket: Array<Command> = [];
    const snapshot = this.store.state;

    let result: T;

    try {
      result = collector((c: Command) =>
        bucket.push(c),
      );

      if (bucket.length === 0) return result;

      const composite = new CompositeCommand(bucket);
      const executed = composite.execute(snapshot);

      if (executed === snapshot) return result; // no-op

      this.undoStack.push({
        label,
        command: composite,
      });
      this.redoStack = [];
      this.store.update(executed);

      return result;
    } catch (error) {
      this.store.update(snapshot); // rollback

      throw error;
    }
  }

  execute(command: Command): void {
    const prev = this.store.state;
    const next = command.execute(prev);

    if (isEqual(prev, next)) {
      return;
    }

    this.undoStack.push({
      label: command.type,
      command,
    });
    this.redoStack = [];
    this.store.update(next);
  }

  undo(): void {
    const entry = this.undoStack.pop();

    if (!entry) {
      console.log("Has no undo stack");
      return;
    }

    const prev = this.store.state;
    const next = entry.command.undo(prev);

    this.redoStack.push(entry);
    this.store.update(next);
  }

  redo(): void {
    const entry = this.redoStack.pop();

    if (!entry) {
      console.log("Has no redo stack");
      return;
    }

    const prev = this.store.state;
    const next = entry.command.execute(prev);

    this.undoStack.push(entry);
    this.store.update(next);
  }

  clear() {
    this.undoStack = [];
    this.redoStack = [];
  }

  createCheckpoint(id: string): Snapshot {
    const snapshot = takeSnapshot(this.store.state);

    this.checkpoints.set(id, snapshot);

    return snapshot;
  }

  jumpToSnapshot(
    snapshot: Snapshot,
    opts: JumpOptions = {
      history: "replace",
    },
  ) {
    const restored = rollbackTo(snapshot);
    const migrated = migrateState(restored);

    const validated =
      assertInvariants("onload")(migrated);

    this.store.update(validated);

    if (opts.history === "replace") {
      this.undoStack = [];
      this.redoStack = [];
    }

    return this.store.state;
  }

  jumpToCheckpoint(
    id: string,
    opts?: JumpOptions,
  ): State {
    const snap = this.checkpoints.get(id);

    if (!snap) return this.store.state;

    return this.jumpToSnapshot(snap, opts);
  }

  listCheckpoints(): string[] {
    return Array.from(this.checkpoints.keys());
  }

  removeCheckpoint(id: string): boolean {
    return this.checkpoints.delete(id);
  }

  clearCheckpoints(): void {
    this.checkpoints.clear();
  }
}
