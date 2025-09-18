import {
  describe,
  expect,
  it,
} from "vitest";
import {
  addEntity,
  assertInvariants,
  createEmptyState,
} from "../../state";
import { SetMeshCommand } from "../commands/mesh/SetMeshCommand";
import { ClearMeshCommand } from "../commands/mesh/ClearMeshCommand";
import { EntityNotFoundError } from "../../common/errors";

describe("mesh commands keep no-orphan invariants", () => {
  it("SetMeshRef → Undo", () => {
    let s = addEntity(
      createEmptyState(),
      "e1",
      "Cube",
    );

    const set = new SetMeshCommand(
      "e1",
      "mesh:cube01",
    );

    const s1 = assertInvariants(
      "onupdate",
    )(set.execute(s));

    expect(s1.components.mesh?.e1).toBe(
      "mesh:cube01",
    );

    const s2 = assertInvariants(
      "onupdate",
    )(set.undo(s1));

    expect(
      s2.components.mesh?.e1,
    ).toBeUndefined();
  });

  it("ClearMeshRef → Undo(no-op if prev none)", () => {
    let s = addEntity(
      createEmptyState(),
      "e1",
      "Cube",
    );

    const clear = new ClearMeshCommand(
      "e1",
    );

    const s1 = assertInvariants(
      "onupdate",
    )(clear.execute(s));

    const s2 = assertInvariants(
      "onupdate",
    )(clear.undo(s1));

    expect(
      s2.components.mesh?.e1,
    ).toBeUndefined();
  });

  it("ghost id throws", () => {
    const s = createEmptyState();

    expect(() =>
      new SetMeshCommand(
        "ghost",
        "mesh:x",
      ).execute(s),
    ).toThrow(EntityNotFoundError);
  });
});
