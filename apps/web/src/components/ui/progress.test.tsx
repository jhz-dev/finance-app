import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Progress } from "./progress";

describe("Progress", () => {
  it("should render with the correct value", () => {
    render(<Progress value={50} />);
    const progressIndicator = screen.getByRole("progressbar");
    expect(progressIndicator).toBeInTheDocument();
    expect(progressIndicator).toHaveAttribute("aria-valuenow", "50");
  });
});
