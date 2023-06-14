import React, { useEffect, useState } from 'react'
import Category from './components/Category/Category'

export default function SideBar({setTactic,className}) {
    const [categories,setCategories] = useState([]);

    useEffect(() => {
      fetch(`http://localhost:5050/api/tactic/getCategories`, {method: "GET"}
        ).then(res => res.json()).then(data => {
          setCategories(data.categories);
        }).catch(err => console.log(err));
    },[]);
        
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
