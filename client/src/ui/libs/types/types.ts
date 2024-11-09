export type GameMode = "hvh" | "hvc" | "cvc" | "cvcs";
export type Move = "rock" | "paper" | "scissors";

export interface GameState {
  player1Score: number;
  player2Score: number;
  gameMode: GameMode;
  lastMove1: Move | "";
  lastMove2: Move | "";
}

export interface SerialMessage {
  command: "move" | "setMode" | "save" | "load";
  move?: Move;
  isPlayer1?: boolean;
  mode?: GameMode;
  state?: GameState;
}
