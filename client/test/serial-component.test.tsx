import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { SerialComponent } from "../src/ui/libs/components/serial-component/serial-component";
import { vi } from "vitest";
import { describe, it, expect, beforeEach } from "vitest";
import { useSerialCommunication } from "../src/ui/libs/hooks/hooks";

// Mock the custom hook
vi.mock("../src/ui/libs/hooks/use-serial-communication.hook.ts", () => ({
  useSerialCommunication: vi.fn(),
}));

describe("SerialComponent", () => {
  const mockConnect = vi.fn();
  const mockDisconnect = vi.fn();
  const mockSendMessage = vi.fn();

  beforeEach(() => {
    (useSerialCommunication as jest.Mock).mockReturnValue({
      connect: mockConnect,
      disconnect: mockDisconnect,
      sendMessage: mockSendMessage,
      receivedMessage: null,
      isConnected: false,
    });
  });

  it("renders correctly", () => {
    render(<SerialComponent />);
    expect(screen.getByText("Serial Communication")).toBeDefined();
    expect(screen.getByText("Connect")).toBeDefined();
    expect(screen.getByText("Disconnect")).toBeDefined();
    expect(screen.getByPlaceholderText("Type your message")).toBeDefined();
    expect(screen.getByText("Send")).toBeDefined();
    expect(screen.getByText("Received Message:")).toBeDefined();
    expect(screen.getByText("No messages yet")).toBeDefined();
  });

  it("handles connect button click", () => {
    render(<SerialComponent />);
    const connectButton = screen.getByText("Connect");
    fireEvent.click(connectButton);
    expect(mockConnect).toHaveBeenCalled();
  });

  it("handles disconnect button click", () => {
    (useSerialCommunication as jest.Mock).mockReturnValue({
      ...useSerialCommunication(),
      isConnected: true,
    });
    render(<SerialComponent />);
    const disconnectButton = screen.getByText("Disconnect");
    fireEvent.click(disconnectButton);
    expect(mockDisconnect).toHaveBeenCalled();
  });

  it("handles message input and send", () => {
    (useSerialCommunication as jest.Mock).mockReturnValue({
      ...useSerialCommunication(),
      isConnected: true,
    });
    render(<SerialComponent />);
    const input = screen.getByPlaceholderText("Type your message");
    const sendButton = screen.getByText("Send");

    fireEvent.change(input, { target: { value: "Test message" } });
    fireEvent.click(sendButton);

    expect(mockSendMessage).toHaveBeenCalledWith("Test message");
    expect(input).toHaveValue("");
  });

  it("disables buttons and input when not connected", () => {
    render(<SerialComponent />);
    expect(screen.getByText("Connect")).not.toBeDisabled();
    expect(screen.getByText("Disconnect")).toBeDisabled();
    expect(screen.getByPlaceholderText("Type your message")).toBeDisabled();
    expect(screen.getByText("Send")).toBeDisabled();
  });

  it("displays received message", () => {
    (useSerialCommunication as jest.Mock).mockReturnValue({
      ...useSerialCommunication(),
      receivedMessage: "Received test message",
    });
    render(<SerialComponent />);
    expect(screen.getByText("Received test message")).toBeDefined();
  });
});
