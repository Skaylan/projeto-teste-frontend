"use client"

import { useState } from "react";
import Cookies from "js-cookie"
import Header from "@/components/Header";

export default function Home() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  function handleLogin(e: any) {
    e.preventDefault()
    const payload = {
      "email": email,
      "password": password
    }
    fetch("http://localhost:5000/api/authenticate_user", {
      method: "POST",
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    .then(res => {
      return res.json()
    })
    .then(data => {
      if (data.token) {
        console.log(data.user)
        Cookies.set('token', data.token)
        Cookies.set('userId', data.user.id)
        window.location.replace(`/user/${data.user.id}`)
      } else if (data.status === 'error'){
        setMessage(data.message)
      }
    })
    .catch(error => {
      console.error(error)
    })
  }

  return (
    <>
      <Header />
      <main className="w-[100%] h-[100vh] flex flex-col items-center justify-center">
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="flex flex-col">
            <label htmlFor="email">Email</label>
            <input className="p-2 w-80 h-9 bg-gray-200 border-b-[1px] border-black" onChange={(e) => {setEmail(e.target.value)}} value={email} type="email" name="email" id="email" placeholder="Email"/>
          </div>
          <div className="flex flex-col">
            <label htmlFor="password">Senha</label>
            <input className="p-2 w-80 h-9 bg-gray-200 border-b-[1px] border-black" onChange={(e) => {setPassword(e.target.value)}} value={password} type="password" name="password" id="password" placeholder="Senha"/>
          </div>
          <button type="submit" className="w-80 bg-black text-white text-2xl">Acessar</button>
          {message ? 
            <div className="flex items-center justify-center bg-red-600 text-white">
              <span>{message}</span>
            </div>
          : ''}
        </form>
      </main>
    </>
  );
}
