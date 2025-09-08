import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { useExample } from "./index";

function Probe() {
  return <div data-testid="val">{useExample()}</div>;
}

describe("@ssc/react", () => {
  it("", () => {
    render(<Probe />);
    expect(screen.getByTestId("val").textContent).toContain("react-");
  });
});
