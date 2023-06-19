import React, { useEffect } from 'react'
import jwt_decode from "jwt-decode";
import credentials from "../../credentials.json"
import './GoogleLoginButton.css';

export default function GoogleLoginButton({setJwt,userData,setUserData}) {

    function handleSignOut(event) {
        /* global google */
        event.preventDefault()
        google.accounts.id.disableAutoSelect()
        google.accounts.id.revoke(localStorage.getItem("googleToken"), handleSignOutCallback)
    }
    function handleSignOutCallback() {
        setJwt("");
        setUserData({});
        localStorage.removeItem('session');
    }
    

    function handleCallbackResponse(response) {
        console.log(response);
        if (response.credential) {
            setJwt(response.credential)
            const decoded = jwt_decode(response.credential)
            setUserData(decoded)
            localStorage.removeItem('session');
            localStorage.setItem('session', JSON.stringify({...decoded,access_token:response.credential,provider:"Google"}));
            // this is the user object
            // console.log(decoded);
        }
    }

    useEffect(() => {
        // if user is logged in
        if(userData.provider !== undefined){
            if(userData.provider === "Google") return;
        }
        
        if(localStorage.getItem('session') !== null){
            const session = JSON.parse(localStorage.getItem('session'));
            if(session.provider !== "Google") return;
            setJwt(session.access_token);
            setUserData(session);
            return;
        }
    }, [userData,setJwt,setUserData])


    useEffect(() => {
        
        if(credentials.GOOGLE_CLIENT_ID === undefined) {
            console.error("Google Client ID is undefined in the /src/credentials.json file")
            return
        }

        /* global google */
        google.accounts.id.initialize({
            client_id: credentials.GOOGLE_CLIENT_ID,
            callback: handleCallbackResponse,
            auto_select: true,
            cancel_on_tap_outside: false
        })
        /* global google */
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
        userData.provider === "Google" && (
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
        userData.provider !== "Google"  && (
            <div id="google_login_button"></div>
            )
        }

    </>
  )
}
