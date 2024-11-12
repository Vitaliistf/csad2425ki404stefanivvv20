import { useState, useCallback } from "react";
import { GameState } from "../types/types";

/**
 * @function useGameState
 * Custom hook for managing game state with an Observer pattern.
 * @param {GameState} initialState - Initial game state values.
 * @returns {Object} - An object containing the current state and an update function.
 */
export const useGameState = (initialState: GameState) => {
  const [state, setState] = useState<GameState>(initialState);

  const updateState = useCallback((newState: Partial<GameState>) => {
    setState((prev) => ({ ...prev, ...newState }));
  }, []);

  return { state, updateState };
};
