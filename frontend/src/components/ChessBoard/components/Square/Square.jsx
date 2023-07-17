import React, { useEffect, useState } from "react";
import './Square.css'
import {store} from '../../../../redux/store';
/*
function onDownLeftClickHandler(state,setState,pos){

  let whiteIsPlaying = state.whiteIsPlaying;
  let selected = state.selected;
  let draggingPiece = state.draggingPiece;
  let highLight = state.highLight;

    if (piece === "") return;
    if (
      state.selected === ""
    ) {
      setState({
        ...state,
        draggingPiece: { id: posString, piece: piece },
        selected: sqName,
      });
    } else {
      // replace the move piece logic  of the board with a function same as mouse up TODO
      if (state.selected === sqName) {
        selected = "";
        highLight.clear();
      } else if(state.leagalMoves[state.selected]!== undefined){
        if(state.leagalMoves[state.selected].includes(sqName)) {
        state.board[(pos.y - 1) * 8 + pos.x - 1] =
        state.board[(state.selected.y - 1) * 8 + state.selected.x - 1];
        state.board[(state.selected.y - 1) * 8 + state.selected.x - 1] ="";
        whiteIsPlaying = !whiteIsPlaying; // this will be updated from the server not manualy
        selected = "";
        highLight.clear();
      } else {
        selected = sqName;
        draggingPiece = { id: posString, piece: piece };
      }
    }

      setState({
        ...state,
        draggingPiece: draggingPiece,
        whiteIsPlaying: whiteIsPlaying,
        selected: selected,
        highLight: highLight,
      });
    }
}
*/
/*
{
  board: [],
  selected: null, // here will be the string of the selected square ex: e4
  whiteIsPlaying: true,
  leagalMoves: {}, // here will be selected sq and leagal sq targets ex: {a1: [6,8,12], b1: [10,55,60]}
  highLight: {blue:[],red:[],green:[],yellow:[]}, // inside the arrays will be the id of sq to highlight ex: {blue:[2,5,6],red:[8,10,16]}
  draggingPiece: true
}
*/

const highLightOptions = ["red", "yellow", "green", "blue"];

