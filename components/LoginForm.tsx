// components/LoginForm.tsx
"use client";
import { useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { redirect } from "next/navigation";

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const loginData = {
      email,
      password
    };
    fetch("http://localhost:5000/api/authenticate_user", {
      method: "POST",
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginData)
    })
    .then(res => res.json())
    .then(data => {
      if (data.token) {
        Cookies.set('token', data.token);
        Cookies.set('userId', data.user.id);
        window.location.replace(`/user/${data.user.id}`)
      } else if (data.status === 'error'){
        setMessage(data.message);
      }
    })
    .catch(error => {
      console.error(error);
    });
  }

  return (
    <form onSubmit={handleLogin} className="flex flex-col gap-4 items-center">
      <div className="flex flex-col w-80">
        <label htmlFor="email" className="text-gray-600">Email</label>
        <input 
          className="p-2 w-full h-9 bg-gray-100 border rounded-md" 
          onChange={(e) => setEmail(e.target.value)} 
          value={email} 
          type="email" 
          name="email" 
          id="email" 
          placeholder="Email"
        />
      </div>
      <div className="flex flex-col w-80">
        <label htmlFor="password" className="text-gray-600">Password</label>
        <input 
          className="p-2 w-full h-9 bg-gray-100 border rounded-md" 
          onChange={(e) => setPassword(e.target.value)} 
          value={password} 
          type="password" 
          name="password" 
          id="password" 
          placeholder="Password"
        />
      </div>
      <button type="submit" className="w-80 bg-blue-500 text-white text-2xl rounded-md p-1 hover:bg-blue-600 transition duration-300">Login</button>
      {message && 
        <div className="bg-red-100 text-red-600 text-sm p-2 rounded-md">
          <span>{message}</span>
        </div>
      }
    </form>
  );
}

export default LoginForm;