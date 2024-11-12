import { StrictMode } from "react";
import { SerialContextProvider } from "./libs/components/components";
import { RockPaperScissors } from "./libs/components/components";
import { createRoot } from "react-dom/client";

/**
 * @file main.tsx
 * Entry point for the Rock-Paper-Scissors game app, providing the SerialContext.
 */
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SerialContextProvider>
      <RockPaperScissors />
    </SerialContextProvider>
  </StrictMode>
);
