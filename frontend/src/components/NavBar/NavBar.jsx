import React, { useState } from 'react'
import './NavBar.css'
import { Link } from 'react-router-dom'
import {store} from '../../redux/store'

export default function NavBar() {
    const [profile,setProfile] = useState(store.getState().profile )
    store.subscribe(()=>setProfile(store.getState().profile))
    console.log("dsfjkahfgd: ",profile);
  return (
    <div className="fixed w-full h-[40px] inset-0 flex items-center justify-center z-50">
        <div className='z-50 fixed top-0 max-w-6xl w-full h-[40px] bg-main-black opacity-90 shadow-md shadow-black' >
            <div className='flex justify-between items-center h-full px-4'>
                <Link to='/'>
                    <div className='text-[#ffffff] font-bold text-xl'>Logo</div>
                </Link>
                
                <span className='w-1/2'>
                <Link to='/tactics'>
                    <div className='text-[#ffffff] font-bold text-xl'>Tactics</div>
                </Link>
                </span>

                <div className='flex items-center'>
                    {
                        profile.name ? 
                        <>
                        <span onClick={(e)=>{
                            store.dispatch({type:"clearProfile"})
                        }}
                        className='text-[#ffffff] font-bold text-xl cursor-pointer mr-4'
                        >Log Out</span>
                        <Link to='/profile/me'>
                            <div className='text-[#ffffff] font-bold text-xl
                            w-[40px] aspect-w-1 aspect-h-1 rounded-full overflow-hidden
                            bg-main-white
                            hover:border-4 hover:border-[#000000]
                            '>
                                <img 
                                src={profile.avatar || `http://localhost:3000/assets/icons/profiles/profile-${profile.picture || 0}.png`} 
                                alt='avatar' 
                                className='w-full h-full object-cover' 
                                />
                            </div>
                        </Link>
                        </>
                        :
                        <>
                        <Link to='/login'>
                            <div className='text-[#ffffff] font-bold text-xl mr-2'>Login</div>
                        </Link>
                        <Link to='/register'>
                            <div className='text-[#ffffff] font-bold text-xl'>Register</div>
                        </Link>
                        </>
                    }
                </div>
            </div>
        </div>
    </div>
  )
}
