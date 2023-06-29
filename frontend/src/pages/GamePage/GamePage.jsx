import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { store } from "../../redux/store";

// socket logic 
import { io } from 'socket.io-client';
const URL = 'http://localhost:5050';

export default function GamePage() {
  const { chessgameid } = useParams();
  const profile = store.getState().profile.profile;

  useEffect(() => {
    const socket = io(URL, {
      // Set the necessary options if needed
      autoConnect: false,
      query: {
        scope: 'chessgame',
        accessServerKey: profile.access_server_key,
        profileId: profile.id,
        chessGameid: chessgameid,
        chessGameAccessKey: 'YOUR_ACCESS_KEY',
      }
    });

    socket.connect();

    function mousedownhandle(e) {
        
        const cursor_x = e.pageX;
        const cursor_y = e.pageY;

        const data = {x:cursor_x,y:cursor_y};
        // identify the event as reaction
        if (e.ctrlKey && e.which == 1) { //Mouse and control was pressed
            socket.emit('mousedown', { chessgameid, chessGameAccessKey: 'YOUR_ACCESS_KEY', profileId: profile.id, data:data });
        }
        // control key 
    }
    socket.on('mousedown', (data) => {
        console.log('mousedown', data);
    });

    socket.on('connect', () => {
      console.log('connected to server');
      // socket.emit('join', { chessgameid, profile });
      document.addEventListener('mousedown', mousedownhandle);
    });

    socket.on('disconnect', () => {
      console.log('disconnected from server');
      document.removeEventListener('mousedown', mousedownhandle);
    });

    return () => {
      socket.disconnect();
      document.removeEventListener('mousedown', mousedownhandle);
    };
  }, [chessgameid, profile]);

  return (
    <>
      <div>GamePage</div>
      {chessgameid}
    </>
  );
}
