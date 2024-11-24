import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Select } from "../src/ui/libs/components/select/select";
import { describe, expect, it } from "vitest";
import "@testing-library/jest-dom";
import { vi } from "vitest";

describe("Select component", () => {
  it("renders the Select with provided options", () => {
    const options = [
      { value: "option1", label: "Option 1" },
      { value: "option2", label: "Option 2" },
      { value: "option3", label: "Option 3" },
    ];
    render(<Select options={options} onChange={() => {}} value="option1" />);

    options.forEach((option) => {
      expect(screen.getByText(option.label)).toBeInTheDocument();
    });
  });

  it("calls the onChange callback with the selected value", () => {
    const options = [
      { value: "option1", label: "Option 1" },
      { value: "option2", label: "Option 2" },
      { value: "option3", label: "Option 3" },
    ];
    const onChange = vi.fn();
    render(<Select options={options} onChange={onChange} value="option1" />);

    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "option2" },
    });
    expect(onChange).toHaveBeenCalledWith("option2");
  });

  it("applies additional custom classes to the Select", () => {
    render(
      <Select
        options={[
          { value: "option1", label: "Option 1" },
          { value: "option2", label: "Option 2" },
        ]}
        onChange={() => {}}
        value="option1"
        className="custom-class"
      />
    );
    expect(screen.getByRole("combobox")).toHaveClass("custom-class");
  });

  it("renders the Select as disabled when the disabled prop is true", () => {
    render(
      <Select
        options={[
          { value: "option1", label: "Option 1" },
          { value: "option2", label: "Option 2" },
        ]}
        onChange={() => {}}
        value="option1"
        disabled
      />
    );
    expect(screen.getByRole("combobox")).toBeDisabled();
  });

  it("passes through additional select props", () => {
    render(
      <Select
        options={[
          { value: "option1", label: "Option 1" },
          { value: "option2", label: "Option 2" },
        ]}
        onChange={() => {}}
        value="option1"
        name="my-select"
        id="my-select"
      />
    );
    const selectElement = screen.getByRole("combobox");
    expect(selectElement).toHaveAttribute("name", "my-select");
    expect(selectElement).toHaveAttribute("id", "my-select");
  });
});
