import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom';
import {store} from "../../redux/store"

// socket logic 
import { io } from 'socket.io-client';
const URL = 'http://localhost:5050';


export default function GamePage() {
    const { chessgameid } = useParams();
    const profile = store.getState().profile.profile;

    useEffect(() => {
        const socket = io(URL, {
            autoConnect: false,
            // Set the necessary options if needed
              // e.g., query parameters, authentication tokens, etc.
              query: {
                scope: 'chessgame',
                accessServerKey: profile.access_server_key,
                profileId: profile.id,
                chessGameid: chessgameid,
                chessGameAccessKey: 'YOUR_ACCESS_KEY',
              }
          });
        
        socket.connect();
        socket.on('connect', () => {
            console.log('connected to server');
            //socket.emit('join', { chessgameid, profile });
        }
        );
    }, [])
    

  return (<>
    <div>GamePage</div>
    {chessgameid}
  </>
  )
}
