import React, { useEffect, useState } from 'react'

export default function Category({name,uid,setTactic}) {
    const [active,setActive] = useState(false);
    const [tactics,setTactics] = useState([]);

    useEffect(()=>{
        if(!active) return;

        //instead of manualy fetch the subcategories and set the Children
        const data = [            
            {titleCategory:name,title:'Diagram 1',endpoint:"/tactic/05557568"},
            {titleCategory:name,title:'Diagram 2',endpoint:"/tactic/0482248455"},
            {titleCategory:name,title:'Diagram 2',endpoint:"/tactic/0482248455"},
            {titleCategory:name,title:'Diagram 2',endpoint:"/tactic/0482248415"},
            {titleCategory:name,title:'Diagram 2',endpoint:"/tactic/0482248425"},
            {titleCategory:name,title:'Diagram 2',endpoint:"/tactic/0482248435"},
            {titleCategory:name,title:'Diagram 2',endpoint:"/tactic/04822484345"},
            {titleCategory:name,title:'Diagram 2',endpoint:"/tactic/0482248457"},
            {titleCategory:name,title:'Diagram 2',endpoint:"/tactic/0482248458"},
            {titleCategory:name,title:'Diagram 2',endpoint:"/tactic/0482248456"},
            {titleCategory:name,title:'Diagram 2',endpoint:"/tactic/0482248455"},
            {titleCategory:name,title:'Diagram 2',endpoint:"/tactic/0482248459"},
        ];
        setTactics(data);

    },[active,name]);

  return (
    <>
<div className={`relative ${active? "bg-slate-700 text-white rounded-[10px]":"bg-slate-200 text-black"} 
border border-black p-1 my-[5px] mx-auto w-[80%] h-[50px]
hover:rounded-[10px] group
` }>
    <button key={uid} onClick={()=> setActive(!active)} 
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
    </button>
  </div>


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



