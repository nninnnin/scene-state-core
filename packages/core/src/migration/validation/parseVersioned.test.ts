import {
  describe,
  it,
  expect,
} from "vitest";
import { parseVersioned } from "./parseVersioned";

describe.only("parseVersioned behavior", () => {
  it("returns explicit version when input.version is set (2)", () => {
    const input = {
      version: 2,
      entities: {},
      components: { transform: {} },
    };
    const out = parseVersioned(input);
    expect(out.version).toBe(2);
  });

  it("returns explicit version when input.version is set (1)", () => {
    const input = {
      version: 1,
      entities: {},
      components: { transform: {} },
    };
    const out = parseVersioned(input);
    expect(out.version).toBe(1);
  });

  it("falls back to version 0 for empty object input", () => {
    const out = parseVersioned({});

    expect(out.version).toBe(0);
    expect(out.entities).toBeDefined();
    expect(
      out.components,
    ).toBeDefined();
    expect(
      out.components!.transform,
    ).toBeDefined();
  });

  it("falls back to version 0 for null/invalid input", () => {
    const out = parseVersioned(null);

    expect(out.version).toBe(0);
  });
});
