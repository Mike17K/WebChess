import React, { useEffect } from 'react'
import jwt_decode from "jwt-decode";

export default function LoginPage() {
    /*
    function handleSignOut(event) {
        // event.preventDefault()
        // google.accounts.id.disableAutoSelect()
        // google.accounts.id.revoke(localStorage.getItem("googleToken"), handleSignOutCallback)

    }
    */

    function handleCallbackResponse(response) {
        console.log(response);
        if (response.credential) {
            const decoded = jwt_decode(response.credential)
            console.log(decoded);
        }
    }

    useEffect(() => {
        // TODO load from .env
        /* global google */
        google.accounts.id.initialize({
            client_id: "540301766129-eudscak7h52nh73pq4r4iusg0fbfbk3b.apps.googleusercontent.com",//process.env.GOOGLE_CLIENT_ID,
            callback: handleCallbackResponse,
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

        google.accounts.id.prompt();

    }, [])

  return (
    <>
    <div>LoginPage</div>
    <div id="google_login_button"></div>
    </>
  )
}
