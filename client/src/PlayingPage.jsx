import React, { useEffect, useState } from "react";
import PlayingBoard from "./PlayingBoard.jsx";
import useSocket from "./assets/useSocket.jsx";
import { Chess } from "chess.js";
import "./PlayingPage.css";
import { State } from "./State.jsx";
import ClipLoader from "react-spinners/ClipLoader";
import { Toaster, toast } from "react-hot-toast";

const PlayingPage = () => {
  const socket = useSocket();
  const [chess, setChess] = useState(new Chess());
  const [gameBoard, setGameBoard] = useState(chess.board());
  const [init, setInit] = useState(false);
  const [turn, setTurn] = useState(false);
  const [startButton, setStartButton] = useState(true);
  const [isClicked, setIsClicked] = useState(false);
  const [color, setColor] = useState(null);

  useEffect(() => {
    if (!socket) return;
    socket.on("message", (data) => {
      const message = JSON.parse(data.toString());

      switch (message.type) {
        case State.INIT_GAME:
          // setChess(new Chess());
          // setGameBoard(chess.board());
          console.log(`Game started your color is ${message.color}`);
          if (message.color === "white") setTurn(true);
          setInit(true);
          setStartButton(false);
          setIsClicked(false);
          toast.success(`Game started your color is ${message.color}`);
          setColor(message.color);
          console.log(color);
          break;

        case State.MOVE:
          console.log(`move came to this color`);
          // console.log("intial board" + chess.board());
          const move = message.payload.move;
          chess.move(move);
          console.log(chess.board());
          setGameBoard(chess.board());
          setTurn(true);
          console.log(`Move received from server: ${(move.from, move.to)}`);
          break;

        case State.GAME_OVER:
          if (message.payload.winner === color) {
            toast("You won", {
              icon: "👏",
            });
          } else {
            toast(`${color === "white" ? "Black" : "White"} has won the game`, {
              icon: "🏳️",
            });
          }
          console.log(color);
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
    setIsClicked(true);
  };

  return (
    <div className={`PlayingPage ${startButton ? "side" : "center"}`}>
      <Toaster />
      <PlayingBoard
        socket={socket}
        gameBoard={gameBoard}
        setGameBoard={setGameBoard}
        chess={chess}
        setChess={setChess}
        init={init}
        turn={turn}
        setTurn={setTurn}
      />
      {startButton && (
        <div className="rightHalf">
          {isClicked ? (
            <ClipLoader
              color={"36D9B8"}
              loading={isClicked}
              size={35}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          ) : (
            <div className="gameStartButton" onClick={() => initateGame()}>
              Play
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PlayingPage;
