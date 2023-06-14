import React from 'react'
import Category from './components/Category/Category'

export default function SideBar({setTactic,className}) {
    // fetch categories TODO
    const categories = [
        {uid:"5688562418",name:"B20 - 1.e4 c5"},
        {uid:"5456785136",name:"B21 - 2.f4"},
        {uid:"5456745436",name:"B22 - 2.c3 d5"}
    ];
  return (
    <div className={`flex flex-col p-2 align-middle ${className}`}>
        {
            categories.map((category) =>
            <Category key={category.uid} setTactic={setTactic} uid={category.uid} name={category.name}/>
            )
        }
    </div>
  )
}
