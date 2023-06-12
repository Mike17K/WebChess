import React, { useEffect, useRef, useState } from "react";
import { Square } from "../Square/Square";

function fenToPieceNamesArray(fen, board) {
  if (fen === undefined) return;

  for (let i = 0; i < 64; i++) board[i] = "";

  const fenParts = fen.split(" ");
  const piecePlacement = fenParts[0];
  const rows = piecePlacement.split("/");

  // "rnbqkb1r/pp2pp1p/3p1np1/8/3NP3/2N5/PPP2PPP/R1BQKB1R w KQkq - 0 1"
  for (let r = 0; r < rows.length; r++) {
    let colIndex = 0;

    for (let j = 0; j < rows[r].length; j++) {
      const char = rows[r][j];

      if (!isNaN(parseInt(char, 10))) {
        for (let i = 0; i < parseInt(char, 10); i++) {
          board[8 * (7 - r) + colIndex] = "";
          colIndex++;
        }
        continue;
      }

      board[8 * (7 - r) + colIndex] =
        (/[A-Z\W]/.test(char) ? "w" : "b") + char.toUpperCase();
      colIndex++;
    }
  }
}

export default function ChessBoard({ fen, className, whiteSide }) {
  const [squares, setSquares] = useState([]);
  const draggableRef = useRef();

  const [state, setState] = useState({
    board: [
      "wR",
      "wN",
      "wB",
      "wQ",
      "wK",
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
      "bQ",
      "bK",
      "bB",
      "bN",
      "bR",
    ],
    selected: null, // here will be the string of the selected square ex: e4
    whiteIsPlaying: true,
    leagalMoves: {b1:[16,18],g1:[23,21]}, // here will be selected sq and leagal sq targets ex: {a1: [6,8,12], b1: [10,55,60]}
    highLight: {blue:[],red:[],green:[],yellow:[]}, // inside the arrays will be the id of sq to highlight ex: {blue:[2,5,6],red:[8,10,16]}
    draggingPiece: false
  });

  useEffect(() => {
    // TODO request from server the creation of new game
    let tmp_board = [];
    fenToPieceNamesArray(fen, tmp_board);

    fetch(`http://localhost:5050/api/stockfish/getLeagalMoves`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({fen:fen})
    }).then((res) => res.json()).then((data) => {
      console.log("leagalMoves: ",data.leagalMoves);
      setState((prevState) => {
        return { ...prevState,leagalMoves:data.leagalMoves, board: tmp_board };
      });
    }).catch((err) => console.log(err));
    
    }, [fen]);

    // key down highlight color picker
    const [highLightedColor, setHighLightedColor] = useState(0);
    
    useEffect(() => {
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
      };
    }, []);
    
    // "red", "yellow", "green", "blue"];
    function handleKeyDown(event){
      //console.log(event.key);
      if (event.key === "Shift") {
        setHighLightedColor(1);
      } else if (event.key === "Alt") {
        setHighLightedColor(2);
      } else if (event.key === "Control") {
        setHighLightedColor(3);
      }
    }
    function handleKeyUp(event){
      setHighLightedColor(0)
    }
    
    useEffect(() => {
      let sq = [];
      if (!whiteSide) {
        for (let r = 1; r <= 8; r++) {
          for (let c = 8; c >= 1; c--) {
            sq.push(
            <Square
              state={state}
              setState={setState}
              highLightedColor={highLightedColor}
              key={(r - 1) * 8 + c - 1}
              id={(r - 1) * 8 + c - 1}
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
              highLightedColor={highLightedColor}
              key={(r - 1) * 8 + c - 1}
              id={(r - 1) * 8 + c - 1}
              pos={{ x: c, y: r }}
              whiteSide={whiteSide}
            />
          );
        }
      }
    }
    setSquares(sq);
  }, [whiteSide, state,highLightedColor /* not needed here as dependency */]);


  function handleDraggable(e) {
    if (state.draggingPiece === false) return;
    if (!draggableRef.current) return;

    const containerRect = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - containerRect.left;
    const offsetY = e.clientY - containerRect.top;

    const draggableElement = draggableRef.current;
    draggableElement.style.left = offsetX + "px";
    draggableElement.style.top = offsetY + "px";
    draggableElement.style.cursor = "grab";
    draggableElement.style.height = "12.5%";
    draggableRef.current.style.zIndex = 10;
  }

  return (
    <>
      <div
        className={`border-black relative mx-auto my-3 flex
    aspect-square w-full flex-wrap justify-center border-4 bg-white align-middle ${className}`}
        onMouseMove={(e) => {
          handleDraggable(e);
        }}
      >
        {state.draggingPiece && (
          <img
            ref={draggableRef}
            src={
              window.location.origin +
              `/assets/pieces/${state.board[state.selected]}.png`
            }
            alt="piece icon"
            className="w-1/8 absolute h-0 -translate-x-1/2 -translate-y-1/2"
          />
        )}
        {squares}
      </div>
    </>
  );
}
