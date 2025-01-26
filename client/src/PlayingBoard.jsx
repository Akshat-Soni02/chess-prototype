import React, { useState, useMemo, useEffect } from "react";
import "./PlayingBoard.css";
import { Chess } from "chess.js";
import { io } from "socket.io-client";
import { State } from "./State";
import pw from "./assets/pw.svg"; // White pawn
import pb from "./assets/pb.svg"; // Black pawn
import kw from "./assets/kw.svg"; // White king
import kb from "./assets/kb.svg"; // Black king
import qw from "./assets/qw.svg"; // White queen
import qb from "./assets/qb.svg"; // Black queen
import rw from "./assets/rw.svg"; // White rook
import rb from "./assets/rb.svg"; // Black rook
import bw from "./assets/bw.svg"; // White bishop
import bb from "./assets/bb.svg"; // Black bishop
import nw from "./assets/nw.svg"; // White knight
import nb from "./assets/nb.svg"; // Black knight

const PlayingBoard = ({
  socket,
  gameBoard,
  setGameBoard,
  chess,
  init,
  turn,
  setTurn,
}) => {
  const [from, setFrom] = useState(null);
  const pieceImages = {
    pw, // Pawn white
    pb, // Pawn black
    kw, // King white
    kb, // King black
    qw, // Queen white
    qb, // Queen black
    rw, // Rook white
    rb, // Rook black
    bw, // Bishop white
    bb, // Bishop black
    nw, // Knight white
    nb, // Knight black
  };

  const onDragStart = (e, sq) => {
    setFrom(sq);
    e.dataTransfer.effectAllowed = "move";
    e.target.style.cursor = "grabbing";
  };

  const onDrop = async (e, sq) => {
    e.preventDefault();
    e.target.style.cursor = "grab";
    // console.log(chess.board());
    if (!turn) {
      console.log("not your turn");
      return;
    }
    console.log(`from ${from} dropped on ${sq}`);
    if (!init) {
      console.log("Game not started yet!!");
      return;
    }

    try {
      const moveResult = chess.move({ from, to: sq });
      if (!moveResult) {
        console.log(`Invalid move: from ${from} to ${sq}`);
        return;
      }
    } catch (error) {
      console.log("wrong move");
      return;
    }

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

      // const movedChess = new Chess(chess.fen());
      // setChess(movedChess);

      console.log(`${from} to ${sq}`);

      console.log("Attempting to update local chess state...");
      setGameBoard(chess.board());
      setTurn(false);
    } catch (error) {
      console.log("Error from server while dropping piece");
    }

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
        const piece = gameBoard[i][j];

        row.push(
          <div
            className={`square ${isDark ? "dark" : "light"}`}
            key={`${i} - ${j}`}
            onDrop={(e) => onDrop(e, sq)}
            onDragOver={onDragOver}
          >
            {piece && (
              <img
                className={`piece ${
                  piece.color === "w" ? "whitePiece" : "blackPiece"
                }`}
                draggable
                onDragStart={(e) => onDragStart(e, sq)}
                src={pieceImages[`${piece.type}${piece.color}`]}
                alt={`${piece.type}${piece.color}`}
              />
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
