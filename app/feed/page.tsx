"use client"

import Header from "@/components/Header";
import Post, { post } from "@/components/Post";
import PostForm from "@/components/PostForm";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";


export default function Page() {
  const [callData, setCallData] = useState<boolean>(false)
  const [posts, setPosts] = useState<post[]>()
  const [loading, setLoading] = useState<boolean>(false)
  
  async function getUserFeed() {
    setLoading(true)
    const id = Cookies.get('userId')
    await fetch(`http://localhost:5000/api/generate_feed?user_id=${id}`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => {
      return res.json()
    })
    .then(data => {
      setPosts(data.posts)
      setLoading(false)
    })
  }

  useEffect(() => {
    const token = Cookies.get('token')
    if (!token) {
      window.location.replace('/')
    }
    getUserFeed()
  }, [callData])

  return (
    <>
    <Header />
      <main className="w-[100%] flex flex-col gap-10 items-center pt-4">
        <div>
          <PostForm func={() => setCallData(!callData)} />
        </div>
        <div className="flex flex-col gap-4 w-[100%] justify-center items-center pb-4">
          {
            loading ? <span>Loading...</span> : 
            posts?.length === 0 ? <span className="text-slate-400">Não possui postagens!</span> :
            posts?.map((post: post) => (
              <Post func={() => setCallData(!callData)} content={post.content} created_at={post.created_at} id={post.id} owner_info={post.owner_info} key={post.id} />
            ))
          }
        </div>
      </main>
    </>
  )
}