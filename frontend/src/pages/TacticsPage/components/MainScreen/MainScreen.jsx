import React, { useEffect, useState } from "react";
import ChessBoard from "../../../../components/ChessBoard/ChessBoard";

const initDataState = {
  fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  hints: "",
  title: "Init",
  titleCategory: "Tactics Page",
  tacticInfo: "",
  solution: "",
  comments: ""
};

export default function MainScreen({ className, tactic }) {
  const [data, setData] = useState(initDataState);
  const [solutinoShow, setSolutinoShow] = useState(false);
  const [whiteSide, setWhiteSide] = useState(true);

    // TODO request from server the creation of new game

  useEffect(() => {
    console.log("Fetching tactic from: ",tactic.endpoint);
    if(tactic.endpoint === undefined) return;
    fetch(`http://localhost:5050${tactic.endpoint}`, { method: "GET" }).then((res) => res.json()).then((res) => {setData(res.tactic)}).catch((err) => console.log(err));
  }, [tactic]);
  
  return (
    <div
      className={`${className} flex w-full max-w-2xl flex-col p-10 align-middle`}
    >
      <h2 className="text-center font-serif text-[40px] font-bold">
        {data.titleCategory}
      </h2>
      <h3 className="text-center font-serif text-[20px] font-semibold">
        {data.title} - {data.fen.split(' ')[1]==='w' ? "White" : "Black"} to play
      </h3>

      <ChessBoard fen={data.fen} whiteSide={whiteSide} />

      <div className="mb-2 ml-auto">
        <button
          onClick={() => setWhiteSide(!whiteSide)}
          className="hover:bg-slate-500 bg-slate-300 mr-[10px] rounded px-4 text-center font-serif text-[20px] font-semibold"
        >
          Rotate
        </button>
        <button
          onClick={() => setSolutinoShow(!solutinoShow)}
          className="hover:bg-slate-500 bg-slate-300 mr-[60px] rounded px-4 text-center font-serif text-[20px] font-semibold"
        >
          Solution
        </button>
      </div>

      <h3 className="text-center font-serif text-[20px] font-semibold">
        {data.tacticInfo}
      </h3>
      {solutinoShow && (
        <>
          <h3 className="text-center font-serif text-[30px] font-bold">
            {data.solution}
          </h3>
          <h3 className="text-center font-serif text-[20px]">
            {data.comments}
          </h3>
        </>
      )}
    </div>
  );
}
