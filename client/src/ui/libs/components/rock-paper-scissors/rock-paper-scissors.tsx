import React, { useEffect, useState } from "react";
import { useSerialCommunication, useGameState } from "../../hooks/hooks";
import {
  Button,
  Select,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components";
import { GameMode, Move, SerialMessage, GameState } from "../../types/types";
import styles from "./styles.module.css";

const INITIAL_STATE: GameState = {
  player1Score: 0,
  player2Score: 0,
  gameMode: "hvh",
  lastMove1: "",
  lastMove2: "",
};

const MODE_OPTIONS = [
  { value: "hvh" as GameMode, label: "Human vs Human" },
  { value: "hvc" as GameMode, label: "Human vs Computer" },
  { value: "cvc" as GameMode, label: "Computer vs Computer" },
  { value: "cvcs" as GameMode, label: "Computer vs Computer (smart)" },
];

const MOVES: Move[] = ["rock", "paper", "scissors"];

const RockPaperScissors: React.FC = () => {
  const { connect, disconnect, sendMessage, receivedMessage, isConnected } =
    useSerialCommunication();
  const { state, updateState } = useGameState(INITIAL_STATE);
  const [moveHistory, setMoveHistory] = useState<string[]>([]);

  useEffect(() => {
    if (receivedMessage) {
      console.log(receivedMessage);
      try {
        const response = JSON.parse(receivedMessage);

        if (receivedMessage.includes("loaded")) {
          updateState(JSON.parse(localStorage.getItem("state") ?? ""));
          return;
        } else if (receivedMessage.includes("saved")) {
          localStorage.setItem("state", JSON.stringify(response));
          return;
        }
        updateState(response);
        if (response.move1 && response.move2) {
          setMoveHistory((prev) => [
            `Player 1: ${response.move1}, Player 2: ${response.move2}`,
            ...prev,
          ]);
        }
      } catch (e) {
        console.error("Failed to parse game response:", e);
      }
    }
  }, [receivedMessage, updateState]);

  const handleMove = (move: Move, isPlayer1: boolean) => {
    const message: SerialMessage = {
      command: "move",
      move,
      isPlayer1,
    };
    sendMessage(JSON.stringify(message));
  };

  const handleModeChange = (mode: GameMode) => {
    const message: SerialMessage = {
      command: "setMode",
      mode,
    };
    sendMessage(JSON.stringify(message));
    setMoveHistory([]);
  };

  const handleSaveGame = () => {
    const message: SerialMessage = {
      command: "save",
    };
    sendMessage(JSON.stringify(message));
  };

  const handleLoadGame = () => {
    const message: SerialMessage = {
      command: "load",
      state: JSON.parse(localStorage.getItem("state") ?? ""),
    };
    sendMessage(JSON.stringify(message));
  };

  const handleNextComputerMove = () => {
    const message: SerialMessage = {
      command: "move",
      isPlayer1: true,
    };
    sendMessage(JSON.stringify(message));
  };

  return (
    <Card className={styles.container}>
      <CardHeader>
        <CardTitle>Rock Paper Scissors Game</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={styles.controls}>
          <Button
            onClick={() => connect()}
            disabled={isConnected}
            variant="primary"
          >
            Connect
          </Button>
          <Button
            onClick={() => disconnect()}
            disabled={!isConnected}
            variant="danger"
          >
            Disconnect
          </Button>
        </div>

        <div className={styles.modeSelect}>
          <Select
            options={MODE_OPTIONS}
            value={state.gameMode}
            onChange={handleModeChange}
            disabled={!isConnected}
          />
        </div>

        <div className={styles.players}>
          <div className={styles.player}>
            <h3>Player 1</h3>
            <p className={styles.score}>{state.player1Score}</p>
            {state.gameMode !== "cvc" && state.gameMode !== "cvcs" && (
              <div className={styles.moves}>
                {MOVES.map((move) => (
                  <Button
                    key={move}
                    onClick={() => handleMove(move, true)}
                    disabled={!isConnected}
                    variant="secondary"
                  >
                    {move}
                  </Button>
                ))}
              </div>
            )}
          </div>

          <div className={styles.player}>
            <h3>Player 2</h3>
            <p className={styles.score}>{state.player2Score}</p>
            {state.gameMode === "hvh" && (
              <div className={styles.moves}>
                {MOVES.map((move) => (
                  <Button
                    key={move}
                    onClick={() => handleMove(move, false)}
                    disabled={!isConnected}
                    variant="secondary"
                  >
                    {move}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>

        {(state.gameMode === "cvc" || state.gameMode === "cvcs") && (
          <div className={styles.computerControls}>
            <Button onClick={handleNextComputerMove} disabled={!isConnected}>
              Next Computer Move
            </Button>
          </div>
        )}

        <div className={styles.gameActions}>
          <Button
            onClick={handleSaveGame}
            disabled={!isConnected}
            variant="primary"
          >
            Save Game
          </Button>
          <Button
            onClick={() => handleLoadGame()}
            disabled={!isConnected}
            variant="secondary"
          >
            Load Game
          </Button>
        </div>

        <div className={styles.moveHistory}>
          <h4>Move History</h4>
          <ul>
            {moveHistory.map((move, index) => (
              <li key={index}>{move}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export { RockPaperScissors };
