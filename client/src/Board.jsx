import React from "react";
import "./board.css";
// import img from "./assets/board.jpeg";
import img from "./assets/boardImg.png";
import { useNavigate } from "react-router-dom";

const Board = () => {
  const navigate = useNavigate();

  return (
    <div className="chessPage">
      <div className="boardSide">
        <img src={img} alt="chess" className="boardImg" />
      </div>
      <div className="gameStart">
        <div className="headline">Play chess online on the #3 site!</div>
        <div className="playButton" onClick={() => navigate("/game")}>
          Play Online
        </div>
      </div>
    </div>
  );
};

export default Board;
