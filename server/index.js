import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";
import { gameManager } from "./gameManager.js";

const app = express();
const port = 3001;

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

const manager = new gameManager();

io.on("connection", (socket) => {
  console.log(`user connected - ${socket.id}`);
  socket.emit("welcome", "Welcome to server");
  manager.addUser(socket);
  socket.on("disconnect", () => manager.removeUser(socket));
});

app.get("/", (req, res) => {
  res.send("Hello World!!");
});

server.listen(port, () => {
  console.log(`Server is running on ${port}!`);
});

//game manager to manage games, game which creates actual games, game manager adds or removes participants,

// a game manager will be having list of all games, a game consist of two participants, a Main game, moves list, and the start time.
