import React, { useState } from 'react'
import GoogleLoginButton from "../../components/GoogleLoginButton/GoogleLoginButton"
import DiscordLoginButton from "../../components/DiscordLoginButton/DiscordLoginButton"
import GithubLoginButton from "../../components/GithubLoginButton/GithubLoginButton"


export default function LoginPage(props) {
    const [userData,setUserData] = useState({});
    const [jwt,setJwt] = useState("");

    function onSubmitHandle(e){
      e.preventDefault(); // for not refreshing the page
      alert("ok");

      // TODO make request to server to validate the inputs

      // TODO recieve from server your access tocken

      // TODO update the redux store with user data


      e.target.reset(); // clear form
    }

  return (
    <>
    <div>LoginPage</div>
    <form onSubmit={onSubmitHandle} className="flex flex-col w-[50%]">
  <table>
    <tbody>
      <tr>
        <td>
          <label htmlFor="name">User Name</label>
        </td>
        <td>
          <input type="text" name="name" placeholder="Username" />
        </td>
      </tr>
      <tr>
        <td>
          <label htmlFor="password">Password</label>
        </td>
        <td>
          <input type="password" name="password" placeholder="Password" />
        </td>
      </tr>
      <tr>
        <td>
          <label htmlFor="validate_password">Validate Password</label>
        </td>
        <td>
          <input type="password" name="validate_password" placeholder="Password" />
        </td>
      </tr>
    </tbody>
  </table>
  <button type="submit">Sign In</button>
</form>


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
