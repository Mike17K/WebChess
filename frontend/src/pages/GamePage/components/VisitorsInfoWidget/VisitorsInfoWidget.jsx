import React from 'react'

export default function VisitorsInfoWidget({visitors}) {
  return (
    <div className='absolute top-[17px] -left-[200px] w-[150px] p-[5px] shadow-lg shadow-orange-400 border-4 border-grey rounded-xl flex justify-between bg-white'>
        <button onClick={(e)=>{}/* TODO */} className='p-2 border-transparent hover:border-green-700 hover:bg-green-400 border-4 rounded-lg transition-all'>
        <img src={`${process.env.PUBLIC_URL}/assets/icons/add-user.png`} alt="" className='w-[20px] h-[20px] '/>
        </button>
        <div className='flex justify-center h-full items-center gap-2 my-auto'>
          <p className='text-green-600'>{visitors.length}</p>
          <img src={`${process.env.PUBLIC_URL}/assets/icons/view.png`} alt="" className='w-[20px] h-[20px]'/>
        </div>
      </div>
      
  )
}
