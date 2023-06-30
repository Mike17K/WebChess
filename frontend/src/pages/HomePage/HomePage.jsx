import React from 'react'
import {store} from "../../redux/store"

export default function HomePage() {

    function newGameHandle(){
      const profile = store.getState().profile.profile;
      console.log(profile);
      if(profile=== undefined) return window.location.href = "http://localhost:3000/login";
        // TODO request from server the creation of new game
        fetch('http://localhost:5050/api/game/newGame', {
          method: 'GET',
          headers: {
            'profileid': profile.id,
            'accessserverkey': profile.access_server_key,
          },
        }).then(response => response.json()).then(data => {
          if(data.error){
            console.log(data.error);
            return;
          }
          console.log(data);
          const {url , accessKey } = data;
          console.log("SUCCESS: ",url, accessKey);
          // TODO store the accessKey in the redux store for this game url
          // TODO redirect to the game page
        }).catch((error) => {
          console.error('Error:', error);
        });

    }
  return (
    <>
    <div>HomePage</div>

    <button onClick={newGameHandle}>Play New Game</button>
    </>
  )
}
