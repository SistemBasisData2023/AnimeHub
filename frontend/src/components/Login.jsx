import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Axios from 'axios';
import LoginImg from '../assets/LoginImg.jpg';

export default function Login({ onLogin }) {
  const [emaillogin, setEmail] = useState('');
  const [passwordlogin, setPassword] = useState('');
  const navigate = useNavigate();

  const login = (e) => {
    e.preventDefault();
    Axios.post('http://localhost:5500/login', {
      email: emaillogin,
      password: passwordlogin,
    }, {
      withCredentials: true,
    })
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          onLogin();
          navigate('/', { replace: true });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };
  


  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 h-screen w-full">
      <div className="hidden sm:block">
        <img className="w-full max-h-screen object-cover" src={LoginImg} alt="" />
      </div>
      <div className="bg-indigo-400 flex flex-col justify-center relative">
        <form onSubmit={login} className="max-w-[400px] w-full mx-auto rounded-lg bg-cyan-700 p-8 px-8">
          <h2 className="text-4xl dark:text-white font-bold text-center">Welcome Back</h2>
          <div className="flex flex-col text-white py-2">
            <label>Email</label>
            <input
              className="rounded-lg bg-gray-700 mt-2 p-2 focus:border-blue-500 focus:bg-gray-800 focus:outline-none"
              type="email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex flex-col text-white py-2">
            <label>Password</label>
            <input
              className="p-2 rounded-lg bg-gray-700 mt-2 focus:border-blue-500 focus:bg-gray-800 focus:outline-none"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full my-5 py-2 bg-teal-500 shadow-lg teal-500/50 hover:shadow-teal-500/40 text-white font-semibold rounded-lg"
          >
            Login
          </button>
          <div className="flex justify-center items-center text-white">
            <p className="mr-1">New Here?</p>
            <Link to="/register" className="text-green-500 font-semibold">
              Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
