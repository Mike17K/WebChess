import React, { useEffect } from 'react'

import credentials from "../../credentials.json"

import { useLocation } from 'react-router-dom';
import queryString from 'query-string';

import './GithubLoginButton.css';

// General functions for all sign in processes

function revokeServerToken(callback) {
    const session = JSON.parse(localStorage.getItem('session'));
    if(session === null) return;
    if(session.provider === undefined) return;
    if(session.profile === undefined) return;
    if(session.access_server_key === undefined) return;
    if(session.profile.id === undefined) return;

    // revoke the access tocken from server
    fetch('http://localhost:5050/api/users/token',{
        method:"DELETE",
        headers: {
            'token': session.access_server_key,
            'userid': session.profile.id
        }}).then(response =>{
            if(!response.ok){
                console.log("Something went wrong");
                return;
            } 
            callback();
            localStorage.removeItem('session');
        }).catch(err=> {
            console.log(err)
        }
    );

    }
    
    function getServerAccessTocken(code,provider,callback=(data)=>{}) {
        fetch('http://localhost:5050/api/users/token',{
            method:"GET",
            headers: {
                'code': code,
                "provider":provider
            }
        }).then(data => data.json()).then(data =>{
            // get access key from server
            callback(data);
        }).catch(err=> {
            console.log(err)
        }
    );
    }
    
    
    export default function GithubLoginButton({setJwt,userData,setUserData}) {    
        function fetchMyProfile(access_server_key,userId){
            console.log("fetchinig github profile 2")
        // fetching users profile 
        fetch(`http://localhost:5050/api/users/profile/${userId}/me`,{
            method:"GET",
            headers: {
                'access_server_key': access_server_key,
            }
        }).then(data => data.json()).then(profile =>{

            // got the profile data from server
            const session = JSON.parse(localStorage.getItem('session'));
            // update the session data with the profile data
            localStorage.setItem('session', JSON.stringify({...session,profile:profile}));

            setUserData(profile);
            setJwt(session.access_server_key);
            
        }).catch(err=> {
            console.log(err)
            // if the profile cant be accessed remove it from session
            const session = JSON.parse(localStorage.getItem('session'));
            localStorage.setItem('session', JSON.stringify({...session,profile:{},access_server_key:undefined,provider:undefined}));
        });
    }

    // handle sign out
    function handleSignOut(event) {
        event.preventDefault()
        revokeServerToken(()=>{
                console.log("Logged Out");
                    setJwt("");
                    setUserData({});
                });
    }

    
    // if there is session data from Github set them as profile data
    useEffect(() => {
        const session = JSON.parse(localStorage.getItem('session'));
        if(session!== null){
            if(session.provider !== undefined){
                if(session.provider === "Github") {
                    if(session.profile === undefined){
                        return;
                    }
                    fetchMyProfile(session.access_server_key,session.profile.id)
                    return;
                }
            }
        }
        /* eslint-disable react-hooks/exhaustive-deps */
    }, [])

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    const GITHUB_IDENTIFY_URL = `https://github.com/login/oauth/authorize?client_id=${credentials.GITHUB_CLIENT_ID}&redirect_uri=`;
    
    const location = useLocation();
    const queryParams = queryString.parse(location.search);
    
    useEffect(()=>{
        const session = JSON.parse(localStorage.getItem('session'));
        if(session !== null){
            if(queryParams.github_access_token === undefined) return;
        }

        getServerAccessTocken(queryParams.github_access_token,"Github",(data)=>{
            // get access key from server
            const {access_server_key /*,ttl*/ ,userId} = data;
    
            // store it localy
            const session = JSON.parse(localStorage.getItem('session'));
            // update the session with the access_server_key, provider
            localStorage.setItem('session', JSON.stringify({...session,access_server_key:access_server_key,provider:"Github"}));
            fetchMyProfile(access_server_key,userId);
            //window.location.href = 'http://localhost:3000/login'
            })
        
    /* eslint-disable react-hooks/exhaustive-deps */
    },[])
   ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  return (
      <>
        {
            (userData.authProvider === "Github" ) && (
        <button id="info" 
        className='github-button rounded relative'
        onClick={handleSignOut} >
        
        <img className="w-[22px] h-[22px] rounded-full ml-[10px]" src={`${userData.picture}`} alt="Discord Avatar" />

        <div className='block text-sm my-auto px-2 leading-[15px]'>
            <div className='block text-white text-[14px] font-bold text-start '>Log out</div>
            <div className='block text-white text-[12px] text-start'>{userData.name}</div>
        </div>
        
        <div className='mx-[10px] flex absolute right-0'>
        <svg width="25" height="25" viewBox="0 -5 90 110" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z" fill="#fff"/></svg>        
        </div>
    </button>
            )
        }
        {
            (userData.authProvider !== "Github" ) && (
        <button id="info" 
        className='github-button rounded'
        onClick={(e)=> window.location.href = GITHUB_IDENTIFY_URL } >
        <div className='mx-auto flex'>
        
        <svg width="25" height="25" viewBox="10 -5 90 110" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z" fill="#fff"/></svg>        
        
        <div className='block text-white text-sm my-auto px-2'>Log In with GitHub</div>
        </div>
    </button>
            )
        }
    </>
  )
}
