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
  const profile = store.getState().profile;

  const [data, setData] = useState(initDataState);
  const [whiteSide, setWhiteSide] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5050/api/game/getChessGame/${chessgameid}`,
     { method: "GET" }
     ).then((res) => res.json()).then((chessgame) => {setData(chessgame)
    console.log(chessgame)}).catch((err) => console.log(err));
  }, [chessgameid]);

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

  useEffect(() => {

    socket.connect();

    socket.on('moved-piece', (data) => {
      // fetch chessgame data
      fetch(`http://localhost:5050/api/game/getChessGame/${chessgameid}`,
      { method: "GET" }
      ).then((res) => res.json()).then((chessgame) => {setData(chessgame)
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
  }, [chessgameid, profile,socket]);

  console.log(data);
  // <br />
  // {
  //   data.playerBlack && (
  //     <div>
  //       <div>playerBlack</div>
  //       <img className="w-[30px]" src={data.playerBlack.profile.picture || process.env.PUBLIC_URL+'/assets/icons/profiles/profile-0.png'} alt="profile pic" />
  //       <div>{data.playerBlack.profile.profilename}</div>
  //     </div>
  //   )
  // }
  // {
  //   data.playerWhite && (
  //     <div>
  //       <div>playerWhite</div>
  //       <img className="w-[30px]" src={data.playerWhite.profile.picture || process.env.PUBLIC_URL+'/assets/icons/profiles/profile-0.png'} alt="profile pic" />
  //       <div>{data.playerWhite.profile.profilename}</div>
  //     </div>
  //   )
  // }

  return (
    <div className='w-[100vw] h-[100vh] flex justify-center items-center relative '>
      
      <div className='flex items-center relative'>
      
      <div className='absolute top-[17px] -left-[200px] w-[150px] p-[5px] shadow-lg shadow-orange-400 border-4 border-grey rounded-xl flex justify-between'>
        <button onClick={(e)=>{}/* TODO */} className='p-2 border-transparent hover:border-green-700 hover:bg-green-400 border-4 rounded-lg transition-all'>
        <img src={`${process.env.PUBLIC_URL}/assets/icons/add-user.png`} alt="" className='w-[20px] h-[20px] '/>
        </button>
        <div className='flex justify-center h-full items-center gap-2 my-auto'>
          <p className='text-green-600'>1861</p>
          <img src={`${process.env.PUBLIC_URL}/assets/icons/view.png`} alt="" className='w-[20px] h-[20px]'/>
        </div>
      </div>

      <div className='absolute -left-[200px] w-[150px] h-[400px] rounded-lg shadow-lg shadow-orange-400 border-4 border-grey gap-2 my-auto p-2 no-scrollbar overflow-y-auto'>
        <div className='w-full text-center transition-all'>
          <button className='shadow-md shadow-grey bg-[#fff9e7] w-full h-[30px] mb-4 px-4 flex justify-between group hover:border-2'>
              <p className='text-[#3d6ac4] my-auto'>Kd8</p>
              <p className='text-[#3d6ac4] my-auto'>455</p>
              <img src={`${process.env.PUBLIC_URL}/assets/icons/vote.png`} alt="" className='hidden w-0 h-[20px] text-center my-auto group-hover:block group-hover:w-[20px] ' /* add select styles TODO */ />
          </button>
          <button className='shadow-md shadow-grey bg-[#fff9e7] w-full h-[30px] mb-4 px-4 flex justify-between group hover:border-2'>
              <p className='text-[#3d6ac4] my-auto'>Kd8</p>
              <p className='text-[#3d6ac4] my-auto'>455</p>
              <img src={`${process.env.PUBLIC_URL}/assets/icons/vote.png`} alt="" className='hidden w-0 h-[20px] text-center my-auto group-hover:block group-hover:w-[20px] ' /* add select styles TODO */ />
          </button>
          {/* add map here for posible moves */}
        </div>
      </div>

        <div className=''>
          <div className='w-full mb-[18px] relative'>
            <button className='h-[50px] w-[150px] absolute bottom-0 left-0 p-1 shadow-orange-400 shadow-md hover:border-2 border-4 rounded-full transition-all flex'>
              <div className='h-full aspect-square bg-[#eeb05e59] rounded-full overflow-hidden flex justify-center items-center'>
                <img src={`${process.env.PUBLIC_URL}/assets/icons/profiles/profile-2.png` /* TODO profile pic */} alt="" className='w-full h-full my-auto'/>
              </div>
              <div className='mx-2 h-full flex flex-col items-start'>
                <p className='text-[12px] text-[#e74444] font-bold'>Random Noob</p>
                <p className='text-[12px]'>Rapid: <span>982</span></p>
              </div>

            </button>

            <div className='h-[40px] w-[100px] absolute bottom-0 right-0 rounded-lg shadow-md shadow-orange-400 border-4 border-grey flex justify-center items-center gap-2 my-auto'>
                <p className='text-[#ff8e8e]'>18:61 {/* time remaining TODO */}</p>
            </div>
          </div>
        <ChessBoard className="w-[600px] aspect-square" fen={data.fen} whiteSide={whiteSide} moveCallback={()=> socket.emit("moved-piece")}/>
          <div className='w-full mt-[18px] relative'>
            
            <button className='h-[50px] w-[150px] absolute top-0 left-0 p-1 shadow-orange-400 shadow-md hover:border-2 border-4 rounded-full transition-all flex'>
              <div className='h-full aspect-square bg-[#eeb05e59] rounded-full overflow-hidden flex justify-center items-center'>
                <img src={`${process.env.PUBLIC_URL}/assets/icons/profiles/profile-2.png` /* TODO profile pic */} alt="" className='w-full h-full my-auto'/>
              </div>
              <div className='mx-2 h-full flex flex-col items-start'>
                <p className='text-[12px] text-[#419736] font-bold'>Mike17K</p>
                <p className='text-[12px]'>Rapid: <span>1902</span></p>
              </div>

            </button>

            <div className='h-[40px] w-[100px] absolute top-0 right-0 rounded-lg shadow-md shadow-orange-400 border-4 border-grey flex justify-center items-center gap-2 my-auto'>
                <p className='text-[#ff8e8e]'>8:61 {/* time remaining TODO */}</p>
            </div>
          </div>
        </div>
      </div>
      {/* <button onClick={(e)=>{setWhiteSide(!whiteSide)}}>Rotate</button> */}
    </div>
  );
}
