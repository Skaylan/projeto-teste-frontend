"use client"

import { commentView, postView, replyView } from "@/app/feed/page"
import { MessageCircle, SendHorizonal, ThumbsUp } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import ReplyForm from "./ReplyForm"
import { convertDatetime } from "./utils"
import Cookies from "js-cookie"

export interface propView {
  post: postView
}

export default function NewPost({ post }: propView) {
  const [commentIsOpen, setCommentIsOpen] = useState<boolean>(false)
  const [commentValue, setCommentValue] = useState<string>('')
  const [comments, setComments] = useState<commentView[]>(post.comments)

  function handleCommentButton() {
    setCommentIsOpen(!commentIsOpen)
  }

  function handleSendButton(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const onwerId = Cookies.get('userId')
    const payload = {
      "post_id": post.post_id,
      "comment": commentValue,
      "owner_id": onwerId
    }

    fetch(`http://localhost:5000/api/comment_on_post`, {
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
        setComments(oldComments => [data.comment, ...oldComments])
        console.log(data)
      })
      .catch(error => {
        console.error(error)
      })
  }


  return (
    <>
      <div className="flex flex-col gap-1 w-[600px] shadow-full rounded p-2">
        <div className="flex w-[100%] gap-2 items-center">
          <Image className="rounded-[100%]" width={30} height={30} src={'https://placehold.co/30x30'} alt="commentor profile picture" />
          <span className="text-md">{post.user_full_name}</span>
        </div>
        <div className="flex w-[100%] h-[50px] items-center rounded bg-gray-100">
          <p className="pl-2 text-sm">{post.post_content}</p>
        </div>
        <div className="flex w-[100%] justify-end">
          <span className="text-xs">{convertDatetime(post.created_at)}</span>
        </div>
        <div  className="flex flex-col items-start w-[100%] gap-2 overflow-auto">
          <div className="flex w-[100%] gap-2">
            <button className="flex gap-2 items-center rounded p-1 hover:bg-gray-200" ><ThumbsUp size={20} /> Like</button>
            <button className="flex items-center gap-1 rounded p-1 hover:bg-gray-200" onClick={handleCommentButton}><MessageCircle size={20} /> comentários</button>
          </div>
          {
            !commentIsOpen ? null :
            <div className="flex flex-col w-[100%]">
              <form onSubmit={handleSendButton} className="flex w-[100%] gap-1">
                <input onChange={(e) => setCommentValue(e.target.value)} className="w-[100%] p-2 bg-slate-200 rounded" type="text" placeholder="comentar" value={commentValue} required/>
                <button type="submit" className="rounded p-2 bg-black text-md text-white flex gap-1 items-center">enviar <SendHorizonal size={20} /> </button>
              </form>
              <div className="pt-2">
                {
                  comments.length === 0 || comments[0].comment_content === null ? 
                  <div className="w-[100%] bg-gray-100" key={post.post_id}>
                    <span className="text-slate-300">Seja o primeiro a comentar</span>
                  </div>
                  :
                  comments.map((comment: commentView) => {
                    return (
                      <div className="p-2 flex flex-col gap-1 w-[100%]" key={comment.comment_id}>
                        <div className="flex items-center gap-2">
                          <Image className="rounded-[100%]" width={30} height={30} src={'https://placehold.co/30x30'} alt="commentor profile picture" />
                          <span className="text-xs">{comment.user_full_name}</span>
                        </div>
                        <div className="flex items-center pl-4 bg-gray-100 min-h-[40px]">
                          <p className="text-sm">{comment.comment_content}</p>
                        </div>
                        <div className="flex w-[100%]">
                          <ReplyForm commentId={comment.comment_id} postId={post.post_id} />
                        </div>
                      </div>
                    )
                  })

                }
              </div>
            </div> 
          }
        </div>
      </div>
    </>
  )
}