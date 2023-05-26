import React, { useEffect, useState } from 'react'
import ChessBoard from './components/ChessBoard/ChessBoard';

export default function MainScreen({className,tactic}) {
    const [data, setData] = useState({});
    const [solutinoShow, setSolutinoShow] = useState(false);
    const [whiteSide,setWhiteSide] = useState(true);

    useEffect(()=> {
    // instead of manual fetch data from server and pase them to the main screen from tactic.endpoint
    const res = {
        fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        hints:"7...Q",
        title:tactic.title,
        titleCategory:tactic.titleCategory,
        tacticInfo:"Simons - Lowe, London 1849",
        solution: "7...Qa5+ 0-1", 
        comments:"Black checks to capture the undefended bishop.",
        isWhiteTurn:false
    }
    setData(res);
    console.log(tactic);
},[tactic])

  return (
    <div className={`${className} max-w-2xl w-full flex flex-col align-middle p-10`}>
        
        <h2 className='text-center font-serif text-[40px] font-bold'>{data.titleCategory}</h2>
        <h3 className='text-center font-serif text-[20px] font-semibold'>{data.title} - {data.isWhiteTurn?"White":"Black"} to play</h3>

        <ChessBoard fen={data.fen} whiteSide={whiteSide}/>

        <div className='ml-auto mb-2'>
        <button onClick={()=> setWhiteSide(!whiteSide)} className="px-4 mr-[10px] font-serif text-[20px] font-semibold text-center rounded hover:bg-slate-500 bg-slate-300">Rotate</button>
        <button onClick={()=> setSolutinoShow(!solutinoShow)} className="px-4 mr-[60px] font-serif text-[20px] font-semibold text-center rounded hover:bg-slate-500 bg-slate-300">Solution</button>
        </div>

        <h3 className='text-center font-serif text-[20px] font-semibold'>{data.tacticInfo}</h3>
        {
            solutinoShow && (
                <>
                <h3 className='text-center font-serif text-[30px] font-bold'>{data.solution}</h3>
                <h3 className='text-center font-serif text-[20px]'>{data.comments}</h3>
                </>
                )
            }
            




    </div>
  )
}
