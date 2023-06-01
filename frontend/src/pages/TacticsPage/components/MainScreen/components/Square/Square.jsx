import React, { useEffect, useState } from "react";

// TODO make dragable pieces
let mouseDown = false;

export function Square({ pos, state, setState, whiteSide }) {
  const posString = JSON.stringify(pos);
  const piece = state.board[(pos.y - 1) * 8 + pos.x - 1];
  const [selected, setSelected] = useState(false);
  const [highLighted, setHighLighted] = useState(false);

  const [leagalMove, setLeagalMove] = useState(false);
  const [itsCapture, setItsCapturePiece] = useState(false);

  useEffect(() => {
    setHighLighted(state.highLight.has(posString));
  }, [state, posString]);

  useEffect(() => {
    setSelected(state.selected.x === pos.x && state.selected.y === pos.y);
  }, [state.selected, pos]);

  useEffect(() => {
    setLeagalMove(state.leagalMoves.includes((pos.y - 1) * 8 + pos.x - 1));
    setItsCapturePiece(
      state.leagalMoves.includes((pos.y - 1) * 8 + pos.x - 1) && piece !== ""
    );
  }, [state.leagalMoves, pos, piece]);

  return (
    <div
      onContextMenu={(e) => e.preventDefault()} // disable right click menu
      onMouseDown={(event) => {
        console.log(state);

        mouseDown = true;
        if (event.button === 0) {
          // Left-click detected
          if (piece === "") return;
          if (
            state.selected.x === undefined ||
            state.selected.y === undefined
          ) {
            if (piece.substring(0, 1) === (state.whiteIsPlaying ? "b" : "w"))
              return; // keep the turn
            // fetch the leagal moves from backend with api of stockfish TODO
            const leagalMoves = [
              0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
              19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34,
              35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50,
              51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63,
            ];
            setState({
              ...state,
              draggingPiece: { id: posString, piece: piece },
              leagalMoves: leagalMoves,
              selected: { x: pos.x, y: pos.y },
            });
          } else {
            setState({
              ...state,
              selected: { x: pos.x, y: pos.y },
              draggingPiece: { id: posString, piece: piece },
            });
          }
        } else if (event.button === 2) {
          // Right-click detected
          // draw arrows logic here mouse down
        }
      }}
      onMouseUp={(event) => {
        mouseDown = false;
        let whiteIsPlaying = state.whiteIsPlaying;
        let selected = state.selected;
        let leagalMoves = state.leagalMoves;
        let highLight = state.highLight;

        if (event.button === 0) {
          // Left-click detected
          if (
            state.selected.x !== undefined &&
            state.selected.y !== undefined
          ) {
            if (state.selected.x !== pos.x || state.selected.y !== pos.y) {
              // CHECK IF THE MOVE IS VALID with api of stockfish to backend then update state TODO

              //console.log(state.leagalMoves,(state.selected.y-1)*8+state.selected.x-1)

              if (leagalMove) {
                state.board[(pos.y - 1) * 8 + pos.x - 1] =
                  state.board[
                    (state.selected.y - 1) * 8 + state.selected.x - 1
                  ];
                state.board[(state.selected.y - 1) * 8 + state.selected.x - 1] =
                  "";
                whiteIsPlaying = !whiteIsPlaying;
                selected = {};
                leagalMoves = [];
              } else {
                selected = {};
                leagalMoves = [];
              }
            }
          }
          highLight.clear();

          setState({
            ...state,
            draggingPiece: { id: "", piece: "" },
            whiteIsPlaying: whiteIsPlaying,
            selected: selected,
            leagalMoves: leagalMoves,
            highLight: highLight,
          });
        } else if (event.button === 2) {
          // Right-click detected
          // draw arrows logic here mouse up
          if (state.highLight.has(posString)) {
            state.highLight.delete(posString);
            setState({ ...state, highLight: state.highLight });
          } else {
            state.highLight.add(posString);
            setState({ ...state, highLight: state.highLight });
          }
        }
      }}
      onMouseMove={(event) => {
        if (mouseDown) {
          /* TODO
            // dragging element // it will be probably a better way to make the dragging with a useContext
            const p = state.board[(state.selected.y-1)*8+state.selected.x-1];
            ... make all this work with context and remove the dragging state from the squares 
            and place them into the Chess board component
            */
        }
      }}
      className={`relative flex aspect-square w-[12.5%] select-none justify-center align-middle 
    ${
      (pos.x + pos.y) % 2 === 0
        ? selected
          ? "bg-green-light"
          : "bg-green-dark"
        : selected
        ? "bg-yellow-dark"
        : "bg-yellow-light"
    }
  `}
    >
      <span className="absolute -bottom-0.5 right-1 text-[15px] font-semibold">
        {((pos.y === 1 && whiteSide) || (pos.y === 8 && !whiteSide)) &&
          ["a", "b", "c", "d", "e", "f", "g", "h"][pos.x - 1]}
      </span>
      <span className="absolute left-0.5 top-0 text-[15px] text-xs font-semibold">
        {((pos.x === 1 && whiteSide) || (pos.x === 8 && !whiteSide)) && pos.y}
      </span>

      <div
        className={`absolute z-0
        ${
          leagalMove
            ? itsCapture
              ? `h-full w-full rounded-full border-[0.4rem]
        ${
          (pos.x + pos.y) % 2 === 0
            ? "border-capture-dark"
            : "border-capture-light"
        }`
              : `${
                  (pos.x + pos.y) % 2 === 0
                    ? "bg-attack-dark"
                    : "bg-attack-light"
                }
        top-[35%] h-[30%] w-[30%] rounded-full
         `
            : ""
        }`}
      ></div>

      <div
        className={`absolute z-[1] h-full w-full ${
          highLighted
            ? `${(pos.x + pos.y) % 2 === 0 ? `bg-red-dark` : `bg-red-light`}`
            : "bg-transparent"
        }`}
      ></div>

      <div className="z-10 m-auto h-[100%] w-[100%] ">
        {piece !== "" && state.draggingPiece.id !== posString && (
          <img
            draggable={false}
            src={window.location.origin + `/assets/pieces/${piece}.png`}
            alt="piece icon"
            className="h-full w-full"
          />
        )}
      </div>
    </div>
  );
}
