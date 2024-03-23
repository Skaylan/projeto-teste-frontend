"use client"
import { useEffect, useState } from "react"
import { Heart } from "lucide-react"
import Cookies from "js-cookie"
import Header from "@/components/Header"
import { user } from "@/components/TypesAndInterfaces"
import { Suspense } from "react";
import Image from "next/image"
import { convertDatetime } from "@/components/utils"
import { useSearchParams } from "next/navigation"

export default function Page() {
  const [users, setUsers] = useState<user[]>([])
  const [friendsIds, setFriendsIds] = useState<string[]>([])
  const userId = Cookies.get('userId')
  const searchParams = useSearchParams()

  async function getUsers() {
      const search = searchParams.get('search')
      const response = await fetch(`http://localhost:5000/api/get_users?search=${search}`, {
      method: "GET",
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()
    const userIds = []
    for (const user of data.users) {
      userIds.push(user.id)
    }
    if (userIds.includes(userId)) {
      setUsers(data.users.filter((user: user) => user.id !== userId))
    } else {
      setUsers(data.users)
    }
  }

  function handleForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const hiddenInputValue = formData.get('friendId') as string;

    const payload = {
      user_id: userId,
      friend_id: hiddenInputValue
    }
    
    fetch(`http://localhost:5000/api/add_friend`, {
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
      window.location.reload()
    })
    .catch(error => {
      console.error(error)
    })
  }
  
  async function getCurrentUserFriendsList() {
    const response = await fetch(`http://localhost:5000/api/get_user_friends?user_id=${userId}`, {
      method: "GET",
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()
    const ids = data.friends.map((friend: any) => friend.friend_id)
    if (ids.includes(userId)) {
      ids.splice(ids.indexOf(userId), 1)
    }
    setFriendsIds(ids)
  }
  
  useEffect(() => {
    getUsers()
    getCurrentUserFriendsList()
  }, [])

  return (
    <Suspense>
      <main>
        <Header />
        <div className="flex flex-col w-[100%] items-center pt-16 gap-4">
          {
            users.map((user: user) => (
              <div className="flex flex-col w-[300px] gap-2 shadow-full p-2" key={user.id}>
                <form onSubmit={(e) => {handleForm(e)}} className="flex flex-col gap-2">
                  <div className="flex w-[100%] items-center gap-2">
                    <Image className="rounded-full" src={'https://placehold.co/30x30'} alt="profile picure" width={30} height={30} />
                    <span>{user.name}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-slate-500">Tipo: {user.user_type.descr}</span>
                    <span className="text-slate-500">Desde: {convertDatetime(user.created_at)}</span>
                  </div>
                  <input readOnly type="hidden"  name="friendId" defaultValue={user.id}/>
                  <div className="flex w-[100%] justify-center">
                    {
                    friendsIds.includes(user.id) ? <span className="flex gap-1"><Heart size={20} fill="#f00" color="#f00" /> Amigo</span> : 
                    <button type="submit" className="flex items-center gap-1 p-1 bg-black text-white rounded-md"><Heart size={20} color="#f00" /> Tornar amigo</button>
                    }
                  </div>
                </form>
              </div>
            ))
          }
        </div>
      </main>
    </Suspense>
  )
}