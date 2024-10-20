import { StrictMode } from "react";
import { SerialContextProvider } from "./libs/components/components";
import SerialComponent from "./libs/components/serial-component/serial-component";
import { createRoot } from "react-dom/client";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SerialContextProvider>
      <SerialComponent />
    </SerialContextProvider>
  </StrictMode>
);
