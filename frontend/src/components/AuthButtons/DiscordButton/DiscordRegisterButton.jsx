import React, { useEffect } from 'react'

import credentials from "../../../credentials.json"

import { useLocation } from 'react-router-dom';
import queryString from 'query-string';

import './DiscordButton.css';

import outerRegisterProvider from "../../../hooks/outerProvider/outerRegisterProvider";

export default function DiscordRegisterButton(props) {    

    const [profile,signOut,createUserCallback] = outerRegisterProvider({provider:"Discord"});

    const DISCORD_IDENTIFY_URL = `https://discord.com/api/oauth2/authorize?client_id=${credentials.DISCORD_CLIENT_ID}&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Flogin%3Fprovider%3DDiscord&response_type=code&scope=identify`;
    
    const location = useLocation();
    const queryParams = queryString.parse(location.search);
    
    useEffect(()=>{
        if(queryParams.provider !== "Discord") return;
        if(queryParams.code === undefined) return;
        
        console.log("fetching discord profile")
        createUserCallback({code:queryParams.code},(profile)=>{
            window.location.href = 'http://localhost:3000/register'
        });
        
    /* eslint-disable react-hooks/exhaustive-deps */
    },[])
   
  return (
      <>
        {
            profile.authProvider !== "Discord" && (
        <button id="info" 
        className='discord-button rounded'
        onClick={(e)=> window.location.href = DISCORD_IDENTIFY_URL } >
        <div className='mx-auto flex'>
        
        <svg xmlns="http://www.w3.org/2000/svg" fill="white" width="25" height="25" viewBox="0 0 127.14 96.36">
            <defs>
            </defs>
            <g id="图层_2" data-name="图层 2">
                <g id="Discord_Logos" data-name="Discord Logos">
                    <g id="Discord_Logo_-_Large_-_White" data-name="Discord Logo - Large - White">
                        <path className="cls-1"
                            d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" />
                    </g>
                </g>
            </g>
        </svg>
    
        <div className='block text-white text-sm my-auto px-2'>Sign Up with Discord</div>
        </div>
    </button>
            )
        }
        {
            profile.authProvider === "Discord" && (
        <button id="info" 
        className='discord-button rounded relative'
        onClick={(e)=>signOut()} >
        {/*`https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`*/}
        <img className="w-[22px] h-[22px] rounded-full ml-[10px]" src={`${profile.picture}`} alt="Discord Avatar" />

        <div className='block text-sm my-auto px-2 leading-[15px]'>
            <div className='block text-white text-[14px] font-bold text-start '>Log out</div>
            <div className='block text-white text-[12px] text-start'>{profile.name}#{profile.discriminator}</div>
            
        </div>
        
        <div className='mx-[10px] flex absolute right-0'>
        
        <svg xmlns="http://www.w3.org/2000/svg" fill="white" width="22" height="22" viewBox="0 0 127.14 96.36">
            <defs>
            </defs>
            <g id="图层_2" data-name="图层 2">
                <g id="Discord_Logos" data-name="Discord Logos">
                    <g id="Discord_Logo_-_Large_-_White" data-name="Discord Logo - Large - White">
                        <path className="cls-1"
                            d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" />
                    </g>
                </g>
            </g>
        </svg>
        </div>
    </button>
            )
        }
    </>
  )
}


//0 0 127.14 96.36