import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import Axios from 'axios';
import RegisterImg from '../assets/RegisterImg.jpg';

export default function Register() {
  const [emailreg, setEmail] = useState('');
  const [usernamereg, setUsername] = useState('');
  const [passwordreg, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const navigate = useNavigate();

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handlePasswordConfirmChange = (e) => {
    setPasswordConfirm(e.target.value);
  };

  const regist = (e) => {
    e.preventDefault();
    if (passwordreg === passwordConfirm) {
      Axios.post('http://localhost:5500/register', {
        email: emailreg,
        username: usernamereg,
        password: passwordreg,
      })
        .then((response) => {
          console.log(response);
          navigate("/login")
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      console.log('Password and password confirmation do not match.');
    }
  };

  const passwordMatchError =
    passwordreg !== passwordConfirm ? (
      <p className='text-red-500'>Password Must Match</p>
    ) : null;

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 h-screen w-full'>
      <div className='hidden sm:block'>
        <img className='w-full max-h-screen object-cover' src={RegisterImg} alt='RegisterImg' />
      </div>

      <div className='bg-purple-300 flex flex-col justify-center items-center relative'>
        <form
        onSubmit={regist} 
        className='max-w-[400px] w-full mx-auto rounded-lg bg-black p-8 px-8'
        >

          <h2 className='text-4xl dark:text-white font-bold text-center'>Register</h2>

          <div className='flex flex-col text-white py-2'>
            <label>Email</label>
            <input
              className='rounded-lg bg-gray-700 mt-2 p-2 focus:border-blue-500 focus:bg-gray-800 focus:outline-none'
              type='email'
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className='flex flex-col text-white py-2'>
            <label>Username</label>
            <input
              className='p-2 rounded-lg bg-gray-700 mt-2 focus:border-blue-500 focus:bg-gray-800 focus:outline-none'
              type='text'
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className='flex flex-col text-white py-2'>
            <label>Password</label>
            <input
              className='p-2 rounded-lg bg-gray-700 mt-2 focus:border-blue-500 focus:bg-gray-800 focus:outline-none'
              type='password'
              value={passwordreg}
              onChange={handlePasswordChange}
            />
          </div>

          <div className='flex flex-col text-white py-2'>
            <label>Confirm Password</label>
            <input
              className='p-2 rounded-lg bg-gray-700 mt-2 focus:border-blue-500 focus:bg-gray-800 focus:outline-none'
              type='password'
              value={passwordConfirm}
              onChange={handlePasswordConfirmChange}
            />
          </div>

          {passwordMatchError}

          <button
            onClick={regist}
            className='w-full my-5 py-2 bg-pink-600 shadow-lg hover:shadow-pink-500 text-white font-semibold rounded-lg'
          >
            Register
          </button>

          <div className='flex justify-center items-center text-white'>
            <p className='mr-1'>Already have an account?</p>
            <Link to='/login' className='text-green-500 font-semibold'>
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}