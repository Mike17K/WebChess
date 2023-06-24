import React, { useEffect } from 'react'
import credentials from "../../credentials.json"
//import google from 'google';
import './GoogleLoginButton.css';


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
    );;

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


/* global google */
export default function GoogleLoginButton({setJwt,userData,setUserData}) {
    // get profile data from server
    function fetchMyProfile(access_server_key,userId){
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
        google.accounts.id.disableAutoSelect()
        google.accounts.id.revoke(localStorage.getItem("googleToken"),()=>{
            revokeServerToken(()=>{
                console.log("Logged Out");
                    setJwt("");
                    setUserData({});
                });
        })

    }    

    // get the access tocken from server
    async function getServerAccessTockenCallback(response) {
        getServerAccessTocken(response.credential,"Google",(data)=>{
            // get access key from server
            const {access_server_key /*,ttl*/ ,userId} = data;

            // store it localy
            const session = JSON.parse(localStorage.getItem('session'));
            // update the session with the access_server_key, provider
            localStorage.setItem('session', JSON.stringify({...session,access_server_key:access_server_key,provider:"Google"}));
            fetchMyProfile(access_server_key,userId);
            })
        };
    
    // if there is session data from google set them as profile data
    useEffect(() => {
        const session = JSON.parse(localStorage.getItem('session'));
        if(session!== null){
            if(session.provider !== undefined){
                if(session.provider === "Google") {
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


    useEffect(() => {
        
        if(credentials.GOOGLE_CLIENT_ID === undefined) {
            console.error("Google Client ID is undefined in the /src/credentials.json file")
            return
        }

        google.accounts.id.initialize({
            client_id: credentials.GOOGLE_CLIENT_ID,
            callback: getServerAccessTockenCallback,
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
