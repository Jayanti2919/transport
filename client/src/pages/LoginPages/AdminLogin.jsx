import React from 'react';
import VideoBg from '../../components/VideoBg';
import LoginBanner from '../../components/LoginBanner';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [buttonText, setButtonText] = useState('send otp');
  const [status, setStatus] = useState('email');
  const nav = useNavigate();

  const handleEnterEmail = () => {
    setButtonText('verify otp');
    setStatus('otp');
    console.log(status);
  }

  const handleEnterOtp = () => {
    setButtonText('send otp');
    setStatus('email');
    console.log(status);
    nav('/admin/dashboard');
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (status === 'email') {
      handleEnterEmail();
    } else {
      handleEnterOtp();
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
            <LoginBanner loginType="admin"/>
            <form className='flex flex-col gap-4 mt-4'>
              <input type='text' placeholder='username' className='py-2 px-4 active:border-none text-accent rounded-full focus:outline-none' />
              <input type='password' placeholder='otp' className='py-2 px-4 active:border-none text-accent rounded-full focus:outline-none' />
              <button className='bg-secondary shadow-lg text-white p-2 rounded-full' type='submit' onClick={handleSubmit}>{buttonText}</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin