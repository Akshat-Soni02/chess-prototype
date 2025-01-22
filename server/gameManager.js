import { game } from "./game.js";
import { states } from "./states.js";

export class gameManager {
  constructor() {
    this.games = [];
    this.users = [];
    this.pendingUser = null;
  }

  addUser = (socket) => {
    this.users.push(socket);
    this.addPlayer(socket);
  };

  removeUser = (socket) => {
    this.users = this.users.filter((user) => user != socket);
    console.log(`user removed - ${socket.id}`);
    if (this.pendingUser != null) console.log("Game stopped!!");
  };

  addPlayer = (socket) => {
    console.log("here to add a player");
    socket.on("message", (data) => {
      const message = JSON.parse(data.toString());
      console.log(message);

      if (message.type === states.INIT_GAME) {
        console.log("game initiated");
        if (this.pendingUser == null) {
          this.pendingUser = socket;
          console.log("game created, waiting for player to join");
        } else {
          const chess = new game(this.pendingUser, socket);
          this.games.push(chess);
          this.pendingUser = null;
          console.log("game joined");
          // create new game
          // make pending user null
        }
      }

      if (message.type === states.MOVE) {
        console.log("move has been made");
        const running_game = this.games.find(
          (cur_game) =>
            cur_game.participant1 === socket || cur_game.participant2 === socket
        );
        if (running_game) {
          console.log("running game found to make a move");
          running_game.makeMove(message.move);
        } else {
          console.log("move made on a non running game");
          return;
        }
      }
    });

    return;
  };
}
