"use client"
import { SetStateAction, useState } from "react"
import Image from "next/image" 
import Cookies from "js-cookie"
import { CalendarDays, Film, ImageIcon, X } from "lucide-react"
import { readFileAsBase64 } from "./utils"

interface prop {
  func: Function
}

export default function PostForm({ func }: prop) {
  const [content, setContent] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [imageBase64, setImageBase64] = useState<string>('')
  const [isImageUpload, setIsImageUpload] = useState<boolean>(false)
  const id = Cookies.get("userId")

  function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const payload = {
      'owner_id': id,
      'content': content,
      'image': imageBase64,
      'has_image': false
    }

    if (isImageUpload) {
      payload.has_image = true
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
      // console.log(data)
    })
    .catch(error => {
      console.error(error)
    })
    setContent('')
    func()
    setIsImageUpload(false)
    setImage(null)
    setImageBase64('')

  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    setIsImageUpload(true)
    const file = e.target.files![0];
    if (file) {
      setImage(file)
    }

    readFileAsBase64(file).then(base64 => {
      setImageBase64(base64)
    })
  }


  return (
    <>
      <form onSubmit={handleFormSubmit} className="flex flex-col gap-1 w-[600px] p-2 shadow-full rounded">
        <div className="flex flex-col gap-1">
          <textarea onChange={(e) => {setContent(e.target.value)}} value={content} className="bg-gray-100 resize-none p-2" placeholder="Em que você está pensando?" name="content" id="content" cols={30} rows={2} required></textarea>
        </div>
        {
          isImageUpload ? 
          <div className="w-full flex flex-col items-center justify-center">
            <div className="w-[100%] flex justify-end">
              <button onClick={() => {setImage(null); setIsImageUpload(false), setImageBase64('')}}>
                <X />
              </button>
            </div>
            <Image src={URL.createObjectURL(image!)!} width={350} height={150} alt='post form image icon' />
          </div>
          : null
        }
        <div className="w-[100%] flex gap-4 p-2">
          <button type="button" className="flex items-center gap-1 hover:bg-gray-300 p-2 rounded-md">
            <Film size={32}/>
            <span>Video</span>
          </button>
          <div className="flex items-center justify-center">
            <label htmlFor="upload-image" className="flex items-center gap-2 cursor-pointer">
              <ImageIcon size={32}/>
              <span>Imagem</span>
            </label>
            <input id='upload-image' className="hidden" onChange={handleImageChange} type="file" accept="image/*" name="image" />
          </div>
          <button type="button" className="flex items-center gap-1 hover:bg-gray-300 p-2 rounded-md">
            <CalendarDays size={32}/>
            <span>Evento</span>
          </button>
        </div>
        <div className="w-[100%] h-[40px] flex items-center">
          <button type="submit" className="w-40 bg-black text-white text-xl">Postar</button>
        </div>
      </form>
    </>
  )
}