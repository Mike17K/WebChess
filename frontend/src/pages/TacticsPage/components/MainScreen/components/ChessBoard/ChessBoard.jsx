import React, { useEffect, useState } from 'react'

function Square({pos}){
    return <div className={`w-[12.5%] aspect-square ${(pos.x+pos.y)%2===0 ?" bg-stone-600":"bg-white"}`}>

    </div>;
}

function setUpSquares(){
    let sq=[];
    for (let c = 1; c <= 8; c++) {
        for (let r = 1; r <= 8; r++) {
        sq.push(<Square key={`${c+r*8}`} pos={{x: c, y: r}}/>);
        }
    }
    return sq;
}

export default function ChessBoard({className,whiteSide}) {
    const [squares, setSquares] = useState(setUpSquares())

    useEffect(()=>{
        if(whiteSide){
            setSquares(squares.reverse());
        }

    },[whiteSide,squares])

  return (
    <>
    <div className={`mx-auto my-3 w-4/5 aspect-square 
    border-4 border-black bg-white flex flex-wrap justify-center align-middle ${className}`}>
    
    {squares}

    </div>
    
    </>
  )
}
