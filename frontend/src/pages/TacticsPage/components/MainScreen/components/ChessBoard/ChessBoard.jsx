import React, { useEffect, useState } from 'react'
import { Square } from '../Square/Square'

function fenToPieceNamesArray(fen, board) {
    if(fen===undefined) return;

    const fenParts = fen.split(' ');
    const piecePlacement = fenParts[0];
  
    const rows = piecePlacement.split('/');
    
    for (let r = 0; r < rows.length; r++) {
      let colIndex = 0;
  
      for (let j = 0; j < rows[r].length; j++) {
        const char = rows[r][j];
        
        if (!isNaN(parseInt(char, 10))) {
          for(let i=0; i<parseInt(char, 10); i++) {
            board[8*r+colIndex] = ""
            colIndex++;
          }
          continue
        } 

        board[8*r+colIndex] = (/[A-Z\W]/.test(char)?"w":"b") + char.toUpperCase();
        colIndex++;
      }
    }
  
  }
  
  
  
  export default function ChessBoard({fen,className,whiteSide}) {
    const [squares, setSquares] = useState([])
    const [state, setState] = useState({selected:{},board:[
      "wR", "wN", "wB", "wK", "wQ", "wB", "wN", "wR",
      "wp", "wp", "wp", "wp", "wp", "wp", "wp", "wp",
      "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "",
      "bp", "bp", "bp", "bp", "bp", "bp", "bp", "bp",
      "bR", "bN", "bB", "bK", "bQ", "bB", "bN", "bR",
    ],
    whiteIsPlaying:true,
    leagalMoves:[]})

    
    useEffect(()=>{
      let tmp_board = [];
      fenToPieceNamesArray(fen,tmp_board);
      setState(prevState => {return {...prevState ,board:tmp_board}});
    },[fen])

      
    useEffect(()=>{
        let sq=[];
        if(!whiteSide){
            for (let r = 1; r <=8; r++) {
                for (let c = 8; c >=1; c--) {
                    sq.push(<Square state={state} setState={setState} key={r*8+c} pos={{x: c, y: r}} whiteSide={whiteSide}/>);
                }
            }
        }else{
            for (let r = 8; r >= 1; r--) {
                for (let c = 1; c <=8; c++) {
                    sq.push(<Square state={state} setState={setState} key={r*8+c} pos={{x: c, y: r}} whiteSide={whiteSide}/>);
                }
            }
        }
 setSquares(sq)

    },[whiteSide,state])

  return (
    <>
    <div className={`mx-auto my-3 w-full aspect-square 
    border-4 border-black bg-white flex flex-wrap justify-center align-middle ${className}`}>
    
    {
        squares
    }

    </div>
    
    </>
  )
}
