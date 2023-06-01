import React, { useEffect, useState } from "react";

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
        let whiteIsPlaying = state.whiteIsPlaying;
        let selected = state.selected;
        let leagalMoves = state.leagalMoves;
        let draggingPiece = state.draggingPiece;
        let highLight = state.highLight;

        if (event.button === 0) {
          // Left-click detected
          if (piece === "") return;
          if (
            state.selected.x === undefined ||
            state.selected.y === undefined
          ) {
            // fetch the leagal moves from backend with api of stockfish TODO // the api should be watching for the move order
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
            // replace the move piece logic  of the board with a function same as mouse up TODO
            if (state.selected.x === pos.x && state.selected.y === pos.y) {
              selected = {};
              leagalMoves = [];
              highLight.clear();
            } else if (
              state.leagalMoves.includes((pos.y - 1) * 8 + pos.x - 1)
            ) {
              state.board[(pos.y - 1) * 8 + pos.x - 1] =
                state.board[(state.selected.y - 1) * 8 + state.selected.x - 1];
              state.board[(state.selected.y - 1) * 8 + state.selected.x - 1] =
                "";
              whiteIsPlaying = !whiteIsPlaying; // this will be updated from the server not manualy
              selected = {};
              leagalMoves = [];
              highLight.clear();
            } else {
              selected = { x: pos.x, y: pos.y };
              leagalMoves = [];
              draggingPiece = { id: posString, piece: piece };
              // fetch new moves and update the leagalMoves
            }

            setState({
              ...state,
              draggingPiece: draggingPiece,
              whiteIsPlaying: whiteIsPlaying,
              selected: selected,
              leagalMoves: leagalMoves,
              highLight: highLight,
            });
          }
        } else if (event.button === 2) {
          // Right-click detected
          // draw arrows logic here mouse down
        }
      }}
      onMouseUp={(event) => {
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

              if (state.leagalMoves.includes((pos.y - 1) * 8 + pos.x - 1)) {
                state.board[(pos.y - 1) * 8 + pos.x - 1] =
                  state.board[
                    (state.selected.y - 1) * 8 + state.selected.x - 1
                  ];
                state.board[(state.selected.y - 1) * 8 + state.selected.x - 1] =
                  "";
                whiteIsPlaying = !whiteIsPlaying; // this will be updated from the server not manualy
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
