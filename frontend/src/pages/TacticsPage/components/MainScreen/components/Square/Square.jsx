import React, { useEffect, useState } from 'react'

export function Square({pos,state,setState,whiteSide}){
        const piece = state.board[(pos.y-1)*8+pos.x-1];
        const [selected,setSelected] = useState(false);
        const [leagalMove,setLeagalMove] = useState(false);
        const [itsCapture,setItsCapturePiece] = useState(false);

        useEffect(()=>{
              setSelected(state.selected.x === pos.x && state.selected.y === pos.y);

        },[state.selected,pos]);

        useEffect(()=>{
          setLeagalMove(state.leagalMoves.includes((pos.y-1)*8+pos.x-1))
          setItsCapturePiece(state.leagalMoves.includes((pos.y-1)*8+pos.x-1) && piece!=="")
        },[state.leagalMoves,pos,piece]);

    return <div
    onContextMenu={(e)=> e.preventDefault()} // disable right click menu
    
    onMouseDown={(event)=> {
      console.log(state)
      if (event.button === 0) { // Left-click detected
        if(piece==="") return ;
        if(state.selected.x===undefined || state.selected.y===undefined){
          if(piece.substring(0,1) === (state.whiteIsPlaying?"b":"w")) return ; // keep the turn
          // fetch the leagal moves from backend with api of stockfish TODO
          const leagalMoves = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,
            16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,
            32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,
            48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63
          ]
          setState({...state,leagalMoves:leagalMoves ,selected:{x:pos.x,y:pos.y}})
        }
      }else if (event.button === 2) { // Right-click detected 
        // draw arrows logic here mouse down
      }
      
    }}
    
    onMouseUp={(event)=> {
    if (event.button === 0) { // Left-click detected
      if(state.selected.x!==undefined && state.selected.y!==undefined){
        if(state.selected.x!==pos.x || state.selected.y!==pos.y){ 
          // CHECK IF THE MOVE IS VALID with api of stockfish to backend then update state TODO
        
          //console.log(state.leagalMoves,(state.selected.y-1)*8+state.selected.x-1)
        
          if(leagalMove){
            state.board[(pos.y-1)*8+pos.x-1] = state.board[(state.selected.y-1)*8+state.selected.x-1];
            state.board[(state.selected.y-1)*8+state.selected.x-1] = "";
            setState({...state,whiteIsPlaying:!state.whiteIsPlaying,selected:{},leagalMoves:[]})
          }else{
            setState({...state,selected:{},leagalMoves:[]})
          }
        }
      
      }else if (event.button === 2) { // Right-click detected 
      // draw arrows logic here mouse up
    }

    }
    }}

    
    className={`select-none relative flex justify-center align-middle w-[12.5%] aspect-square 
    ${(pos.x+pos.y+1)%2===0 ?selected?"bg-green-light":"bg-green-dark":selected?"bg-yellow-dark":"bg-yellow-light"}
  `}>
        <span className="absolute -bottom-0.5 right-1 text-[15px] font-semibold">
        {
            ((pos.y===1 && whiteSide ) || (pos.y===8 && !whiteSide )) && (['a','b','c','d','e','f','g','h'][pos.x-1])
        }
        </span>
        <span className="absolute top-0 left-0.5 text-xs text-[15px] font-semibold">
        {
            ((pos.x===1 && whiteSide ) || (pos.x===8 && !whiteSide )) && (pos.y)
        }
        </span>
        
        <div className={`z-0 absolute
        ${leagalMove?
            (itsCapture?`w-full h-full rounded-full border-8 
        ${(pos.x+pos.y+1)%2===0 ?"border-capture-dark":"border-capture-light"}`:
        `${(pos.x+pos.y+1)%2===0 ?"bg-attack-dark":"bg-attack-light"}
        w-[30%] h-[30%] rounded-full top-[35%]
         `):""}`}></div>
        
        <div className='z-10 w-[100%] h-[100%] m-auto '>
        {
            piece!=="" && (
                <img 
                draggable={false}
                src={window.location.origin + `/assets/pieces/${piece}.png`} alt="piece icon" className='w-full h-full'/>
            )
        }
        </div>
    </div>;
}
