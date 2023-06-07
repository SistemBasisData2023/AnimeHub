import React, { useState } from 'react';
import RegisterImg from '../assets/RegisterImg.jpg';
import { Link } from 'react-router-dom';
import Axios from "axios";

export default function Register() {
  const [emailreg, setEmail] = useState('');
  const [usernamereg, setUsername] = useState('');
  const [passwordreg, setPassword] = useState('');

  const regist = () =>{
    Axios.post("http://localhost:3001/register", {
      email: emailreg,
      username: usernamereg,
      password: passwordreg,
    }).then((response) => {
      console.log(response);
    });
  };
  
return (
    <div className='grid grid-cols-1 sm:grid-cols-2 h-screen w-full'>
      <div className='hidden sm:block'>
        <img className='w-full max-h-screen object-cover' src={RegisterImg} alt='' />
      </div>

      <div className='bg-purple-300 flex flex-col justify-center relative'>
        <form className='max-w-[400px] w-full mx-auto rounded-lg bg-teal-600 p-8 px-8'>
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
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            onClick={regist}
            className='w-full my-5 py-2 bg-teal-400 shadow-lg teal-300/50 hover:shadow-teal-300/40 text-white font-semibold rounded-lg'
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