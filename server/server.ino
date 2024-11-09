#include <ArduinoJson.h>

// Паттерн State для збереження стану гри
class GameState {
  public:
    int player1Score = 0;
    int player2Score = 0;
    String gameMode = "hvh"; // hvh, hvc, cvc, cvcs
    String lastMove1 = "";
    String lastMove2 = "";
    String lastComputerMove = "";
};

// Паттерн Strategy для різних режимів гри
class GameStrategy {
  public:
    virtual String makeMove() = 0;
    virtual void updateLastMove(String opponentMove) {}
};

class RandomStrategy : public GameStrategy {
  public:
    String makeMove() {
      String moves[] = {"rock", "paper", "scissors"};
      return moves[random(0, 3)];
    }
};

class SmartStrategy : public GameStrategy {
  private:
    String lastOpponentMove = "";
    int rockCount = 0;
    int paperCount = 0;
    int scissorsCount = 0;
    
  public:
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
    
    void updateLastMove(String opponentMove) override {
      lastOpponentMove = opponentMove;
      if (opponentMove == "rock") rockCount++;
      else if (opponentMove == "paper") paperCount++;
      else if (opponentMove == "scissors") scissorsCount++;
    }
};

// Паттерн Singleton для керування грою
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
    static GameManager* getInstance() {
      if (!instance) {
        instance = new GameManager();
      }
      return instance;
    }
    
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
    
    void resetScores() {
      state.player1Score = 0;
      state.player2Score = 0;
      state.lastMove1 = "";
      state.lastMove2 = "";
      state.lastComputerMove = "";
    }
    
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
    
    void loadGame(String savedState) {
      StaticJsonDocument<200> doc;
      deserializeJson(doc, savedState);
      
      state.player1Score = doc["player1Score"];
      state.player2Score = doc["player2Score"];
      state.gameMode = doc["gameMode"].as<String>();
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

void setup() {
  Serial.begin(9600);
  randomSeed(analogRead(0));
}

void loop() {
  if (Serial.available() > 0) {
    String input = Serial.readStringUntil('\n');
    StaticJsonDocument<200> doc;
    deserializeJson(doc, input);
    
    String command = doc["command"];
    GameManager* game = GameManager::getInstance();
    
    if (command == "move") {
      String move = doc["move"];
      bool isPlayer1 = doc["isPlayer1"];
      String response = game->processMove(move, isPlayer1);
      Serial.println(response);
    }
    else if (command == "setMode") {
      String mode = doc["mode"];
      String response = game->setGameMode(mode);
      Serial.println(response);
    }
    else if (command == "save") {
      String savedState = game->saveGame();
      Serial.println(savedState);
    }
    else if (command == "load") {
      String savedState = doc["state"];
      game->loadGame(savedState);
      Serial.println("{\"status\":\"loaded\"}");
    }
  }
}