export function Square({ id, pos, state, setState, whiteSide, highLightedColor, moveCallback }){
  const sqName = `${["a", "b", "c", "d", "e", "f", "g", "h"][pos.x - 1]}${pos.y}`;
  const piece = state.board[id];
  
  const [selected, setSelected] = useState(false);
  useEffect(() => {
    setSelected(state.selected === sqName);
  }, [state.selected, sqName]);

  const [showPiece, setShowPiece] = useState(true);
  useEffect(() => {
    setShowPiece(!(state.draggingPiece && selected));
  }, [state.draggingPiece, selected]);

  const [highLighted, setHighLighted] = useState(null);
  
  useEffect(() => {
    if(highLighted === null) return;
    if(!state.highLight[highLighted].includes(id)){
      setHighLighted(null);
    }
  }, [state.highLight,highLighted,id]);
  
  const [leagalMove, setLeagalMove] = useState(false);
  const [itsCapture, setItsCapturePiece] = useState(false);
  useEffect(() => {
  if(state.leagalMoves[state.selected]!== undefined){
    if(state.leagalMoves[state.selected].includes(id)){
      setLeagalMove(true);
      if(state.board[id] !== ""){
        setItsCapturePiece(true);
      }else{
        setItsCapturePiece(false);
      }
    }else{
      setItsCapturePiece(false);
      setLeagalMove(false);
    }
  }else{
    setItsCapturePiece(false);
    setLeagalMove(false);
  }
}
  , [state.leagalMoves,state.selected,id,state.board]);
  

  // On click functions 
  function onDownLeftClickHandler(event){
    console.log(sqName)
    if(leagalMove){
      // move the piece
      const selectedId = {a:0,b:1,c:2,d:3,e:4,f:5,g:6,h:7}[state.selected[0]] + (parseInt(state.selected[1])-1)*8;
      // send the move to the server
      let gameId;
      let accessToken;
      let userId;
      let accessServerKey;
      try{
        const state = store.getState();
        userId = state.profile.profile.id;
        gameId = state.games.accessGame.id;
        accessToken = state.games.accessGame.key;
        accessServerKey = state.profile.profile.access_server_key;
        console.log(userId,gameId,accessToken,accessServerKey);
      }catch(err){
        console.log(err);
        return;
      }

      // submit a move to the server
      fetch(`http://localhost:5050/api/game/addMove`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId, // from redux
          gameId: gameId,
          sqIDFrom:selectedId, // sumbit the id of the square in witch the piece was
          sqIDTo:id, // sumbit the id of the square in witch the piece is going
          accessToken:accessToken , // for the game from redux 
          accessServerKey:accessServerKey // for the server from redux 
        }) // TODO make the server sent it for each individual game based on time and user
    }).then((res) => res.json()).then((data) => {
      // res: board, whiteIsPlaying, leagalMoves
      if( data.error || !data) return;
      
      console.log(data);
      setState({
        board: data.board,
        selected: null, 
        whiteIsPlaying: data.whiteIsPlaying,
        leagalMoves: data.leagalMoves, 
        highLight: {blue:[],red:[],green:[],yellow:[]},
        draggingPiece: false
      });
       console.log("moveCallback");
      moveCallback();
    }).catch((err) => console.log(err));
    
    }else if(state.selected === sqName){
      // unselect the selected square
      setState({
        ...state,
        selected: null,
        highLight: {blue:[],green:[],red:[],yellow:[]}
      });
    }else if(piece !== ""){ // if the square is not empty select it
      setState({
        ...state,
        selected: sqName,
        highLight: {blue:[],green:[],red:[],yellow:[]}
      });
    }else{
      setState({
        ...state,
        selected: null,
        highLight: {blue:[],green:[],red:[],yellow:[]}
      });
    }
  }
  function onDownRightClickHandler(event){
    const color = highLightOptions[highLightedColor]; // check if a key is pressed
    console.log(state.highLight);
    // remove the old color highLight if exists
    if(highLighted !== null){
      state.highLight[highLighted] = state.highLight[highLighted].filter((element) => element !== id);
    }

    // add or remove the new highLight
    if(highLighted === color){
      setHighLighted(null);
      state.highLight[highLighted] = state.highLight[highLighted].filter((element) => element !== id);
    }else{
      setHighLighted(color);
      state.highLight[color].push(id);
    }

    setState({
      ...state,
      highLight: state.highLight 
    });
  }
  
  return (
    <div
      onContextMenu={(e) => e.preventDefault()} // disable right click menu
      onMouseDown={(event) => {
        if (event.button === 0) { // Left-click detected
          onDownLeftClickHandler(event);
        } else if (event.button === 2) { // Right-click detected
          onDownRightClickHandler(event);
          // draw arrows logic here mouse down TODO
        }
      }}

/*
      onMouseUp={(event) => {
        let whiteIsPlaying = state.whiteIsPlaying;
        let selected = state.selected;
        let highLight = state.highLight;

        if (event.button === 0) {
          // Left-click detected
          if (
            state.selected === ""
          ) {
            if (state.selected !== sqName) {
              // CHECK IF THE MOVE IS VALID with api of stockfish to backend then update state TODO

              //console.log(state.leagalMoves,(state.selected.y-1)*8+state.selected.x-1)
              if(state.leagalMoves[state.selected]!== undefined){
              if (state.leagalMoves[state.selected].includes(sqName)) {
                const cordsX = {"a":1,"b":2,"c":3,"d":4,"e":5,"f":6,"g":7,"h":8};
                const x = cordsX[state.selected[0]];
                const y = parseInt(state.selected[1]);

                state.board[(pos.y - 1) * 8 + pos.x - 1] =
                  state.board[(y - 1) * 8 + x - 1];
                state.board[(y - 1) * 8 + x - 1] ="";
                whiteIsPlaying = !whiteIsPlaying; // this will be updated from the server not manualy
                selected = "";
              } else {
                selected = "";
              }
            }else {
              selected = "";
            }
            }
          }
          highLight.clear();

          setState({
            ...state,
            draggingPiece: { id: "", piece: "" },
            whiteIsPlaying: whiteIsPlaying,
            selected: selected,
            highLight: highLight,
          });
        } else if (event.button === 2) {
          // Right-click detected
          // draw arrows logic here mouse up
          if (state.highLight.has(posString)) {
            state.highLight.delete(posString);
            setState({ ...state, highLight: state.highLight });
            setHighLighted(state.highLight.has(posString));
          } else {
            state.highLight.add(posString);
            setState({ ...state, highLight: state.highLight });
            setHighLighted(state.highLight.has(posString));
          }
        }
      }}
      */

      className={`relative flex aspect-square w-[12.5%] select-none justify-center align-middle 
      ${(highLighted === null)?
        ((pos.x + pos.y) % 2 === 0
          ? selected
            ? "bg-green-light"
            : "bg-green-dark"
          : selected
          ? "bg-yellow-dark"
          : "bg-yellow-light"):
          `bg-${highLighted}-highlight-${(pos.x + pos.y) % 2 === 0?"dark":"light"}`
      }

  `}
>

      <span className="absolute -bottom-0.5 right-1 text-[15px] font-semibold">
        {((pos.y === 1 && whiteSide) || (pos.y === 8 && !whiteSide)) &&
          sqName[0]}
      </span>

      <span className="absolute left-0.5 top-0 text-[15px] text-xs font-semibold">
        {((pos.x === 1 && whiteSide) || (pos.x === 8 && !whiteSide)) && sqName[1]}
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

      <div className="absolute z-10 m-auto h-[100%] w-[100%] ">
        {(showPiece && piece !== "" ) && (
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
