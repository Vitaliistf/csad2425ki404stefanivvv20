/**
 * @file server.ino
 * @description Implements a Rock-Paper-Scissors game on Arduino, including game state management, strategies, and serial communication.
 * This program utilizes the State, Strategy, and Singleton design patterns to manage various aspects of the game.
 * It interacts with the user via serial commands, allowing game mode selection, score tracking, saving/loading game state, and move processing.
 * 
 * Dependencies:
 *  - ArduinoJson library for JSON parsing and serialization
 * 
 * Main Components:
 *  - GameState: Stores and manages the game's state (e.g., scores, game mode, last moves).
 *  - GameStrategy (and its derived classes): Defines strategies for computer moves, including Random and Smart strategies.
 *  - GameManager: Manages the game's main operations and serves as the Singleton controller for game state and logic.
 * 
 * Arduino Setup:
 *  - setup(): Initializes serial communication and sets up random seed generation.
 *  - loop(): Handles serial input and commands (move processing, mode setting, save/load operations).
 */
#include <ArduinoJson.h>

/**
 * @class GameState
 * @brief Manages the game state, including scores, game mode, and recent moves.
 */
class GameState {
  public:
    int player1Score = 0;
    int player2Score = 0;
    String gameMode = "hvh"; // hvh, hvc, cvc, cvcs
    String lastMove1 = "";
    String lastMove2 = "";
    String lastComputerMove = "";
};

/**
 * @class GameStrategy
 * @brief Defines a strategy interface for generating moves in different game modes.
 */
class GameStrategy {
  public:
    /**
     * Generates a move for the game.
     * @return A string representing the move ("rock", "paper", or "scissors").
     */
    virtual String makeMove() = 0;

    /**
     * Updates the strategy with the opponent's last move.
     * @param opponentMove The last move made by the opponent.
     */
    virtual void updateLastMove(String opponentMove) {}
};

/**
 * @class RandomStrategy
 * @brief Generates random moves for the computer.
 */
class RandomStrategy : public GameStrategy {
  public:
    /**
     * Generates a random move.
     * @return A randomly chosen move ("rock", "paper", or "scissors").
     */
    String makeMove() {
      String moves[] = {"rock", "paper", "scissors"};
      return moves[random(0, 3)];
    }
};

/**
 * @class SmartStrategy
 * @brief Adapts to the opponent's moves, increasing the chance of countering frequent moves.
 */
class SmartStrategy : public GameStrategy {
  private:
    String lastOpponentMove = "";
    int rockCount = 0;
    int paperCount = 0;
    int scissorsCount = 0;
    
  public:
    /**
     * Generates a move based on the opponent's previous moves.
     * @return A move intended to counter the opponent's likely next move.
     */
    String makeMove() {
      if (lastOpponentMove == "") {
        return RandomStrategy().makeMove();
      }
      
      int maxCount = max(max(rockCount, paperCount), scissorsCount);
      
      if (lastOpponentMove == "rock") {
        return "paper";
      } else if (lastOpponentMove == "paper") {
        return "scissors";
      } else {
        return "rock";
      }
    }
    
    /**
     * Updates internal counters based on the opponent's last move.
     * @param opponentMove The last move made by the opponent.
     */
    void updateLastMove(String opponentMove) override {
      lastOpponentMove = opponentMove;
      if (opponentMove == "rock") rockCount++;
      else if (opponentMove == "paper") paperCount++;
      else if (opponentMove == "scissors") scissorsCount++;
    }
};

/**
 * @class GameManager
 * @brief Manages the game logic, including score updates, move processing, and game mode setting.
 * Implements the Singleton pattern to ensure a single instance manages the game.
 */
class GameManager {
  private:
    static GameManager* instance;
    GameState state;
    GameStrategy* computerStrategy1;
    GameStrategy* computerStrategy2;
    
    GameManager() {
      computerStrategy1 = new RandomStrategy();
      computerStrategy2 = new SmartStrategy();
    }
    
  public:
    /**
     * Retrieves the Singleton instance of the GameManager.
     * @return A pointer to the GameManager instance.
     */
    static GameManager* getInstance() {
      if (!instance) {
        instance = new GameManager();
      }
      return instance;
    }
    
