import React from 'react'
import { Link } from 'react-router-dom'

export default function PlayerLayout({bottomPlayer,player,timeRemaining}) {
    // player: {picture,name,rating,url}
  return (
    <div className={`w-full ${bottomPlayer?"mt-[18px]":"mb-[18px]"} relative `}>
        <Link 
        className={`h-[50px] w-[150px] absolute ${bottomPlayer?"top-0":"bottom-0"} left-0 p-1 shadow-orange-400 shadow-md hover:border-2 border-4 rounded-full transition-all flex bg-white`}
        to={player.url || "http://localhost:3000/profile/me"}
        >
            <div className='h-full aspect-square bg-[#eeb05e59] rounded-full overflow-hidden flex justify-center items-center'>
            <img src={`${process.env.PUBLIC_URL}/assets/icons/profiles/profile-${player.picture}.png` /* TODO profile pic */} alt="" className='w-full h-full my-auto'/>
            </div>
            <div className='mx-2 h-full flex flex-col items-start'>
            <p className='text-[12px] text-[#419736] font-bold'>{player.name}</p>
            <p className='text-[12px]'>Rapid: <span>{player.rating}</span></p>
            </div>

        </Link>

        <div className={`h-[40px] w-[100px] absolute ${bottomPlayer?"top-0":"bottom-0"} right-0 rounded-lg shadow-md shadow-orange-400 border-4 border-grey flex justify-center items-center gap-2 my-auto bg-white`}>
            <p className='text-[#ff8e8e]'>{timeRemaining}</p>
        </div>
    </div>
  )
}