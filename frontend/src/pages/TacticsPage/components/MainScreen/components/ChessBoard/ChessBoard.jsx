import React, { useEffect, useRef, useState } from "react";
import { Square } from "../Square/Square";

function fenToPieceNamesArray(fen, board) {
  if (fen === undefined) return;

  const fenParts = fen.split(" ");
  const piecePlacement = fenParts[0];

  const rows = piecePlacement.split("/");

  for (let r = 0; r < rows.length; r++) {
    let colIndex = 0;

    for (let j = 0; j < rows[r].length; j++) {
      const char = rows[r][j];

      if (!isNaN(parseInt(char, 10))) {
        for (let i = 0; i < parseInt(char, 10); i++) {
          board[8 * r + colIndex] = "";
          colIndex++;
        }
        continue;
      }

      board[8 * r + colIndex] =
        (/[A-Z\W]/.test(char) ? "w" : "b") + char.toUpperCase();
      colIndex++;
    }
  }
}

export default function ChessBoard({ fen, className, whiteSide }) {
  const [squares, setSquares] = useState([]);
  const draggableRef = useRef();

  const [state, setState] = useState({
    selected: {},
    board: [
      "wR",
      "wN",
      "wB",
      "wK",
      "wQ",
      "wB",
      "wN",
      "wR",
      "wp",
      "wp",
      "wp",
      "wp",
      "wp",
      "wp",
      "wp",
      "wp",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "bp",
      "bp",
      "bp",
      "bp",
      "bp",
      "bp",
      "bp",
      "bp",
      "bR",
      "bN",
      "bB",
      "bK",
      "bQ",
      "bB",
      "bN",
      "bR",
    ],
    whiteIsPlaying: true,
    leagalMoves: [],
    highLight: new Set([]),
    draggingPiece: { id: "", piece: "" },
  });

  useEffect(() => {
    let tmp_board = [];
    fenToPieceNamesArray(fen, tmp_board);
    setState((prevState) => {
      return { ...prevState, board: tmp_board };
    });
  }, [fen]);

  useEffect(() => {
    let sq = [];
    if (!whiteSide) {
      for (let r = 1; r <= 8; r++) {
        for (let c = 8; c >= 1; c--) {
          sq.push(
            <Square
              state={state}
              setState={setState}
              key={r * 8 + c}
              pos={{ x: c, y: r }}
              whiteSide={whiteSide}
            />
          );
        }
      }
    } else {
      for (let r = 8; r >= 1; r--) {
        for (let c = 1; c <= 8; c++) {
          sq.push(
            <Square
              state={state}
              setState={setState}
              key={r * 8 + c}
              pos={{ x: c, y: r }}
              whiteSide={whiteSide}
            />
          );
        }
      }
    }
    setSquares(sq);
  }, [whiteSide, state]);

  return (
    <>
      <div
        className={`border-black relative mx-auto my-3 flex
    aspect-square w-full flex-wrap justify-center border-4 bg-white align-middle ${className}`}
        onMouseMove={(e) => {
          console.log(draggableRef.current, state.draggingPiece);
          if (!draggableRef.current) return;

          const containerRect = e.currentTarget.getBoundingClientRect();
          const offsetX = e.clientX - containerRect.left;
          const offsetY = e.clientY - containerRect.top;

          const draggableElement = draggableRef.current;
          draggableElement.style.left = offsetX + "px";
          draggableElement.style.top = offsetY + "px";
          draggableElement.style.cursor = "grab";

          draggableRef.current.style.zIndex = 10;
        }}
      >
        {state.draggingPiece.id !== "" && (
          <img
            ref={draggableRef}
            src={
              window.location.origin +
              `/assets/pieces/${state.draggingPiece.piece}.png`
            }
            alt="piece icon"
            className="h-1/8 w-1/8 absolute top-10 -z-10 -translate-x-1/2 -translate-y-1/2"
          />
        )}
        {squares}
      </div>
    </>
  );
}
