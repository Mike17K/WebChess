import React, { useEffect, useRef, useState } from 'react'
import { store } from '../../../../redux/store';

export default function GameChat({socket}) {
  const [name, setName] = useState(store.getState().profile.name); 
  const [messages, setMessages] = useState([
    {
      icon: 4,
      username: 'test',
      message: `test dsafkjl kasjfhkljashkldfhjklasdhfklasjdklfhjas      kldfhjklasjdfh      klj`
    },
    {
      icon: 5,
      username: 'test',
      message: `test dsafkjl kasjfhkldfhjklasjdfh      klj`
    },
    {
      icon: 5,
      username: 'mike',
      message: `test dsafkjl kasjfh`
    },
    {
      icon: 2,
      username: 'test',
      message: `test dsafkjl      klj`
    },
    ]);
  const endMessageRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!socket) return;
    socket.on('chat-message', (msg) => {
      setMessages((messages) => [...messages, msg]);
    });
  }, [socket])

  useEffect(() => {
    endMessageRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages])

  useEffect(() => {
    setName(store.getState().profile.name);
  }, [store.getState().profile.name])
    









  
  useEffect(() => {
    const options = {
      root: null, // viewport
      rootMargin: '0px', // no margin
      threshold: 0.5, // 50% of the target element is visible
    };

    const callback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // The target element is in the viewport
          inputRef.current.focus(); // Focus on the element
        }
      });
    };

    const observer = new IntersectionObserver(callback, options);

    // Start observing the target element
    if (inputRef.current) {
      observer.observe(inputRef.current);
    }

    // Don't forget to disconnect the observer when not needed
    return () => {
      observer.disconnect();
    };
  }, []);




  
  return (
    <div className='absolute -right-[300px] w-[250px] h-[600px] rounded-lg shadow-lg shadow-orange-400 border-4 border-grey gap-2 my-auto p-2 no-scrollbar overflow-y-auto bg-white'>
        <div className='w-full text-center transition-all' onClick={(e)=> {
          inputRef.current.scrollIntoView({ behavior: 'smooth' });
          }}>
          <p className='text-lg text-[#6872cf]'>Chat</p>
          
          {
            messages.map((message) => {
              return (
                <div className={`w-full flex gap-2 mb-1 ${(message.username==name)?"flex-row-reverse items-start":""}`}>
                  <div className='min-w-[40px] h-[40px] rounded-full bg-gray-500'>
                    {/* <img src={`https://avatars.dicebear.com/api/avataaars/${message.icon}.svg`} alt='avatar' className='w-full h-full rounded-full' /> */}
                    <img src={`http://localhost:3000/assets/icons/profiles/profile-${message.icon}.png`} alt='avatar' className='w-[40px] h-[40px] rounded-full' />
                  </div>
                  <div className='max-w-[170px] min-h-[40px] bg-[#6872cf] rounded-lg p-1'>
                    <p className='text-xs text-left text-[rgb(137,255,108)]'>{message.username}</p>
                    <p className='text-xs text-left whitespace-normal text-[#ffffff]'>{message.message}</p>
                  </div>
                </div>
              )
            }
            )
          }
        <div ref={endMessageRef}></div>
        </div>
        
        <form
          class='flex relative w-full left-0 bottom-0 p-2'
          action=''
          onSubmit={(e) => {
            e.preventDefault();
            if (e.target[0].value == "") return;
            
            console.log("message sent");
            socket.emit('chat-message', {
              username: name,
              icon: store.getState().profile.picture,
              message: e.target[0].value,
            });
            e.target[0].value = '';
            return false;
          }} 
        >
          <input
            ref={inputRef}
            type="text"
            class='w-full h-[40px] rounded-full px-4 border-2 border-gray-500 focus:bg-blue-200'
          />
          <button type='submit' class=''></button>
        </form>

      </div>
  )
}
