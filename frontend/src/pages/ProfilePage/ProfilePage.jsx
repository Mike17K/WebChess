import React, { useState } from 'react'
import { useParams } from 'react-router-dom';
import { store } from '../../redux/store';
import RatingGraph from './RatingGraph/RatingGraph.jsx';

export default function ProfilePage() {
  const {profileid} = useParams();
  const profile = store.getState().profile;

  /*
useEffect(() => {   
    fetch(`http://localhost:5050/api/profile/${profileid}`, {
        method: 'GET',
        headers: {
            'profileid': profile.id,
            'accessserverkey': profile.access_server_key,
        },
    }).then(response => response.json()).then(data => {
        if(data.error){
            console.log(data.error);
            return;
        }
        console.log(data);
        setProfileData(data);
    }).catch((error) => {
        console.error('Error:', error);
    });
},[]);
*/


  return <>
  <div className="flex items-center justify-center ">
    <div className='max-w-6xl w-full mt-[100px] flex gap-4 justify-center align-middle'>
        <div className='w-[80%] flex flex-col gap-4 '>
            <div className='bg-main-black rounded p-4 flex gap-4'>
                <img src={`http://localhost:3000/assets/icons/profiles/profile-${profile.picture || "0"}.png`} alt='avatar' className='w-[200px] h-[200px] object-cover' />
                <div className='w-[40%]'>
                    <div className='text-[#ffffff] font-bold text-xl mt-4'>{profile.name}</div>
                    <div className='text-[#ffffff] font-bold text-xl mt-4'>Rating: 1200</div>
                    <div className='text-[#ffffff] font-bold text-xl mt-4'>Wins: 0</div>
                    <div className='text-[#ffffff] font-bold text-xl mt-4'>Losses: 0</div>
                </div>
                <div className='w-full rounded bg-white'>
                    {/* here is going to be a graph */}
                    <RatingGraph />
                </div>
            </div>
            <div className='flex flex-col gap-4'>
                <p className='text-[2rem]'>Games History</p>
                <div className='w-full h-[100px] bg-main-black rounded p-4 '></div>
            </div>
        </div>
        <div className='w-[20%] bg-main-black rounded'>b</div>            
    </div>
  </div>
  </>;
}
