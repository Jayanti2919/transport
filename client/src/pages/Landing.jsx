import React from 'react';
import { useNavigate } from 'react-router-dom';
import { landing_bg, logo } from '../assets';

const Landing = () => {
  const nav = useNavigate();
  return (
    <div className="h-screen w-screen flex items-center" style={{ backgroundImage: `url(${landing_bg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className='flex flex-col items-start justify-start px-20 pb-12'>
            <div className='pb-1'>
                <span className='text-secondary text-6xl rammetto shadow-lg'>ez</span>
                <span className='text-primary text-6xl uppercase rammetto shadow-lg'>cargo</span>
            </div>
            <span className='recursive text-secondary text-md pl-2'>You load it, we road it!</span>
            <div className='grid grid-cols-3 gap-5 mt-10'>
                <button className='bg-primary px-5 py-1 rounded-full shadow-md recursive text-xs hover:bg-secondary' onClick={()=>{nav('/userLogin')}}>User</button>
                <button className='bg-primary px-5 py-1 rounded-full shadow-md recursive text-xs hover:bg-secondary' onClick={()=>{nav('/driverLogin')}}>Driver</button>
                <button className='bg-primary px-5 py-1 rounded-full shadow-md recursive text-xs hover:bg-secondary' onClick={()=>{nav('/adminLogin')}}>Admin</button>
            </div>
        </div>
    </div>
  );
}

export default Landing;