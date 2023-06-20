import React, { useEffect } from 'react'
import credentials from "../../credentials.json"
//import google from 'google';
import './GoogleLoginButton.css';

/* global google */
export default function GoogleLoginButton({setJwt,userData,setUserData}) {

    function handleSignOut(event) {
        event.preventDefault()
        google.accounts.id.disableAutoSelect()
        google.accounts.id.revoke(localStorage.getItem("googleToken"),()=>{

            const session = JSON.parse(localStorage.getItem('session'));
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
                    
                    console.log("Logged Out");
                    setJwt("");
                    setUserData({});
                    localStorage.removeItem('session');
                });
                
            })
    }    

    async function getServerAccessTocken(response) {
        fetch('http://localhost:5050/api/users/token',{
            method:"GET",
            headers: {
                'token': response.credential,
                "provider":"Google"
            }
            }).then(data => data.json()).then(data =>{
                // get access key from server
                const {access_server_key,ttl,userId} = data;
                console.log(access_server_key,ttl);
                // store it localy
                const session = JSON.parse(localStorage.getItem('session'));
                // update the session with the access_server_key, provider
                localStorage.setItem('session', JSON.stringify({...session,access_server_key:access_server_key,provider:"Google"}));
                fetchMyProfile(access_server_key,userId);
                })
            };

    async function fetchMyProfile(access_server_key,userId){
        // fetching users profile
        fetch(`http://localhost:5050/api/users/profile/${userId}/me`,{
            method:"GET",
            headers: {
                'access_server_key': access_server_key,
            }
        }).then(data => data.json()).then(profile =>{
            // got the profile data from server
            console.log(profile);
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
    
    useEffect(() => {
        // if there is session data from google set them as profile data
        const session = JSON.parse(localStorage.getItem('session'));
        if(session!== null){
            if(session.provider !== undefined){
                if(session.provider === "Google") {
                    fetchMyProfile(session.access_server_key,session.profile.userId)
                    return;
                }
            }
        }
        /* eslint-disable react-hooks/exhaustive-deps */
    }, [])


    useEffect(() => {
        
        if(credentials.GOOGLE_CLIENT_ID === undefined) {
            console.error("Google Client ID is undefined in the /src/credentials.json file")
            return
        }

        google.accounts.id.initialize({
            client_id: credentials.GOOGLE_CLIENT_ID,
            callback: getServerAccessTocken,
            auto_select: true,
            cancel_on_tap_outside: false
        })
        google.accounts.id.renderButton(
            document.getElementById("google_login_button"),
            {
                theme: "filled_blue",
                size: "large",
                text: "continue_with",
                shape: "rectangular",
                width: "long"
            }
        )

        //google.accounts.id.prompt();
    /* eslint-disable react-hooks/exhaustive-deps */
    }, [userData])

  return (
    <>
        {
        userData.authProvider === "Google" && (
            <div onClick={handleSignOut}
            className='logout-button rounded relative'
            >
                <img src={`${userData.picture}`} alt="profile img" />
                <div className='flex text-white '>
                    <div className='flex flex-col text-white'>
                <span className=" text-[14px] font-bold">Αποσύνδεση</span>
                <span className=" text-[12px]">{userData.email}</span>
                    </div>
                </div>

                <div className="bg-white rounded-tr rounded-br w-[40px] aspect-square absolute right-[1px]">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/archive/5/53/20230305195326%21Google_%22G%22_Logo.svg" alt="" />
                </div>

                </div>
            )
        }
        {
        userData.authProvider !== "Google"  && (
            <div id="google_login_button"></div>
            )
        }

    </>
  )
}
