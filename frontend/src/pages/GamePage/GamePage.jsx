import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { store } from "../../redux/store";

import './GamePage.css';
import ChessBoard from "../../components/ChessBoard/ChessBoard";

// socket logic 
import { io } from 'socket.io-client';
const URL = 'http://localhost:5050';

const initDataState = {
  fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  title: "Init"
};

export default function GamePage() {
  const { chessgameid } = useParams();
  const profile = store.getState().profile.profile;

  const [data, setData] = useState(initDataState);
  const [whiteSide, setWhiteSide] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5050/api/game/getChessGame/${chessgameid}`,
     { method: "GET" }
     ).then((res) => res.json()).then((chessgame) => {setData(chessgame)
    console.log(chessgame)}).catch((err) => console.log(err));
  }, [chessgameid]);

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
        // draw a circle on the screen
        const circle = document.createElement('div');
        circle.classList.add(`${Math.random()}`);
        circle.classList.add('circle');
        circle.style.left = data.data.x + 'px';
        circle.style.top = data.data.y + 'px';
        document.body.appendChild(circle);
        setTimeout(() => {
            circle.remove();
        }
        , 500);

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
      <ChessBoard fen={data.fen} whiteSide={whiteSide} />
      <button onClick={(e)=>{setWhiteSide(!whiteSide)}}>Rotate</button>

    </>
  );
}
