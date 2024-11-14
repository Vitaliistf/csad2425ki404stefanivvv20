import React from "react";
import { render, screen } from "@testing-library/react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../src/ui/libs/components/card/card";
import { describe, expect, it } from "vitest";
import "@testing-library/jest-dom";

describe("Card component", () => {
  it("renders the Card with its content", () => {
    render(
      <Card>
        <div>This is the card content</div>
      </Card>
    );
    expect(screen.getByText("This is the card content")).toBeInTheDocument();
  });

  it("applies additional custom classes to the Card", () => {
    render(<Card className="custom-class">Card Content</Card>);
    expect(screen.getByText("Card Content")).toHaveClass("custom-class");
  });

  it("renders the CardHeader component", () => {
    render(
      <Card>
        <CardHeader>Card Header</CardHeader>
        <CardContent>Card Content</CardContent>
      </Card>
    );
    expect(screen.getByText("Card Header")).toBeInTheDocument();
  });

  it("renders the CardTitle component", () => {
    render(
      <Card>
        <CardTitle>Card Title</CardTitle>
        <CardContent>Card Content</CardContent>
      </Card>
    );
    expect(screen.getByText("Card Title")).toBeInTheDocument();
  });

  it("renders the CardContent component", () => {
    render(
      <Card>
        <CardContent>Card Content</CardContent>
      </Card>
    );
    expect(screen.getByText("Card Content")).toBeInTheDocument();
  });

  it("applies additional custom classes to the CardHeader, CardTitle, and CardContent", () => {
    render(
      <Card>
        <CardHeader className="custom-header">Header</CardHeader>
        <CardTitle className="custom-title">Title</CardTitle>
        <CardContent className="custom-content">Content</CardContent>
      </Card>
    );
    expect(screen.getByText("Header")).toHaveClass("custom-header");
    expect(screen.getByText("Title")).toHaveClass("custom-title");
    expect(screen.getByText("Content")).toHaveClass("custom-content");
  });
});
