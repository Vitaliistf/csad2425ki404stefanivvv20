import React from "react";
import { describe, expect, it } from "vitest";
import { useSerialCommunication } from "../src/ui/libs/hooks/use-serial-communication.hook";
import { render } from "@testing-library/react";

describe("useSerialCommunication", () => {
  it("throws an error when used outside SerialContextProvider", () => {
    const TestComponent = () => {
      useSerialCommunication();
      return null;
    };

    expect(() => render(<TestComponent />)).toThrow(
      "useSerial must be used within a SerialProvider"
    );
  });
});
