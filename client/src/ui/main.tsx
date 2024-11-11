import { StrictMode } from "react";
import { SerialContextProvider } from "./libs/components/components";
import { RockPaperScissors } from "./libs/components/components";
import { createRoot } from "react-dom/client";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SerialContextProvider>
      <RockPaperScissors />
    </SerialContextProvider>
  </StrictMode>
);
