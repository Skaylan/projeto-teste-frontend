"use client"

import GroupSideBar from "@/components/GroupSideBar";
import Header from "@/components/Header";
import { useEffect, useState } from "react";
import getUserGroupFeed from "./server";
import Cookies from "js-cookie";
import { post } from "@/components/TypesAndInterfaces";
import Post from "@/components/Post";

export default function page() {
  const [posts, setPosts] = useState<post[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [callData, setCallData] = useState<boolean>(false)

  useEffect(() => {
    setIsLoading(true)
    const promise = Promise.resolve(getUserGroupFeed(Cookies.get('userId')!))
    promise.then((value) => {
      setPosts(value.posts)
      setIsLoading(false)
    })
  }, [callData])

  return (
    <>
      <Header />
      <GroupSideBar />
      <main className="w-full h-[100vh] flex flex-col items-center justify-center">
        {
          isLoading ? <h1>Loading...</h1> :
          posts.length === 0 ? <h1>Não ha nenhuma publicação dos seus grupos</h1> :
          posts.map((post: post) => (
            <Post func={() => setCallData(!callData)} content={post.content} commentsAmout={post.commentsAmout} created_at={post.created_at} id={post.id} owner_info={post.owner_info} image={post.image} key={post.id} />
          ))
        }
      </main>
    </>
  )
};
