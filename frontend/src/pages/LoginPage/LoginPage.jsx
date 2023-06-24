import React, { useState } from 'react'
import GoogleLoginButton from "../../components/GoogleLoginButton/GoogleLoginButton"
import DiscordLoginButton from "../../components/DiscordLoginButton/DiscordLoginButton"
import GithubLoginButton from "../../components/GithubLoginButton/GithubLoginButton"


export default function LoginPage(props) {
  const [userData,setUserData] = useState({});
  const [jwt,setJwt] = useState("");
  
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

    function onSubmitHandle(e){
      e.preventDefault();

      const formData = new FormData(e.target);
      const name = formData.get('name');
      const password = formData.get('password');
      console.log("fields: ", name, password);

      if(!name || !password) return;

      // TODO make request to server to validate the inputs
      fetch('http://localhost:5050/api/users/token', 
      {
        method: 'GET',
        headers: {
          'provider': 'CustomForm',
          "name": name,
          "password": password
          }
      })
      .then(response => response.json())
      .then((data)=>{
        // get access key from server
        const {access_server_key /*,ttl*/ ,userId} = data;

        // store it localy
        const session = JSON.parse(localStorage.getItem('session'));
        // update the session with the access_server_key, provider
        localStorage.setItem('session', JSON.stringify({...session,access_server_key:access_server_key,provider:"Google"}));
        fetchMyProfile(access_server_key,userId);
      })
      .catch((error) => {
        console.error('Error:', error);
      });

      e.target.reset(); // clear form
    }

  return (
    <>
   <section >
  <div className="flex flex-col items-center justify-center h-screen">
    <h1 className="text-4xl font-bold mb-4">Login</h1>
    <p className="text-gray-500">Login to your account</p>
<form onSubmit={onSubmitHandle} className="flex flex-col w-1/2">
  <table className="w-full">
    <tbody>
      <tr>
        <td className="py-2">
          <label htmlFor="name" className="text-gray-700">User Name</label>
        </td>
        <td className="py-2">
          <input pattern="[A-Za-z0-9]+" required  type="text" id="name" name="name" placeholder="Username" className="border border-gray-300 px-2 py-1 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </td>
      </tr>
      <tr>
        <td className="py-2">
          <label htmlFor="password" className="text-gray-700">Password</label>
        </td>
        <td className="py-2">
          <input pattern="[A-Za-z0-9]+" required type="password" id="password" name="password" placeholder="Password" className="border border-gray-300 px-2 py-1 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </td>
      </tr>
    </tbody>
  </table>
  <button type="submit" className="mx-auto w-[50%] bg-blue-500 text-white px-4 py-2 rounded-md mt-4 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">Sign In</button>
</form>

    <p className="text-gray-500 mt-4">Or login with</p>
    <div className='w-3/5 h-1 border-t border-gray-300 my-4'></div>

    <div className='my-2 flex flex-col gap-2'>
    <GoogleLoginButton setJwt={setJwt} userData={userData} setUserData={setUserData}/>
    <DiscordLoginButton setJwt={setJwt} userData={userData} setUserData={setUserData}/>
    <GithubLoginButton setJwt={setJwt} userData={userData} setUserData={setUserData}/>
    </div>
    
    </div>
   </section>
    </>
  )
}
