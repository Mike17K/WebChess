import React, { useEffect, useState } from "react";
import ChessBoard from "./components/ChessBoard/ChessBoard";

const initDataState = {
  fen: "rnbqkb1r/pp2pp1p/3p1np1/8/3NP3/2N5/PPP2PPP/R1BQKB1R w KQkq - 0 1",
  hints: "7...Q",
  title: "init",
  titleCategory: "test",
  tacticInfo: "Simons - Lowe, London 1849",
  solution: "7...Qa5+ 0-1",
  comments: "Black checks to capture the undefended bishop.",
  isWhiteTurn: false,
};

export default function MainScreen({ className, tactic }) {
  const [data, setData] = useState(initDataState);
  const [solutinoShow, setSolutinoShow] = useState(false);
  const [whiteSide, setWhiteSide] = useState(true);

  useEffect(() => {
    // instead of manual fetch data from server and pase them to the main screen from tactic.endpoint
    const res = {
      fen: "rnbqkb1r/pp2pp1p/3p1np1/8/3NP3/2N5/PPP2PPP/R1BQKB1R w KQkq - 0 1",
      hints: "7...Q",
      title: tactic.title,
      titleCategory: tactic.titleCategory,
      tacticInfo: "Simons - Lowe, London 1849",
      solution: "7...Qa5+ 0-1",
      comments: "Black checks to capture the undefended bishop.",
      isWhiteTurn: false,
    };
    setData(res);
    console.log(tactic);
  }, [tactic]);

  return (
    <div
      className={`${className} flex w-full max-w-2xl flex-col p-10 align-middle`}
    >
      <h2 className="text-center font-serif text-[40px] font-bold">
        {data.titleCategory}
      </h2>
      <h3 className="text-center font-serif text-[20px] font-semibold">
        {data.title} - {data.isWhiteTurn ? "White" : "Black"} to play
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
