import { useContext } from "react";
import { SerialContext, SerialContextType } from "../components/components";

const useSerialCommunication = (): SerialContextType => {
  const context = useContext(SerialContext);
  if (!context) {
    throw new Error("useSerial must be used within a SerialProvider");
  }
  return context;
};

export { useSerialCommunication };
