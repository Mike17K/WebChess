import React, { useEffect, useState } from 'react'

export default function Category({name,uid,setTactic}) {
    const [active,setActive] = useState(false);
    const [tactics,setTactics] = useState([]);

    useEffect(()=>{
        if(!active) return;

        //instead of manualy fetch the subcategories and set the Children
        const data = [            
            {titleCategory:name,title:'Diagram 1',endpoint:"/tactic/05557568"},
            {titleCategory:name,title:'Diagram 2',endpoint:"/tactic/0482248455"}
        ];
        setTactics(data);

    },[active,name]);

  return (
    <>
    <button key={uid} onClick={()=> setActive(!active)} 
    className={`${active? "bg-slate-700 text-white rounded-[10px]":"bg-slate-200 text-black"} 
    w-[80%] h-[50px]
    group border-2 mx-auto p-2 my-[5px] 
    font-light text-center
    hover:bg-slate-500 hover:rounded-[10px] 
    transition-all 
    flex items-center justify-between`}> 
    <span className="font-serif text-[20px] font-semibold">{name}</span>

    <svg width="20" height="20" className={`transform origin-center ${active? "-rotate-90":""} transition-transform`}>
        <line x1="10" y1="10" x2="20" y2="5" stroke="black" />
        <line x1="10" y1="10" x2="20" y2="15" stroke="black" />
    </svg>
    </button>

    <div className={`${active?"max-h-[100px]":"max-h-0"} 
    w-full ml-[0px] overflow-hidden text-xs flex flex-col transition-all ease-in-out duration-500
    text-[20px]
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



