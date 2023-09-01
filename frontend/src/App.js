import { BrowserRouter, Routes, Route } from "react-router-dom";

import NavBar from "./components/NavBar/NavBar.jsx";

import TacticsPage from "./pages/TacticsPage/TacticsPage.jsx";
import AdminPage from "./pages/AdminPage/AdminPage.jsx";
import LoginPage from "./pages/LoginPage/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage/RegisterPage.jsx";
import GamePage from "./pages/GamePage/GamePage.jsx";
import HomePage from "./pages/HomePage/HomePage.jsx";

import { store } from "./redux/store.js";
import { useEffect } from "react";
import ProfilePage from "./pages/ProfilePage/ProfilePage.jsx";


async function refreshAccessServerKey(){
  console.log("refreshed access_server_key...");
  const profile = store.getState().profile;
  const userId = profile.id;
  const refresh_token = profile.refresh_token;

  if (!userId || !refresh_token) return console.log("Error: ",userId,refresh_token);

  const res = await fetch('http://localhost:5050/api/users/refreshAccessServerKey', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({userId:userId,refresh_token:refresh_token})
  }).then(response => response.json()).catch(err => console.log(err));

  if(!res) {
    // store.dispatch({type:"clearProfile"});
    return console.log("Error: ",res);
  }

  const {access_server_key,ttl} = res;

  if(!access_server_key || !ttl) {
    return console.log("Error: ",access_server_key,ttl);
  }
  // update the access_server_key in the redux store

  store.dispatch({type:"updateProfile",profile:{access_server_key:access_server_key,ttl:ttl + Date.now()}});

  const timeToWait = ttl - 1000;
  console.log("timeToWait: ",timeToWait);
  setTimeout(() => {
    refreshAccessServerKey();
  }
  ,timeToWait);
}

function App(props) {

  useEffect(() => {
    const profile = store.getState().profile;
    if(!profile.ttl) return;
    refreshAccessServerKey();

  },[]);
  
  return (
    <>
      <BrowserRouter basename="/">
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tactics" element={<TacticsPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/chessgame/:chessgameid" element={<GamePage />} />
          <Route path="/profile/:profileid" element={<ProfilePage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}



export default App;