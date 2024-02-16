"use client"

import { useEffect, useState } from "react"
import Cookies from "js-cookie"
import { SendHorizonal } from "lucide-react"


export interface reply {
  id: string,
  owner_id: string,
  comment: string,
  created_at: Date,
}

export default function ReplyForm(props: any) {
  const [replyIsOpen, setReplyIsOpen] = useState<boolean>(false)
  const [replyFirstFetch, setReplyFirstFetch] = useState<boolean>(false)
  const [replyValue, setReplyValue] = useState('')
  const [userId, setUserId] = useState<string>('')
  const [replies, setReplies] = useState<reply[]>([])
  
  useEffect(() => {
    const userId = Cookies.get('userId')
    setUserId(userId!)
  
  })

  function handleSubmitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const payload = {
      "reply_message": replyValue,
      "post_id": props.postId,
      "comment_id": props.commentId,
      "owner_id": userId,
    }

    fetch('http://localhost:5000/api/reply_comment', {
      method: 'POST',
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
      setReplies(oldReplies => [data.reply, ...oldReplies])
    })
    .catch(error => {
      console.error(error)
    })

    setReplyValue('')
  }

  function fetchCommetReplies() {
    if (!replyIsOpen) {
      fetch(`http://localhost:5000/api/get_comment_replies?comment_id=${props.commentId}`, {
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
        setReplies(data.replies)
      })
      .catch(error => {
        console.error(error)
      })
    }
  }

  function handleOpenReplyButton() {
    setReplyIsOpen(!replyIsOpen)
    if (!replyFirstFetch) {
      fetchCommetReplies()
      setReplyFirstFetch(true)
    }
  }


  
  return (
    <>
      <div className="w-[100%] flex flex-col items-start">
        <div className="w-[100%] flex gap-2">
          <button className="text-xs p-1 hover:bg-gray-200 rounded">like</button>
          <button className="text-xs p-1 hover:bg-gray-200 rounded" onClick={handleOpenReplyButton}>responder</button>
        </div>
        {
          replyIsOpen ? 
          <div className="flex w-[100%]">
            <div className="w-[1px] h-[100%] ml-3 bg-black"></div>
            <div className="w-[100%] gap-1 pl-2 rounded flex flex-col">
              {
                replies.length === 0 ? null : 
                replies.map(reply => (
                  <div key={reply.id} className="flex flex-col justify-center w-[100%] bg-gray-50">
                    <span className="text-sm">{reply.comment}</span>
                  </div>
                ))
              }
              <form onSubmit={handleSubmitForm} className="flex w-[100%]">
                <input onChange={(e) => setReplyValue(e.target.value)} value={replyValue} className="w-[100%] p-1 bg-slate-200 rounded" type="text" placeholder="responder" required /> 
                <button type="submit" className="flex items-center justify-center w-[40px] bg-black text-sm text-white"><SendHorizonal /></button>
              </form>
            </div>
          </div>
          : null
        }
      </div>
    </>
  )
};
