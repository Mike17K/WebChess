import React from 'react'
import {store} from "../../redux/store"

const setAccessGame = (data) => store.dispatch({type:"setAccessGame",accessGame:{id:data.id,key:data.key,url:data.url}})
// const clearAccessGame = (data) => store.dispatch({type:"clearAccessGame"})

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
          const {url , accessKey, id } = data;

          // store the accessKey in the redux store for this game url
          setAccessGame({key:accessKey,url:url,id:id});

          // redirect to the game page
          window.location.href = url;
          
        }).catch((error) => {
          console.error('Error:', error);
        });

    }
  return (
    <>
    <div>HomePage</div>

    <button onClick={newGameHandle}>Play New Game</button>
    <button onClick={newGameHandle}>Join Game</button>
    </>
  )
}
