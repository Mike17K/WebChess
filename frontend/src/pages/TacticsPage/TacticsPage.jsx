import React, { useState } from 'react'
import SideBar from './components/SideBar/SideBar'
import MainScreen from './components/MainScreen/MainScreen'

export default function TacticsPage() {
    const [tactic,setTactic] = useState({});

  return (
    <>
    <div className="mx-auto mt-10 w-full flex justify-center gap-3">

    <SideBar setTactic={setTactic} className="w-[150px] h-[80vh] bg-slate-400"/>
    <MainScreen tactic={tactic} className="w-[700px] bg-slate-400 h-[80vh]"/>
    <div className="w-[150px] h-[80vh]"></div>
    
    </div>
    </>
  )
}