import React from "react";
import { render, screen } from "@testing-library/react";
import { SerialContextProvider } from "../src/ui/libs/components/components";
import { useSerialCommunication } from "../src/ui/libs/hooks/use-serial-communication.hook";
import { describe, expect, it } from "vitest";

describe("SerialContextProvider", () => {
  it("provides SerialContext to children", () => {
    const TestComponent = () => {
      const context = useSerialCommunication();
      return <div>{context ? "Context provided" : "No context"}</div>;
    };

    render(
      <SerialContextProvider>
        <TestComponent />
      </SerialContextProvider>
    );

    expect(screen.getByText("Context provided")).toBeDefined();
  });
});
