import React, { useState, useMemo, useEffect } from "react";
import "./PlayingBoard.css";
import { Chess } from "chess.js";
import { io } from "socket.io-client";
import { State } from "./State";

const PlayingBoard = ({
  socket,
  gameBoard,
  setGameBoard,
  chess,
  setChess,
  init,
}) => {
  // const [draggedPiece, setDraggedPiece] = useState(null);
  const [from, setFrom] = useState(null);

  const onDragStart = (e, sq) => {
    // if (piece === null) return;
    // setDraggedPiece(piece);
    setFrom(sq);
    e.dataTransfer.effectAllowed = "move";
  };

  const onDrop = async (e, sq) => {
    e.preventDefault();
    console.log(`from ${from} dropped on ${sq}`);
    // if (!init) {
    //   console.log("Game not started yet!!");
    //   return;
    // }
    // var res = "";

    try {
      socket.emit(
        "message",
        JSON.stringify({
          type: State.MOVE,
          move: {
            from,
            to: sq,
          },
        })
      );

      const moveResult = chess.move({ from, to: sq });
      if (!moveResult) {
        console.log(`Invalid move: from ${from} to ${sq}`);
        return;
      }

      console.log(`${from} to ${sq}`);

      // res = chess.move({ from, to: sq });
      console.log("Attempting to update local chess state...");
      setGameBoard(chess.board());
      console.log(chess.board());
    } catch (error) {
      // console.log(res);
      console.log("Error from server while dropping piece");
    }

    // const newChess = new Chess(chess.fen());
    // const result = newChess.move({ from, to: sq });
    // setChess(newChess);
    setFrom(null);
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const renderBoard = () => {
    const board = [];
    for (let i = 0; i < 8; i++) {
      const row = [];
      for (let j = 0; j < 8; j++) {
        const isDark = (i + j) % 2 === 1;
        const sq = String.fromCharCode(97 + j) + String(8 - i);
        // console.log(sq);
        row.push(
          <div
            className={`square ${isDark ? "dark" : "light"}`}
            key={`${i} - ${j}`}
            onDrop={(e) => onDrop(e, sq)}
            onDragOver={onDragOver}
          >
            {gameBoard[i][j] && (
              <span
                className="piece"
                draggable
                onDragStart={(e) => onDragStart(e, sq)}
              >
                {gameBoard[i][j].type}
              </span>
            )}
          </div>
        );
      }
      board.push(
        <div className="row" key={i}>
          {row}
        </div>
      );
    }
    // console.log(gameBoard);
    return board;
  };

  return (
    <div className="PlayingBoard">
      <div className="chessBoard" id="chessBoard">
        {renderBoard()}
      </div>
    </div>
  );
};

export default PlayingBoard;
