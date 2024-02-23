"use client"

import FriendMenu from "@/components/FriendMenu";
import Header from "@/components/Header";
import NewPost from "@/components/NewPost";
import Post, { post } from "@/components/Post";
import PostForm from "@/components/PostForm";
import Cookies from "js-cookie";
import { PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";

export interface replyView {
  reply_id: string,
  reply_content: string,
  reply_owner_id: string
} 

export interface commentView {
  comment_id: string,
  comment_content: string,
  comment_owner_id: string,
  replies: replyView[],
  user_full_name: string
}
export interface postView {
  comments: commentView[],
  post_id: string,
  post_content: string,
  post_owner_id: string
  user_full_name: string,
  user_id: string,
  created_at: Date
}

export default function Page() {
  const [callData, setCallData] = useState<boolean>(false)
  const [posts, setPosts] = useState<postView[]>()
  const [loading, setLoading] = useState<boolean>(false)
  
  async function getUserFeedView() {
    setLoading(true)
    const id = Cookies.get('userId')
    await fetch(`http://localhost:5000/api/test_view`, {
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
      setPosts(data.payload.posts)
      console.log(data.payload.posts)
      setLoading(false)
    })
  }
  // async function getUserFeed() {
  //   setLoading(true)
  //   const id = Cookies.get('userId')
  //   await fetch(`http://localhost:5000/api/generate_feed?user_id=${id}`, {
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
  //     setPosts(data.posts)
  //     setLoading(false)
  //   })
  // }

  useEffect(() => {
    const token = Cookies.get('token')
    getUserFeedView()
  }, [])

  return (
    <>
    <Header />
      <main className="w-[100%] flex flex-col gap-10 items-center pt-4">
        <div className="fixed flex top-[50%] left-[77%]">
          <FriendMenu />
        </div>
        <div>
          <PostForm func={() => setCallData(!callData)} />
        </div>
        <div className="flex flex-col gap-4 w-[100%] justify-center items-center pb-4">
          {
            loading ? <span>Loading...</span> :
            posts?.length === 0 ? <span className="text-slate-400">Não possui postagens!</span> :
            posts?.map((post: postView) => (
              <NewPost post={post} key={post.post_id}/>
            ))
          }
          {/* {
            loading ? <span>Loading...</span> : 
            posts?.length === 0 ? <span className="text-slate-400">Não possui postagens!</span> :
            posts?.map((post: post) => (
              <Post func={() => setCallData(!callData)} content={post.content} created_at={post.created_at} id={post.id} owner_info={post.owner_info} key={post.id} />
            ))
          } */}
        </div>
        <div>
          <button>
            <PlusIcon />
          </button>
        </div>
      </main>
    </>
  )
}