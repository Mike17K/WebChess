import React, { useEffect, useState } from 'react';

export default function MoveVoterWidget() {
  const [votedMove,setVotedMove] = useState("");
  const [votedMoves, setVotedMoves] = useState([
    {move: "e4", votes: 50},
    {move: "e5", votes: 48},
    {move: "Nf3", votes: 40},
    {move: "Nc6", votes: 30}
  ]); // [{move: "e4", votes: 0}, {move: "e5", votes: 0}
  
  return (
<div className='absolute -left-[200px] w-[150px] h-[400px] rounded-lg shadow-lg shadow-orange-400 border-4 border-grey gap-2 my-auto p-2 no-scrollbar overflow-y-auto bg-white'>
        <div className='w-full text-center transition-all'>
          {
            votedMoves.map((move) => (
              <button className={`${(move.move === votedMove)?"border-2 border-green-500 rounded-md":""} shadow-md shadow-grey bg-[#fff9e7] w-full h-[30px] mb-4 px-4 flex justify-between group hover:border-2 `}
              onClick={(e)=>{
                setVotedMove(move.move);
                // TODO send vote to server
              }}
              >
                <p className='text-[#3d6ac4] my-auto'>{move.move}</p>
                <img src={`${process.env.PUBLIC_URL}/assets/icons/vote.png`} alt="" className='hidden w-0 h-[20px] text-center my-auto group-hover:block group-hover:w-[20px] ' /* add select styles TODO */ />
                <p className='text-[#3d6ac4] my-auto'>{move.votes+((move.move == votedMove)?1:0)}</p>
              </button>
                )
            ) 
          }
        </div>
      </div>
    )
}
