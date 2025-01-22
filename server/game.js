import { Chess } from "chess.js";
import { states } from "./states.js";

export class game {
  constructor(participant1, participant2) {
    this.participant1 = participant1;
    this.participant2 = participant2;
    this.startTime = new Date();
    this.game = new Chess();

    this.participant1.emit(
      "message",
      JSON.stringify({
        type: states.INIT_GAME,
        color: "white",
      })
    );

    this.participant2.emit(
      "message",
      JSON.stringify({
        type: states.INIT_GAME,
        color: "black",
      })
    );
  }

  makeMove = (move) => {
    //validate move
    // check for conditions like check, checkmate, stalemate, draw
    // if its alright then make the move and continue the game

    //validating
    const result = this.game.move(move);
    if (!result) {
      console.log("Invalid Move");
      return null;
    }

    console.log("move is correct");

    //checking for checks or mates or stales or draws
    const gameOver = this.game.isGameOver();
    if (gameOver) {
      console.log("game over");
      this.participant1.emit(
        "message",
        JSON.stringify({
          type: states.GAME_OVER,
          payload: {
            winner: this.game.turn() === "w" ? "black" : "white",
          },
        })
      );

      this.participant2.emit(
        "message",
        JSON.stringify({
          type: states.GAME_OVER,
          payload: {
            winner: this.game.turn() === "w" ? "black" : "white",
          },
        })
      );

      return;
    }
    console.log(this.game.turn());
    console.log(this.game.history().length);
    const recipient =
      this.game.history().length % 2 === 0
        ? this.participant1
        : this.participant2;

    recipient.emit(
      "message",
      JSON.stringify({
        type: states.MOVE,
        payload: {
          move,
        },
      })
    );
  };
}
