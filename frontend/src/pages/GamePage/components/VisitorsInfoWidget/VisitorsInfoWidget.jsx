import React, { useState } from 'react';

export default function VisitorsInfoWidget({ visitors, gameUrl }) {
  const [copied, setCopied] = useState(false);

  const handleCopyToClipboard = () => {
    // Copy the game URL to the clipboard
    navigator.clipboard.writeText(gameUrl);

    // Set the copied state to true
    setCopied(true);

    // Reset the copied state to false after 2 seconds
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  return (
    <div className='absolute top-[17px] -left-[200px] w-[150px] p-[5px] shadow-lg shadow-orange-400 border-4 border-grey rounded-xl flex justify-between bg-white'>
      <button
        onClick={handleCopyToClipboard}
        className={`p-2 border-transparent hover:border-green-700 hover:bg-green-400 border-4 rounded-lg transition-all cursor-pointer`}
        disabled={copied}
      >
        <div className='flex'>
        <img
          src={`${process.env.PUBLIC_URL}/assets/icons/${
            copied ? 'checkmark' : 'add-user'
          }.png`}
          alt=""
          className='w-[20px] h-[20px]'
          />
          {copied && <p className='h-[20px] ml-[4px]'>Copied!</p>}
          </div>
      </button>
      <div className='flex justify-center h-full items-center gap-2 my-auto'>
        <p className='text-green-600'>{visitors.length}</p>
        <img
          src={`${process.env.PUBLIC_URL}/assets/icons/view.png`}
          alt=""
          className='w-[20px] h-[20px]'
        />
      </div>
    </div>
  );
}
