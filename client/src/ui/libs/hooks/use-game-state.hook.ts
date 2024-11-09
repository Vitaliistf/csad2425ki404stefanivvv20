import { useState, useCallback } from "react";
import { GameState } from "../types/types";

// Паттерн Observer реалізований через хук
export const useGameState = (initialState: GameState) => {
  const [state, setState] = useState<GameState>(initialState);

  const updateState = useCallback((newState: Partial<GameState>) => {
    setState((prev) => ({ ...prev, ...newState }));
  }, []);

  return { state, updateState };
};
