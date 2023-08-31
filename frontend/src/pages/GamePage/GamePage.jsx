import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import './GamePage.css';
import ChessBoard from "../../components/ChessBoard/ChessBoard";

// socket logic 
import MoveVoterWidget from './components/MoveVoterWidget/MoveVoterWidget';
import VisitorsInfoWidget from './components/VisitorsInfoWidget/VisitorsInfoWidget';
import PlayerLayout from './components/PlayerLayout/PlayerLayout';

import GamePageSockets from './GamePageSockets.js';
import VisitorsMoveLogic from './VisitorMoveLogic.js';
import { store } from '../../redux/store';

const initDataState = {
  fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  title: "Init"
};

export default function GamePage() {
  const { chessgameid } = useParams();

  const [profile, setProfile] = useState(store.getState().profile);

  const [data, setData] = useState(initDataState);
  const [whiteSide, setWhiteSide] = useState(true);
  const [visitors, setVisitors] = useState([]);
  const [mysocket, setMySocket] = useState(null);
  const [votedMove,setVotedMove] = useState("");
  const [votedMoves, setVotedMoves] = useState([
    {move: "e4-1", votes: 50},
    {move: "e5-1", votes: 48},
    {move: "Nf3-1", votes: 40},
    {move: "Nc6-1", votes: 30}
  ]); // [{move: "e4", votes: 0}, {move: "e5", votes: 0}  
  
  useEffect(() => {
    fetch(`http://localhost:5050/api/game/getChessGame/${chessgameid}`,
     { method: "GET" }
     ).then((res) => res.json()).then((chessgame) => {setData(chessgame)
    console.log(chessgame)}).catch((err) => console.log(err));
  }, [chessgameid]);


  useEffect(() => {
    GamePageSockets({chessgameid, setData, setMySocket, setVisitors,setVotedMoves});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



  useEffect(() => { // ISSUE WITH THIS HOOK WHEN USER CONNECTS MUKLTIPLE TIMES the interval stacks TODO
      setInterval(VisitorsMoveLogic, 20);

      return () => {
        clearInterval(VisitorsMoveLogic);
      }
    }, []);
    console.log("Game Page Rendered");

  return (
    <div className='w-[100vw] h-[100vh] z-0 flex justify-center items-center relative overflow-hidden'>
      {
        visitors.map((visitor) => {
          return (
            <div 
             key={visitor.id} className='visitor z-0 top-[80px] left-[80px] w-[40px] h-[40px] absolute rounded-full flex flex-col items-center leading-4 transition-transform transition-500'>
              <img src={`${process.env.PUBLIC_URL}/assets/icons/profiles/profile-${visitor.picture}.png`} alt="" className='w-full h-full'/>
              <p className='text-[#caa93e]'>{visitor.name}</p>
              <p className='text-[#74716a]'>{visitor.rating}</p>
            </div>
          )
        })
      }
      
      <div className='flex items-center relative'>
      
        <VisitorsInfoWidget visitors={visitors} />
        <MoveVoterWidget 
          votedMove={votedMove}
          setVotedMove={(move,userId=profile.id) => {
            setVotedMove(votedMove => {
              if(!userId) return;
              if (!votedMove) return move;
              mysocket.emit("unvote-move", {sqIDFrom:votedMove.split("-")[0],sqIDTo:votedMove.split("-")[1],userId} ); // also this is unsafe make it work with jwt in the future TODO
              mysocket.emit("vote-move", {sqIDFrom:move.split("-")[0],sqIDTo:move.split("-")[1],userId} ); // also this is unsafe make it work with jwt in the future TODO
              return move;
            }
            );            
          }}
          votedMoves={votedMoves.sort((a, b) => {return b.votes-a.votes;})} 
        />
        <div className=''>
          <PlayerLayout bottomPlayer={false} player={{picture:4,name:"Mike17K",rating:1955, url: "http://localhost:3000/profile/me"}} timeRemaining={"8:29"} />
        <ChessBoard className="ChessBoard w-[600px] z-0 aspect-square" 
        fen={data.fen} 
        whiteSide={whiteSide} 
        moveCallback={()=> mysocket.emit("moved-piece")}
        onSquarePressCallback={({sqIDFrom,sqIDTo,userId,gameId,accessToken,accessServerKey})=>{
          // console.log("vote-move", {sqIDFrom,sqIDTo,userId});
          setVotedMove((votedMove) => {
             
            let move = `${sqIDFrom}-${sqIDTo}`;        
            console.log("votedMove: ", votedMove," move: ", move);
            if (votedMove === move) return move;
            if(votedMove != null){
              let sqIDFrom = votedMove.split("-")[0];
              let sqIDTo = votedMove.split("-")[1];
              mysocket.emit("unvote-move", {sqIDFrom,sqIDTo,userId} ); // also this is unsafe make it work with jwt in the future TODO
            }
            mysocket.emit("vote-move", {sqIDFrom,sqIDTo,userId} ); // also this is unsafe make it work with jwt in the future TODO
            
            return move;
          });
        }
        }/>
          <PlayerLayout bottomPlayer={true} player={{picture:1,name:"Mike",rating:1903,url: "http://localhost:3000/profile/me"}} timeRemaining={"5:41"} />
        </div>
      </div>
      {/* <button onClick={(e)=>{setWhiteSide(!whiteSide)}}>Rotate</button> */}
    </div>
  );
}
