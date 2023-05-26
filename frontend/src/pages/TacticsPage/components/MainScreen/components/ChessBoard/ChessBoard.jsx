import React, { useEffect, useState } from 'react'

function Square({pos,whiteSide,piece}){
        
    return <div className={`relative flex justify-center align-middle w-[12.5%] aspect-square ${(pos.x+pos.y+1)%2===0 ?" bg-stone-600":"bg-white"}`}>
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
        <div className='w-5/6 h-5/6 m-auto '>
        {
            piece!=="" && (
                <img src={window.location.origin + `/assets/pieces/${piece}.png`} alt="piece icon" className='w-full h-full'/>
            )
        }
        </div>
    </div>;
}

const board = [
    "wR","wN","wB","wK","wQ","wB","wN","wR",
    "wp","wp","wp","wp","wp","wp","wp","wp",
    "","","","","","","","",
    "","","","","","","","",
    "","","","","","","","",
    "","","","","","","","",
    "bp","bp","bp","bp","bp","bp","bp","bp",
    "bR","bN","bB","bK","bQ","bB","bN","bR",
]

export default function ChessBoard({className,whiteSide}) {
    const [squares, setSquares] = useState([])

    useEffect(()=>{
        let sq=[];
        if(!whiteSide){            

            for (let r = 1; r <=8; r++) {
                for (let c = 8; c >=1; c--) {
                    sq.push(<Square key={r*8+c} piece={board[(r-1)*8+c-1]} pos={{x: c, y: r}} whiteSide={whiteSide}/>);
                }
            }
        }else{
            for (let r = 8; r >= 1; r--) {
                for (let c = 1; c <=8; c++) {
                    sq.push(<Square key={r*8+c} piece={board[(r-1)*8+c-1]} pos={{x: c, y: r}} whiteSide={whiteSide}/>);
                }
            }
        }

            

       setSquares(sq)

    },[whiteSide])

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
