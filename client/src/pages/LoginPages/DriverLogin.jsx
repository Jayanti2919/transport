import React from 'react';
import VideoBg from '../../components/VideoBg';
import LoginBanner from '../../components/LoginBanner';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const DriverLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      const response = await axios.post('http://localhost:5000/driver/generateToken', {
        username,
        password
      });
      if(response.status !== 200) {
        alert(response.data.message);
      } else {
        window.localStorage.setItem("driverAccessToken", response.data.token);
        nav('/driver/Dashboard');
      }
    }catch(err){
      console.log(err);
    }
  }

  return (
    <div className='grid grid-cols-2'>
      <div className='bg-primary relative z-10 overflow-x-hidden h-screen'>
        <VideoBg />
      </div>
      <div className='flex flex-col'>
        <div className='flex justify-center items-center h-screen'>
          <div className='flex flex-col w-96'>
            <LoginBanner loginType="driver"/>
            <form className='flex flex-col gap-4 mt-4'>
              <input type='text' placeholder='username' className='py-2 px-4 active:border-none text-accent rounded-full focus:outline-none' onChange={(e)=>{setUsername(e.target.value)}}/>
              <input type='password' placeholder='password' className='py-2 px-4 active:border-none text-accent rounded-full focus:outline-none' onChange={(e)=>{setPassword(e.target.value)}}/>
              <button className='bg-secondary shadow-lg text-white p-2 rounded-full' type='submit' onClick={handleSubmit}>Submit</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DriverLogin