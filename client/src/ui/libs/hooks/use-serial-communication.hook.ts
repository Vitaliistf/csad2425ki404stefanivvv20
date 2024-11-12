import { useContext } from "react";
import { SerialContext, SerialContextType } from "../components/components";

/**
 * @function useSerialCommunication
 * Hook for accessing SerialContext, ensuring it is used within a SerialProvider.
 * @returns {SerialContextType} The serial communication context object.
 * @throws Will throw an error if used outside a SerialProvider.
 */
const useSerialCommunication = (): SerialContextType => {
  const context = useContext(SerialContext);
  if (!context) {
    throw new Error("useSerial must be used within a SerialProvider");
  }
  return context;
};

export { useSerialCommunication };
