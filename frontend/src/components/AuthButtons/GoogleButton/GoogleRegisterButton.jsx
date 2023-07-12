import React, { useEffect } from 'react'
import credentials from "../../../credentials.json"
import './GoogleButton.css';
import outerRegisterProvider from "../../../hooks/outerProvider/outerRegisterProvider";

/* global google */
export default function GoogleRegisterButton(props) {    
   
    const [profile,signOut,createUserCallback] = outerRegisterProvider({provider:"Google"})

    // handle sign out
    function handleSignOut(event) {
        event.preventDefault()
        google.accounts.id.disableAutoSelect()
        google.accounts.id.revoke(localStorage.getItem("googleToken"));
        signOut();
    }    

    // get the access tocken from server
    async function getServerAccessTockenCallback(response) {
        createUserCallback({code:response.credential})
        };

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
    }, [])

  return (
    <>
        {
        profile.authProvider === "Google" && (
            <div onClick={handleSignOut}
            className='logout-button rounded relative'
            >
                <img src={`${profile.picture}`} alt="profile img" />
                <div className='flex text-white '>
                    <div className='flex flex-col text-white'>
                <span className=" text-[14px] font-bold">Αποσύνδεση</span>
                <span className=" text-[12px]">{profile.email}</span>
                    </div>
                </div>

                <div className="bg-white rounded-tr rounded-br w-[40px] aspect-square absolute right-[1px]">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/archive/5/53/20230305195326%21Google_%22G%22_Logo.svg" alt="" />
                </div>

                </div>
            )
        }
        {
        profile.authProvider !== "Google"  && (
            <div id="google_login_button"></div>
            )
        }

    </>
  )
}