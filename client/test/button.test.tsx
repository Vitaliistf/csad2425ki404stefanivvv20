import { render, screen } from "@testing-library/react";
import { Button } from "../src/ui/libs/components/button/button";
import { describe, expect, it } from "vitest";
import "@testing-library/jest-dom";
import React from "react";
import { vi } from "vitest";

describe("Button component", () => {
  it("renders the button with the correct text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeDefined();
  });

  it("applies additional custom classes", () => {
    render(<Button className="custom-class">Custom Button</Button>);
    expect(screen.getByRole("button")).toHaveClass("custom-class");
  });

  it("calls the onClick handler when clicked", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Clickable Button</Button>);
    screen.getByText("Clickable Button").click();
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it("passes through additional button props", () => {
    render(
      <Button type="submit" disabled>
        Disabled Submit Button
      </Button>
    );
    const button = screen.getByText("Disabled Submit Button");
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("type", "submit");
  });
});
