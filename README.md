# Details about repository

This repository contains a project for a "Rock Paper Scissors" game, built using Arduino Uno, C++ and React with Electron and TypeScript. The logic will run on the Arduino Uno, which will be the server for the game, while the React + Electron application will be used as a GUI for users interactions.

# Task details

## Student details

| Student number |        Game         | Config format |
| :------------: | :-----------------: | :-----------: |
|       20       | rock paper scissors |     JSON      |

## Technologies and Hardware

### Programming Language

- **C/C++**: Used for server-side to develop the game logic.
- **TypeScript**: Used for client-side to develop UI.

### Software

- **Arduino IDE**: To write and upload the logic code to the Arduino Uno, using C++ for low-level control.

- **VS Code**: Used for creating GUI that displays the game view and allows users to interact with the game progress in real time.

### Hardware

- **Arduino Uno**: The board will handle game logic, which includes processing game state, managing inputs, and sending outputs to the client application.

### How to build and run the client:

1. Pull **feature/develop/task2** branch
2. Navigate to **./client**
3. Install dependencies:

```
npm install
```

4. Run the application:

```
npm run dev
```

5. Navigate to `localhost:5123` OR wait for electron app to load(TBD).

### To build and run the server:

1. Open Arduino IDE
2. Plug into the computer your Arduino board
3. Upload code to the board by pressing the upload button
