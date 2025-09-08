import { describe, it, expect } from "vitest";
import { ping } from "./index";

describe("@ssc/devtools", () => {
  it("ping returns version prefix", () => {
    expect(ping()).toContain("devtools-");
  });
});
