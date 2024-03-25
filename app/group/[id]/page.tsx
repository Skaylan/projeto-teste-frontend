"use client"

import GroupSideBar from "@/components/GroupSideBar";
import Header from "@/components/Header";
import Post from "@/components/Post";
import PostForm from "@/components/PostForm";
import { post } from "@/components/TypesAndInterfaces";
import { useEffect, useState } from "react";


async function getGroupFeed(groupId: string) {

  const res = await fetch(`http://localhost:5000/api/generate_group_feed?group_id=${groupId}`, {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    cache: 'no-store'
  });
  
  if (!res.ok) {
    throw new Error('Failed to get group feed');
  }
  
  const data = await res.json();
  return data
}

export default function page({ params }: { params: { id: string } }) {
  const [posts, setPosts] = useState<post[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [callData, setCallData] = useState<boolean>(false)


  useEffect(() => {
    const promise = Promise.resolve(getGroupFeed(params.id))
    promise.then((value) => {
      console.log(value)
      setPosts(value.posts)
    })
  }, [callData])

  return (
    <>
      <Header />
      <GroupSideBar />
      <main className="dislay flex flex-col w-full h-[100vh] items-center pt-16 gap-10">
        <div>
          <PostForm func={() => {setCallData(!callData)}} isGroup={true} groupId={params.id} />
        </div>
        <div className="flex flex-col gap-4 w-[100%] justify-center items-center pb-4">
          {
            loading ? <span>Loading...</span> : 
            posts?.length === 0 ? <span className="text-slate-400">Esse grupo ainda não possui postagens!</span> :
            posts?.map((post: post) => (
              <Post func={() => setCallData(!callData)} content={post.content} commentsAmout={post.commentsAmout} created_at={post.created_at} id={post.id} owner_info={post.owner_info} image={post.image} key={post.id} />
            ))
          }
        </div>
      </main>
    </>
  )
};
