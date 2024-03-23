"use client"

import { useEffect, useState } from "react"
import Cookies from "js-cookie";
import Image from "next/image";
import { X } from "lucide-react";
import { FriendType } from "./TypesAndInterfaces";


export default function FriendMenu() {
  const [friends, setFriends] = useState<FriendType[]>([])
  const [friendIsLoading, setFriendIsLoading] = useState<boolean>(true)


  async function getFriends() {
    setFriendIsLoading(true)
    const user_id = Cookies.get('userId');
    const response = await fetch(`http://localhost:5000/api/get_user_friends?user_id=${user_id}`, {
      method: "GET",
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    const data = await response.json();
    setFriends(data.friends)
    setFriendIsLoading(false)
  }

  useEffect(() => {
    getFriends()
  }, [])

  return (
    <>
      <div className="bg-white flex flex-col w-[300px] h-[300px] ">
        {/* <div className="w-[100%] flex justify-center p-2">
          <div className="w-[85%] flex justify-center">
            <h3>Lista de amigos</h3>
          </div>
          <div className="w-[15%]">
            <button><X /></button>
          </div>
        </div> */}
        <div className="w-[100%] flex flex-col gap-1 p-2">
          {
            friendIsLoading ?
            <div className="w-[100%] flex justify-center">
              <span>Carregando...</span>
            </div> :
            friends.length === 0 ?
            <div className="w-[100%] flex justify-center">
              <span className="text-sm text-slate-400">Você Ainda não tem amigos 😢</span>
            </div>
            :
            friends.map((friend) => (
              <div className="w-[100%] bg-slate-100 rounded p-1 hover:bg-slate-300" key={friend.id}>
                <a className="flex gap-1" href={`/user/profile?user_id=${friend.friend.id}`}>
                  <Image className="rounded-full" src="https://placehold.co/30x30" width={30} height={30} alt="" />
                  <span className="pl-2 ">{friend.friend.name}</span>
                </a>
              </div>
            ))}
        </div>
      </div>
    </>
  )
}