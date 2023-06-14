import React, { useEffect, useState } from 'react'

export default function Category({name,id,setTactic}) {
    const [active,setActive] = useState(false);
    const [tactics,setTactics] = useState([]);

    useEffect(()=>{
        if(!active) return;
        if(tactics.length > 0) return; // if alrdy fetched return

        fetch(`http://localhost:5050/api/tactic/getCategoryTactics`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          titleCategory:`${name}`
        })}
        ).then(res => res.json()).then(data => {
            setTactics(data.tactics);
        }).catch(err => console.log(err));

    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[active]);

  return (
    <>
 <button key={id} onClick={()=> setActive(!active)} 
 className={`relative ${active? "bg-slate-700 text-white rounded-[10px]":"bg-slate-200 text-black"} 
 border border-black p-1 my-[5px] mx-auto w-[80%] h-[50px]
 hover:rounded-[10px] group
 ` }>
  <div
    className={`${active? "bg-slate-400 text-white rounded-[10px]":"bg-slate-200 text-black"} 
    w-full h-full
    border p-2 
    font-light text-center
    group-hover:bg-slate-500 group-hover:rounded-[10px] 
    transition-all border-black
    flex items-center justify-between`}> 
    
    <span className="font-serif text-[20px] font-semibold">{name}</span>

    <svg width="20" height="20" className={`transform origin-center ${active? "-rotate-90":""} transition-transform`}>
        <line x1="10" y1="10" x2="20" y2="5" stroke="black" />
        <line x1="10" y1="10" x2="20" y2="15" stroke="black" />
    </svg>
  </div>
    </button>


    <div className={`${active?"max-h-[100px]":"max-h-0"} 
    w-full ml-[0px] text-xs flex flex-col transition-all ease-in-out duration-500
    text-[20px] overflow-hidden hover:overflow-y-scroll
    `}>
  {tactics.map((tactic) => (
    <button className="pb-1" key={tactic.endpoint} onClick={() => setTactic(tactic)}>
      {tactic.title}
    </button>
  ))}
</div>
    
    </>
  )
}



