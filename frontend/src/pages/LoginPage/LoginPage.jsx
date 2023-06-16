import React, { useState } from 'react'
import GoogleLoginButton from "../../components/GoogleLoginButton/GoogleLoginButton"
import DiscordLoginButton from "../../components/DiscordLoginButton/DiscordLoginButton"


export default function LoginPage(props) {
    const [userData,setUserData] = useState({});
    const [jwt,setJwt] = useState("");

  return (
    <>
    <div>LoginPage</div>
    <GoogleLoginButton setJwt={setJwt} setUserData={setUserData}/>
    <DiscordLoginButton setJwt={setJwt} setUserData={setUserData}/>
    <br />
    {JSON.stringify(userData)}
    <br />
    {jwt}
    </>
  )
}
