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
import { ClearMaterialCommand } from "../commands/material/ClearMaterialCommand";
import { SetMaterialCommand } from "../commands/material/SetMaterialCommand";

describe("", () => {
  it("Material commands mirror the same behavior", () => {
    let s = addEntity(
      createEmptyState(),
      "e1",
      "Sphere",
    );

    const set = new SetMaterialCommand(
      "e1",
      "mat:std#1",
    );

    const s1 = assertInvariants(
      "onupdate",
    )(set.execute(s));

    expect(
      s1.components.material?.e1,
    ).toBe("mat:std#1");

    const clear =
      new ClearMaterialCommand("e1");

    const s2 = assertInvariants(
      "onupdate",
    )(clear.execute(s1));

    expect(
      s2.components.material?.e1,
    ).toBeUndefined();

    const s3 = assertInvariants(
      "onupdate",
    )(clear.undo(s2)); // prev 없으니 no-op

    expect(
      s3.components.material?.e1,
    ).toBeUndefined();
  });
});
