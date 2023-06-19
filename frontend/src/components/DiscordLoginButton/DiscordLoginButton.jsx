import React, { useEffect, useState } from 'react'

import { useLocation } from 'react-router-dom';
import queryString from 'query-string';

import './DiscordLoginButton.css';

export default function DiscordLoginButton({setJwt,userData,setUserData}) {
    const [accessToken,setAccessToken] = useState("");

    const DISCORD_ENDPOINT = 'https://discord.com/api/v10';
    const DISCORD_IDENTIFY_URL = 'https://discord.com/api/oauth2/authorize?client_id=1119090598104797244&redirect_uri=http%3A%2F%2Flocalhost%3A5050%2Fapi%2Fusers%2Fauth%2Fdiscord%2Fredirect&response_type=code&scope=identify'
    
    const location = useLocation();
    const queryParams = queryString.parse(location.search);
    
    useEffect(()=>{
        const session = JSON.parse(localStorage.getItem('session'));
        if(session !== null){
            if(session.provider === "Discord" && queryParams.access_token === undefined) {
                setUserData(session);
                return;
            }
        }
    },[]);

    useEffect(()=>{
        const session = JSON.parse(localStorage.getItem('session'));
        if(session !== null){
            if(queryParams.access_token === undefined) return;
        }

        if(Object.keys(userData).length !== 0) return ;
        console.log("Fetching user data Discord",userData)
        fetch(`${DISCORD_ENDPOINT}/users/@me`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${queryParams.access_token}`
        }
      }).then(response=> response.json()).then((data) => {
        // do something
        setUserData(data)
        setJwt(queryParams.access_token)
        setAccessToken(queryParams.access_token)
        localStorage.removeItem('session');
        localStorage.setItem('session', JSON.stringify({...data,access_token:queryParams.access_token,provider:"Discord"}));
        window.location.href = 'http://localhost:3000/login';
      }).catch(err => {
        console.log(err);
    });
    /* eslint-disable react-hooks/exhaustive-deps */
    
    },[userData])
    
       // for discord logout 
    function logout(e){       
        fetch(`http://localhost:5050/api/users/auth/discord/logout`, {
            method: 'GET',
            headers: {
                'token': accessToken
            }
        }).then(response=> {
            if(response.status !== 200) return;
            setJwt("");
            setUserData({});
            localStorage.removeItem('session');
            
        }).catch(err => {
            console.log(err);
        }); 
    }

  return (
      <>
        {
            userData.id === undefined && (
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
    
        <div className='block text-white text-sm my-auto px-2'>Log In with Discord</div>
        </div>
    </button>
            )
        }
        {
            userData.id !== undefined && (
        <button id="info" 
        className='discord-button rounded relative'
        onClick={logout} >
        
        <img className="w-[22px] h-[22px] rounded-full ml-[10px]" src={`https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png`} alt="Discord Avatar" />

        <div className='block text-sm my-auto px-2 leading-[15px]'>
            <div className='block text-white text-[14px] font-bold text-start '>Log out</div>
            <div className='block text-white text-[12px] text-start'>{userData.username}#{userData.discriminator}</div>
            
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