    /**
     * Processes a player's move, updates the game state, and generates a JSON response.
     * @param playerMove The move made by the player ("rock", "paper", or "scissors").
     * @param isPlayer1 Boolean indicating if the move is from player 1.
     * @return A JSON string representing the updated game state.
     */
    String processMove(String playerMove, bool isPlayer1) {
      StaticJsonDocument<200> doc;
      
      if (state.gameMode == "cvcs") {
        String move1 = computerStrategy1->makeMove();
        String move2 = computerStrategy2->makeMove();
        updateScore(move1, move2);
        
        computerStrategy2->updateLastMove(move1);
        
        doc["move1"] = move1;
        doc["move2"] = move2;
      } else if (state.gameMode == "cvc") {
        String move1 = computerStrategy1->makeMove();
        String move2 = computerStrategy1->makeMove();
        updateScore(move1, move2);
        
        doc["move1"] = move1;
        doc["move2"] = move2;
      } else if (state.gameMode == "hvc") {
        String computerMove = computerStrategy1->makeMove();
        updateScore(playerMove, computerMove);
        
        doc["move1"] = playerMove;
        doc["move2"] = computerMove;
      } else {
        if (isPlayer1) {
          state.lastMove1 = playerMove;
        } else {
          state.lastMove2 = playerMove;
          updateScore(state.lastMove1, state.lastMove2);
        }
        
        doc["move1"] = state.lastMove1;
        doc["move2"] = state.lastMove2;
      }
      
      doc["player1Score"] = state.player1Score;
      doc["player2Score"] = state.player2Score;
      doc["gameMode"] = state.gameMode;
      
      String output;
      serializeJson(doc, output);

      if (!isPlayer1) {
        state.lastMove1 = "";
        state.lastMove2 = "";
      }

      return output;
    }
    
    /**
     * Sets the game mode and resets the scores.
     * @param mode The game mode to set ("hvh", "hvc", "cvc", "cvcs").
     * @return A JSON string representing the game state with the new mode.
     */
    String setGameMode(String mode) {
      StaticJsonDocument<200> doc;
      state.gameMode = mode;
      resetScores();
      doc["player1Score"] = state.player1Score;
      doc["player2Score"] = state.player2Score;
      doc["gameMode"] = state.gameMode;

      String output;
      serializeJson(doc, output);
      return output;
    }
    
    /**
     * Resets player scores and clears the last moves.
     */
    void resetScores() {
      state.player1Score = 0;
      state.player2Score = 0;
      state.lastMove1 = "";
      state.lastMove2 = "";
      state.lastComputerMove = "";
    }
    
    /**
     * Saves the current game state and returns a JSON string confirming the save.
     * @return A JSON string with save confirmation and current game state details.
     */
    String saveGame() {
      StaticJsonDocument<200> doc;
      doc["status"] = "saved";
      doc["player1Score"] = state.player1Score;
      doc["player2Score"] = state.player2Score;
      doc["gameMode"] = state.gameMode;
      
      String output;
      serializeJson(doc, output);
      return output;
    }
    
    /**
     * Loads a saved game state from a JSON string.
     * @param savedState JSON string containing saved game state details.
     */
    void loadGame(String savedState) {
      StaticJsonDocument<200> doc;
      deserializeJson(doc, savedState);
      
      state.player1Score = doc["player1Score"];
      state.player2Score = doc["player2Score"];
      state.gameMode = doc["gameMode"].as<String>();
    }

    /**
     * Retrieves current game state (for testing purposes only).
     * @return game state.
     */
    GameState getGameState() {
      return state;
    }
    
  private:
    void updateScore(String move1, String move2) {
      if (move1 == move2) return;
      
      if ((move1 == "rock" && move2 == "scissors") ||
          (move1 == "paper" && move2 == "rock") ||
          (move1 == "scissors" && move2 == "paper")) {
        state.player1Score++;
      } else if (move1 != "") {
        state.player2Score++;
      }
    }
};

GameManager* GameManager::instance = nullptr;

// SETUP AND LOOP ARE COMMENTED OUT ONLY FOR TESTING PURPOSES

// /**
//  * Arduino setup function.
//  * Configures the serial connection and initializes random seed.
//  */
// void setup() {
//   Serial.begin(9600);
//   randomSeed(analogRead(0));
// }

// /**
//  * Arduino main loop function.
//  * Listens for serial input and processes commands (move, mode setting, save, and load operations).
//  */
// void loop() {
//   if (Serial.available() > 0) {
//     String input = Serial.readStringUntil('\n');
//     StaticJsonDocument<200> doc;
//     deserializeJson(doc, input);
    
//     String command = doc["command"];
//     GameManager* game = GameManager::getInstance();
    
//     if (command == "move") {
//       String move = doc["move"];
//       bool isPlayer1 = doc["isPlayer1"];
//       String response = game->processMove(move, isPlayer1);
//       Serial.println(response);
//     }
//     else if (command == "setMode") {
//       String mode = doc["mode"];
//       String response = game->setGameMode(mode);
//       Serial.println(response);
//     }
//     else if (command == "save") {
//       String savedState = game->saveGame();
//       Serial.println(savedState);
//     }
//     else if (command == "load") {
//       String savedState = doc["state"];
//       game->loadGame(savedState);
//       Serial.println("{\"status\":\"loaded\"}");
//     }
//   }
// }