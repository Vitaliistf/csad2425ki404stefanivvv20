import React, { createContext, useState, useEffect } from "react";
import { SerialPort } from "serialport";

interface SerialContextType {
  connect: () => Promise<void>;
  disconnect: () => void;
  sendMessage: (message: string) => void;
  receivedMessage: string | null;
  isConnected: boolean;
}

const SerialContext = createContext<SerialContextType | undefined>(undefined);

const SerialContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [port, setPort] = useState<SerialPort | null>(null);
  const [writer, setWriter] = useState<WritableStreamDefaultWriter | null>(
    null
  );
  const [reader, setReader] = useState<ReadableStreamDefaultReader | null>(
    null
  );
  const [receivedMessage, setReceivedMessage] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  const connect = async () => {
    try {
      const selectedPort = await (
        navigator as unknown as { serial: any }
      ).serial.requestPort();
      await selectedPort.open({ baudRate: 9600 });
      setPort(selectedPort);
      setIsConnected(true);

      const textEncoder = new TextEncoderStream();
      textEncoder.readable.pipeTo(selectedPort.writable);
      setWriter(textEncoder.writable.getWriter());

      const textDecoder = new TextDecoderStream();
      selectedPort.readable.pipeTo(textDecoder.writable);
      const reader = textDecoder.readable.getReader();
      setReader(reader);
    } catch (error) {
      console.error("Failed to connect:", error);
    }
  };

  const disconnect = async () => {
    try {
      if (reader) {
        reader.releaseLock();
      }
      if (writer) {
        writer.releaseLock();
      }
      if (port) {
        port.close();
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsConnected(false);
    }
  };

  const sendMessage = async (message: string) => {
    if (writer) {
      await writer.write(message + "\n");
    } else {
      console.error("Writer is not available");
    }
  };

  useEffect(() => {
    if (!reader) return;

    const readLoop = async () => {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        if (value) setReceivedMessage(value);
      }
    };

    readLoop().catch((err) => console.error(err));

    return () => {
      reader.cancel();
    };
  }, [reader]);

  return (
    <SerialContext.Provider
      value={{ connect, disconnect, sendMessage, receivedMessage, isConnected }}
    >
      {children}
    </SerialContext.Provider>
  );
};

export { SerialContextProvider, type SerialContextType, SerialContext };
