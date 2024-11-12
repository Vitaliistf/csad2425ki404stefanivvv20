/**
 * @typedef GameMode
 * Enum for game modes: Human vs Human, Human vs Computer, etc.
 */
export type GameMode = "hvh" | "hvc" | "cvc" | "cvcs";

/**
 * @typedef Move
 * Enum for player moves in the game: Rock, Paper, Scissors.
 */
export type Move = "rock" | "paper" | "scissors";

/**
 * @interface GameState
 * Represents the state of the game.
 * @property player1Score - Score of player 1.
 * @property player2Score - Score of player 2.
 * @property gameMode - Current game mode.
 * @property lastMove1 - Last move made by player 1.
 * @property lastMove2 - Last move made by player 2.
 */
export interface GameState {
  player1Score: number;
  player2Score: number;
  gameMode: GameMode;
  lastMove1: Move | "";
  lastMove2: Move | "";
}

/**
 * @interface SerialMessage
 * Interface for messages sent to/from the serial device.
 * @property command - Command type, e.g., move, setMode, save, load.
 * @property move - Optional move data if command is "move".
 * @property isPlayer1 - Optional boolean for player 1.
 * @property mode - Optional mode data if command is "setMode".
 * @property state - Optional game state for load/save.
 */
export interface SerialMessage {
  command: "move" | "setMode" | "save" | "load";
  move?: Move;
  isPlayer1?: boolean;
  mode?: GameMode;
  state?: GameState;
}
