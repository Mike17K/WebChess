import React, { useState } from 'react'
import GoogleLoginButton from "../../components/GoogleLoginButton/GoogleLoginButton"
import DiscordLoginButton from "../../components/DiscordLoginButton/DiscordLoginButton"
import GithubLoginButton from "../../components/GithubLoginButton/GithubLoginButton"


export default function LoginPage(props) {
    const [userData,setUserData] = useState({});
    const [jwt,setJwt] = useState("");

  return (
    <>
    <div>LoginPage</div>
    <GoogleLoginButton setJwt={setJwt} userData={userData} setUserData={setUserData}/>
    <DiscordLoginButton setJwt={setJwt} userData={userData} setUserData={setUserData}/>
    <GithubLoginButton setJwt={setJwt} userData={userData} setUserData={setUserData}/>
    
    <br />
    {JSON.stringify(userData)}
    <br />
    {jwt}

    </>
  )
}
