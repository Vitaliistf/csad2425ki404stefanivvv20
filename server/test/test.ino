#include "../../../../../../../../../Desktop/Developer/csad2425ki404stefanivvv20/server/server.ino"
#include <ArduinoUnit.h>
#include <ArduinoJson.h>

test(gameState_initialization) {
    GameState state;
    assertEqual(state.player1Score, 0);
    assertEqual(state.player2Score, 0);
    assertEqual(state.gameMode, "hvh");
    assertEqual(state.lastMove1, "");
    assertEqual(state.lastMove2, "");
    assertEqual(state.lastComputerMove, "");
}

test(randomStrategy_makeMove) {
    RandomStrategy strategy;
    String move = strategy.makeMove();
    assertTrue(move == "rock" || move == "paper" || move == "scissors");
}

test(smartStrategy_initialMove) {
    SmartStrategy strategy;
    String move = strategy.makeMove();
    assertTrue(move == "rock" || move == "paper" || move == "scissors");
}

test(smartStrategy_adaptiveMove) {
    SmartStrategy strategy;
    strategy.updateLastMove("rock");
    assertEqual(strategy.makeMove(), "paper");  
    strategy.updateLastMove("paper");
    assertEqual(strategy.makeMove(), "scissors");  
    strategy.updateLastMove("scissors");
    assertEqual(strategy.makeMove(), "rock");  
}

test(GameManager_singleton) {
    GameManager* instance1 = GameManager::getInstance();
    GameManager* instance2 = GameManager::getInstance();
    assertTrue(instance1 == instance2);
}

test(GameManager_setGameMode) {
    GameManager* gameManager = GameManager::getInstance();
    gameManager->setGameMode("hvc");
    GameState state = gameManager->getGameState();
    assertEqual(state.gameMode, "hvc");
    assertEqual(state.player1Score, 0);
    assertEqual(state.player2Score, 0);
}

test(GameManager_processMove_hvh) {
    GameManager* gameManager = GameManager::getInstance();
    gameManager->setGameMode("hvh");
    gameManager->processMove("rock", true);
    gameManager->processMove("scissors", false); 

    GameState state = gameManager->getGameState();
    assertEqual(state.player1Score, 1);
    assertEqual(state.player2Score, 0);
    assertEqual(state.lastMove1, "");
    assertEqual(state.lastMove2, "");
}

test(GameManager_processMove_cvcs) {
    GameManager* gameManager = GameManager::getInstance();
    gameManager->setGameMode("cvcs");
    String result = gameManager->processMove("", false);

    GameState state = gameManager->getGameState();
    assertEqual(state.gameMode, "cvcs");
    assertEqual(result.length() > 0, true); 
}

test(GameManager_saveGame) {
    GameManager* gameManager = GameManager::getInstance();
    gameManager->setGameMode("hvc");
    gameManager->processMove("rock", true);
    String savedState = gameManager->saveGame();

    assertTrue(savedState.indexOf("\"status\":\"saved\"") >= 0);
    assertTrue(savedState.indexOf("\"player1Score\":1") >= 0);
    assertTrue(savedState.indexOf("\"player2Score\":0") >= 0);
}

test(GameManager_loadGame) {
    GameManager* gameManager = GameManager::getInstance();
    String savedState = "{\"player1Score\":2,\"player2Score\":1,\"gameMode\":\"cvc\"}";
    gameManager->loadGame(savedState);
    
    GameState state = gameManager->getGameState();
    assertEqual(state.player1Score, 2);
    assertEqual(state.player2Score, 1);
    assertEqual(state.gameMode, "cvc");
}

test(GameManager_resetScores) {
    GameManager* gameManager = GameManager::getInstance();
    gameManager->setGameMode("hvh");
    gameManager->processMove("rock", true);
    gameManager->processMove("scissors", false);

    GameState state = gameManager->getGameState();
    assertEqual(state.player1Score, 1);
    assertEqual(state.player2Score, 0);

    gameManager->resetScores();
    state = gameManager->getGameState();
    assertEqual(state.player1Score, 0);
    assertEqual(state.player2Score, 0);
}

test(GameManager_updateScore) {
    GameManager* gameManager = GameManager::getInstance();
    gameManager->setGameMode("hvh");
    gameManager->resetScores();

    gameManager->processMove("rock", true);
    gameManager->processMove("scissors", false);
    GameState state = gameManager->getGameState();
    assertEqual(state.player1Score, 1);
    assertEqual(state.player2Score, 0);

    gameManager->processMove("paper", true);
    gameManager->processMove("rock", false);
    state = gameManager->getGameState();
    assertEqual(state.player1Score, 2);
    assertEqual(state.player2Score, 0);

    gameManager->processMove("scissors", true);
    gameManager->processMove("paper", false);
    state = gameManager->getGameState();
    assertEqual(state.player1Score, 3);
    assertEqual(state.player2Score, 0);
}

void setup() {
  Serial.begin(9600);
  while(!Serial) {} 
}

void loop() {
  Test::run();
}

