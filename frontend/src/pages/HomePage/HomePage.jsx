import React, { useEffect, useState } from 'react'
import {store} from "../../redux/store"

const setAccessGame = (data) => store.dispatch({type:"setAccessGame",accessGame:{id:data.id,key:data.key,url:data.url}})
// const clearAccessGame = (data) => store.dispatch({type:"clearAccessGame"})

export default function HomePage() {
    const [publicGames, setPublicGames] = useState([]);

    useEffect(() => {
      fetch('http://localhost:5050/api/game/publicGames', {
        method: 'GET',
      }).then(response => response.json()).then(data => {
        if(data.error){
          console.log(data.error);
          return;
        }
        // data: {id: ... , url: ...}
        console.log(data);
        setPublicGames(data.map(c => {return {id: c.id, url: `http://localhost:3000/chessgame/${c.id}`} }));
      }).catch((error) => {
        console.error('Error:', error);
      });
    },[]);

    function newGameHandle(){
      const profile = store.getState().profile.profile;
      console.log(profile);
      if(profile=== undefined) return window.location.href = "http://localhost:3000/login";
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
    <div className='mt-[100px]'>HomePage</div>

    <button onClick={newGameHandle}>Play New Game</button>

    <br/>
    <h2>Join Games</h2>
    {
      publicGames.map((game,index) => {
        return <div key={index}>
          <div>{game.id}</div>
          <div>{game.url}</div>
          <button onClick={async () => {
            const profile = store.getState().profile.profile;
            const { url, accessKey,id } = await fetch('http://localhost:5050/api/game/joinGame', {
              method: 'GET',
              headers: {
                "profileId": profile.id,
                "accessServerKey": profile.access_server_key,
                "chessGameId":game.id
                },
                }).then(response => response.json());
            
            if(!url || !accessKey || !id) return console.log("Error: ",url,accessKey,id);
            // redirect to the game page
            setAccessGame({key:accessKey,url:url,id:id});
            window.location.href = url;
          }}
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
          >Play Game</button>

          <button onClick={() => {
            // redirect to the game page
            setAccessGame({key:"",url:game.url,id:game.id});
            window.location.href = game.url;
          }}
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
          >Spectate Game</button>
        </div>
      })
    }
    </>
  )
}
