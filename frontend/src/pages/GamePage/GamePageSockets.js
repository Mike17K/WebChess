import { io } from 'socket.io-client';
import { store } from "../../redux/store";

const URL = 'http://localhost:5050';

export default function GamePageSockets({chessgameid, setData, setMySocket, setVisitors,setVotedMoves}) {
    const profile = store.getState().profile;

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
      setMySocket(socket);
  
      socket.connect();
      
      socket.on('unvoted-move', ({move}) => {
        // {move: "e4", votes: 50},
        console.log('unvoted-move', move);
        setVotedMoves(prevVotedMoves => {
          const index = prevVotedMoves.findIndex(votedMove => votedMove.move === move);
          if(index === -1){
            return [...prevVotedMoves]; // do nothing
          }
          prevVotedMoves[index].votes -= 1;
          if(prevVotedMoves[index].votes === 0){
            return prevVotedMoves.filter(votedMove => votedMove.move !== move); // remove move
          }
          return [...prevVotedMoves];
        });
      });

      socket.on('voted-move', ({move}) => {
        // {move: "e4", votes: 50},
        console.log('voted-move', move);
        setVotedMoves(prevVotedMoves => {
          const index = prevVotedMoves.findIndex(votedMove => votedMove.move === move);
          if(index === -1){
            return [...prevVotedMoves, {move,votes:1}]; // add new move
          }
          prevVotedMoves[index].votes += 1;
          return [...prevVotedMoves];
        });
      });        
        

      socket.on('sent-room-data', (data) => {
        console.log('roomData: ', data);
        setVisitors(data);
      });
  
      socket.on('user-connected', (user) => {
        console.log('user-connected: ', user);
        setVisitors(prevVisitors => [...prevVisitors, user]);
      });
  
      socket.on('user-disconnected', (profileId) => {
        console.log('user-disconnected: ', profileId);
        setVisitors(prevVisitors => prevVisitors.filter(visitor => visitor.id !== profileId));
      });
  
      socket.on('moved-piece', (data) => {
        // fetch chessgame data
        fetch(`${URL}/api/game/getChessGame/${chessgameid}`,
        { method: "GET" }
        ).then((res) => res.json()).then((chessgame) => {
          setData(chessgame);
          setVotedMoves([]);
        console.log(chessgame)}).catch((err) => console.log(err));
      });
  
      function mousedownhandle(e) {
          
          const cursor_x = e.pageX;
          const cursor_y = e.pageY;
  
          const data = {x:cursor_x,y:cursor_y};
          // identify the event as reaction
          if (e.ctrlKey && e.which === 1) { //Mouse and control was pressed
              socket.emit('mousedown', { chessGameid:chessgameid, chessGameAccessKey: 'YOUR_ACCESS_KEY', profileId: profile.id, data:data });
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
        socket.emit('get-room-data');
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
    }
