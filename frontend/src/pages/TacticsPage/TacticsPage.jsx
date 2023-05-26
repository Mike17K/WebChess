import React, { useState } from 'react'
import SideBar from './components/SideBar/SideBar'
import MainScreen from './components/MainScreen/MainScreen'

export default function TacticsPage() {
    const [tactic,setTactic] = useState({});

  return (
    <>
    <div className="mx-auto mt-10 w-full flex justify-center gap-3">

    <SideBar setTactic={setTactic} className="w-[300px] h-full"/>
    <MainScreen tactic={tactic} className="w-[700px]  h-full"/>
    <div className="w-[400px] h-full"></div>

    
    
    </div>
    </>
  )
}