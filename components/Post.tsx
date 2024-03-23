"use client"

import { useEffect, useRef, useState } from "react"
import { convertDatetime } from "./utils"
import Image from "next/image"
import ReplyForm from "./ReplyForm"
import Cookies from "js-cookie"
import { ThumbsUp, MessageCircle, SendHorizonal, MoreHorizontal, Trash2, Flag } from "lucide-react"
import { comment, post } from "./TypesAndInterfaces"


export default function Post({content, id, owner_info, created_at, func, commentsAmout, image}: post) {

  const [comments, setComments] = useState<comment[]>([])
  const [commentIsOpen, setCommentIsOpen] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [commentValue, setCommentValue] = useState<string>('')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [paginationEnds, setPaginationEnds] = useState<boolean>(false)
  const [moreModalState, setMoreModalState] = useState<boolean>(false)
  const [commentsFirstFetch, setCommentsFirstFetch] = useState<boolean>(false)
  const [newCommentsAmout, setNewCommentsAmout] = useState<number>(0)
  const [userId, setUserId] = useState<string>('')

  const ref: React.RefObject<HTMLDivElement> = useRef(null)

  function handleDeleteButton() {
    const payload = {
      "post_id": id,
    }
    
    fetch('http://localhost:5000/api/delete_post', {
      method: "DELETE",
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
      // console.log(data.message)
      func()
    })
    .catch(error => {
      console.error(error)
    })
  }

  function fetchPostComments() {
    if (!commentIsOpen) {
      setIsLoading(true)
      fetch(`http://localhost:5000/api/get_post_comments?post_id=${id}&page=1`, {
        method: "GET",
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(res => {
        return res.json()
      })
      .then(data => {
        setComments(data.comments)
        setCurrentPage(currentPage + 1)
        setIsLoading(false)
      })
      .catch(error => {
        console.error(error)
      })
    }
  }

  function handleSendButton(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const onwerId = Cookies.get('userId')
    const payload = {
      "post_id": id,
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
        setIsLoading(false)
      })
      .catch(error => {
        console.error(error)
      })
      setCommentValue('')
      setNewCommentsAmout(newCommentsAmout + 1)
  }

  function handleSeeMoreButton() {
    fetch(`http://localhost:5000/api/get_post_comments?post_id=${id}&page=${currentPage}`, {
        method: "GET",
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(res => {
        return res.json()
      })
      .then(data => {
        setComments(oldComments => [...oldComments, ...data.comments])
        if (data.comments.length !== 0) {
          setCurrentPage(currentPage + 1)
        } else if (data.comments.length === 0) {
          setPaginationEnds(true)
        }
        setIsLoading(false)
      })
      .catch(error => {
        console.error(error)
      })
  }

  function handleCommentButton() {
    setCommentIsOpen(!commentIsOpen)
    if (!commentsFirstFetch) {
      fetchPostComments()
      setCommentsFirstFetch(true)
    }
  }


  useEffect(() => {
    setUserId(Cookies.get('userId')!)
    const handleOutSideClick = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) {
        setMoreModalState(false)
      }
    };

    window.addEventListener("mousedown", handleOutSideClick);

    return () => {
      window.removeEventListener("mousedown", handleOutSideClick);
    };
  }, [ref])

  return (
    <>
      <div className="flex flex-col gap-1 w-[600px] shadow-full rounded p-2">
        <div className="flex w-[100%] gap-2 items-center">
          <div className="flex gap-2 w-[90%]">
            <Image className="rounded-[100%] h-auto w-auto" width={30} height={30} src={'https://placehold.co/30x30'} alt="commentor profile picture" />
            <span className="text-md">{owner_info.name}</span>
          </div>
          <div ref={ref} className="flex relative">
            <button className="flex" onClick={() => setMoreModalState(!moreModalState) }>
              <MoreHorizontal />
            </button>
            {
              moreModalState ?
              <div className="absolute top-[90%] z-10 flex flex-col w-[150px] h-[200px] bg-white shadow-full">
                <button className="flex items-center gap-1 p-2 hover:bg-gray-300">
                  <Flag />
                  Reportar
                </button>
                {
                  owner_info.id === userId ? <button onClick={handleDeleteButton} className="flex items-center gap-1 p-2 text-red-600 hover:bg-gray-300"><Trash2 color="red" /> Apagar</button> : null 
                }
              </div>
              : null
            }
          </div>
        </div>
        <div className="flex w-[100%] h-[50px] items-center rounded bg-gray-50">
          <p className="pl-2 text-sm">{content}</p>
        </div>
        {
          image ? 
            <div className="w-full flex items-center justify-center">
              <Image className="w-auto h-auto" src={`data:image/jpeg;base64,${image}`} width={500} height={300} alt="post image"/>
            </div>
          : null
        }
        <div className="flex w-[100%] justify-end">
          <span className="text-xs">{convertDatetime(created_at)}</span>
        </div>
        <div className="flex flex-col items-start w-[100%] gap-2 overflow-auto">
          <div className="flex w-[100%] gap-2">
            <button className="flex gap-2 items-center rounded p-1 hover:bg-gray-200" ><ThumbsUp size={20} /> Like</button>
            {
              commentsAmout > 1 ? <button className="flex items-center gap-1 rounded p-1 hover:bg-gray-200" onClick={handleCommentButton}><MessageCircle size={20} /> <span className="text-xs">{commentsAmout + newCommentsAmout}</span> comentários</button>
              : <button className="flex items-center gap-1 rounded p-1 hover:bg-gray-200" onClick={handleCommentButton}><MessageCircle size={20} /> <span className="text-xs">{commentsAmout}</span> comentário</button>
            }
             
          </div>
          
          {
            isLoading ? <span>Carregando comentários...</span> :
          
            commentIsOpen ?
            <div className="flex flex-col w-[100%] ">
              <form onSubmit={handleSendButton} className="flex w-[100%] gap-1">
                <input onChange={(e) => setCommentValue(e.target.value)} className="w-[100%] p-2 bg-slate-200 rounded" type="text" placeholder="comentar" value={commentValue} required/>
                <button type="submit" className="rounded p-2 bg-black text-md text-white flex gap-1 items-center">enviar <SendHorizonal size={20} /> </button>
              </form>
              <div className="pt-2 overflow-scroll max-h-[300px]">
                {
                  comments?.length === 0 ?
                    <div className="w-[100%] bg-gray-100">
                      <span className="text-slate-300">Seja o primeiro a comentar</span>
                    </div>
                  : comments?.map((comment: comment) => (
                    <div className="p-2 flex flex-col gap-1 w-[100%]" key={comment.id}>
                      <div className="flex items-center gap-2">
                        <Image className="rounded-[100%]" width={30} height={30} src={'https://placehold.co/30x30'} alt="commentor profile picture" />
                        <span className="text-xs">{comment.owner.name}</span>
                      </div>
                      <div className="flex items-center pl-4 bg-gray-100 min-h-[40px]">
                        <p className="text-sm">{comment.comment}</p>
                      </div>
                      <div className="flex w-[100%]">
                        <ReplyForm commentId={comment.id} postId={id} />
                      </div>
                    </div>
                  ))
                }
                <div className="w-[100%] flex">
                  {
                    !paginationEnds ? <button onClick={handleSeeMoreButton} className="p-1 text-xs underline hover:bg-gray-300 rounded-md">carregar mais</button> : <span className="text-sm text-slate-400">sem mais comentários</span>
                  }
                </div>
              </div>
            </div>
            
            : null
          }
          
        </div>
      </div>
    </>
  )
}