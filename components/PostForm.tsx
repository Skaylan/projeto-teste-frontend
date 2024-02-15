"use client"
import { ReactPropTypes, useState } from "react"
import Cookies from "js-cookie"

interface prop {
  func: Function
}

export default function PostForm({ func }: prop) {
  const [content, setContent] = useState('')
  const id = Cookies.get("userId")



  function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const payload = {
      'owner_id': id,
      'content': content
    }

    fetch('http://localhost:5000/api/create_post', {
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
      console.log(data)
    })
    .catch(error => {
      console.error(error)
    })
    setContent('')
    func()
  }



  return (
    <>
      <form onSubmit={handleFormSubmit} className="flex flex-col gap-1 w-[600px] h-[150px] p-2 shadow-full rounded">
        <div className="flex flex-col">
          <label htmlFor="content">Menssagem</label>
          <textarea onChange={(e) => {setContent(e.target.value)}} value={content} className="bg-gray-100 resize-none p-2" placeholder="Em que você está pensando?" name="content" id="content" cols={30} rows={2} required></textarea>
        </div>
        <div className="w-[100%] h-[40px] flex items-center">
          <button type="submit" className="w-40 bg-black text-white text-xl">Postar</button>
        </div>
      </form>
    </>
  )
}