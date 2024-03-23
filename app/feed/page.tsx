"use client"

import AsideMenu from "@/components/AsideMenu";
import FriendMenu from "@/components/FriendMenu";
import Header from "@/components/Header";
import NewPost from "@/components/NewPost";
import Post from "@/components/Post";
import PostForm from "@/components/PostForm";
import { post } from "@/components/TypesAndInterfaces";
import Cookies from "js-cookie";
import { Heart, Minus, X } from "lucide-react";
import { useEffect, useState } from "react";
import generateFeed from "./server";


export const dynamic = "force-dynamic"

export default function Page() {
  const [callData, setCallData] = useState<boolean>(false)
  const [posts, setPosts] = useState<post[]>()
  const [loading, setLoading] = useState<boolean>(false)
  const [friendMenuIsOpen, setFriendMenuIsOpen] = useState<boolean>(false)

  
  // async function getUserFeedView() {
  //   setLoading(true)
  //   const id = Cookies.get('userId')
  //   await fetch(`http://localhost:5000/api/test_view`, {
  //     method: 'GET',
  //     mode: 'cors',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     }
  //   })
  //   .then(res => {
  //     return res.json()
  //   })
  //   .then(data => {
  //     setPosts(data.payload.posts)
  //     console.log(data.payload.posts)
  //     setLoading(false)
  //   })
  // }

  // async function getUserFeed() {
  //   setLoading(true)
  //   const id = Cookies.get('userId')
  //   await fetch(`http://localhost:5000/api/generate_feed?user_id=${id}`, {
  //     method: 'GET',
  //     mode: 'cors',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     next: {
  //       revalidate: 10
  //     },
  //   })
  //   .then(res => {
  //     return res.json()
  //   })
  //   .then(data => {
  //     console.log(data)
  //     setPosts(data.posts)
  //     setLoading(false)
  //   })
  // }

  function handleFriendMenuButton() {
    setFriendMenuIsOpen(!friendMenuIsOpen)
  }

  useEffect(() => {
    // getUserFeedView()

      setLoading(true)
      const id = Cookies.get('userId')
      const promise = Promise.resolve(generateFeed(id!))
      promise.then((value) => {
        setPosts(value.posts)
        setLoading(false)
      })

    // getUserFeed()
  }, [callData])

  return (
    <>
      <Header />
      <AsideMenu />
      <main className="w-[100%] flex flex-col gap-10 items-center pt-16">
        {
          friendMenuIsOpen ?
          <div className="w-[300px] h-[340px] fixed flex flex-col items-start pt-2 top-[43%] left-[77%] shadow-full rounded-md">
            <div onClick={handleFriendMenuButton} className="cursor-pointer w-[100%] flex">
              <div className="flex items-center justify-center gap-2 w-[90%]">
                <span>Lista de Amigos</span>
                <Heart size={20} fill="red" />
              </div>
              <div className="flex w-[10%]">
                <button onClick={handleFriendMenuButton}>
                  <X />
                </button>
              </div>
            </div>
            <div>
              <FriendMenu />
            </div>
          </div>
          
          :
          <div onClick={handleFriendMenuButton} className="cursor-pointer w-[300px] h-[40px] fixed flex top-[92%] left-[77%] shadow-full rounded-md">
            <div className="flex items-center justify-center gap-2 w-[90%]">
              <span>Lista de Amigos</span>
              <Heart size={20} fill="red" />
            </div>
            <div className="flex w-[10%]">
              <button onClick={handleFriendMenuButton}>
                <Minus />
              </button>
            </div>
          </div>
        }
        {/* <div className="fixed flex flex-col top-[43%] left-[77%] shadow-full rounded-md">
        </div> */}
        <div>
          <PostForm func={() => setCallData(!callData)} />
        </div>
        <div className="flex flex-col gap-4 w-[100%] justify-center items-center pb-4">
          {
            loading ? <span>Loading...</span> : 
            posts?.length === 0 ? <span className="text-slate-400">Não possui postagens!</span> :
            posts?.map((post: post) => (
              <Post func={() => setCallData(!callData)} content={post.content} commentsAmout={post.commentsAmout} created_at={post.created_at} id={post.id} owner_info={post.owner_info} image={post.image} key={post.id} />
            ))
          }
        </div>
      </main>
    </>
  )
}