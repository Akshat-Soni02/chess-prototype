import React, { useEffect, useState } from "react";
import PlayingBoard from "./PlayingBoard.jsx";
import useSocket from "./assets/useSocket.jsx";
import { Chess } from "chess.js";
import "./PlayingPage.css";
import { State } from "./State.jsx";

const PlayingPage = () => {
  const socket = useSocket();
  const [chess, setChess] = useState(new Chess());
  const [gameBoard, setGameBoard] = useState(chess.board());
  const [init, setInit] = useState(false);

  useEffect(() => {
    if (!socket) return;
    socket.on("message", (data) => {
      const message = JSON.parse(data.toString());

      switch (message.type) {
        case State.INIT_GAME:
          // setChess(new Chess());
          // setGameBoard(chess.board());
          console.log(`Game started your color is ${message.color}`);
          setInit(true);
          break;

        case State.MOVE:
          console.log(`move came to this color`);
          console.log(chess.board());
          const move = message.payload.move;
          // const newChess = new Chess(chess.fen());
          // newChess.move(message.payload.move);
          // setChess(newChess);
          chess.move(move);
          setGameBoard(chess.board());
          console.log(`Move received from server: ${(move.from, move.to)}`);
          // console.log(chess.board());
          break;

        case State.GAME_OVER:
          setChess(new Chess());
          setGameBoard(chess.board());
          console.log(`${message.payload.winner} has won the game :)`);
          setInit(false);
          break;

        default:
          console.log("default switch executed");
          break;
      }
    });
  }, [socket]);

  if (!socket) return <div>Connectiong...</div>;

  const initateGame = () => {
    socket.send(JSON.stringify({ type: State.INIT_GAME }));
  };

  return (
    <div className="PlayingPage">
      <PlayingBoard
        socket={socket}
        gameBoard={gameBoard}
        setGameBoard={setGameBoard}
        chess={chess}
        setChess={setChess}
        init={init}
      />
      <div className="rightHalf">
        <div className="gameStartButton" onClick={() => initateGame()}>
          Play
        </div>
      </div>
    </div>
  );
};

export default PlayingPage;
