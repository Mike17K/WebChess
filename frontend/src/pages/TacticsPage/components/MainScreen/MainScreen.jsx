import React, { useEffect, useState } from 'react'

export default function MainScreen({className,tactic}) {
    const [data, setData] = useState({});
    const [solutinoShow, setSolutinoShow] = useState(false);

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
    <div className={`${className} w-full flex flex-col align-middle p-10`}>
        
        <h2 className='text-center font-serif font-bold'>{data.titleCategory}</h2>
        <h3 className='text-center font-serif'>{data.title} - {data.isWhiteTurn?"White":"Black"} to play</h3>

        {/* <ChessBoard /> */}

        <button onClick={()=> setSolutinoShow(!solutinoShow)} className="ml-auto w-20 text-center rounded hover:bg-slate-500 bg-slate-300">Solution</button>

        <h3 className='text-center font-serif font-bold'>{data.tacticInfo}</h3>
        {
            solutinoShow && (
                <>
                <h3 className='text-center font-serif font-bold'>{data.solution}</h3>
                <h3 className='text-center font-serif'>{data.comments}</h3>
                </>
                )
            }
            




    </div>
  )
}
