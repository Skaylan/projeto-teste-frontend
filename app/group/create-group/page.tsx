'use client'
import Header from "@/components/Header"
import { readFileAsBase64 } from "@/components/utils";
import { ImageIcon, X } from "lucide-react";
import Image from "next/image";
import { useState, useRef, use } from "react"
import handleCreateGroupForm from "./server";
import Cookies from "js-cookie";
import GroupSideBar from "@/components/GroupSideBar";

export default function Page() {

  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState<string>('');
  const [image, setImage] = useState<File | null>(null)
  const [imageBase64, setImageBase64] = useState<string>('')
  const [isImageUpload, setIsImageUpload] = useState<boolean>(false)
  const [groupName, setGroupName] = useState<string>('')
  const [groupDescription, setGroupDescription] = useState<string>('')


  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDivClick = () => {
    // Ativando o input type=file quando a div é clicada
    fileInputRef.current?.click();
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };

  const handleInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag !== '' && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput('');
    }
  };

  const removeTag = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, indexToRemove: number) => {
    e.preventDefault()
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };
  
  
  
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const promise = Promise.resolve(handleCreateGroupForm(groupName, groupDescription, Cookies.get('userId')!, tags, imageBase64))
    promise.then((value) => {
      window.location.href = `/group/${value.group_id}`
    })
  }
  
  return (
    <main className="w-full h-auto flex flex-col">
      <Header />
      <GroupSideBar />
      <section className="w-full flex flex-col items-center justify-center pt-20">
        <form onSubmit={handleSubmit} className="w-[600px] h-auto flex flex-col items-center justify-center gap-2">

          <div className="w-full flex flex-col pl-8">
            <div className="flex items-center ">
              <label htmlFor="upload-image" className="flex items-center gap-2 cursor-pointer">
                <ImageIcon size={32}/>
                <span>Capa do grupo</span>
              </label>
              <input 
                id='upload-image' 
                className="hidden" 
                onChange={handleImageChange}
                type="file"
                accept="image/*"
                name="image"
                ref={fileInputRef}
              />
            </div>
          </div>
          <div className="w-full h-[300px] flex bg-gray-200">
            {
                isImageUpload ? 
                <div className="w-full flex flex-col items-center justify-center">
                  <div className="w-full flex justify-end">
                    <button onClick={() => {setImage(null); setIsImageUpload(false), setImageBase64('')}}>
                      <X />
                    </button>
                  </div>
                  {
                    image ?
                      <Image
                        key={image ? image.name : ''}
                        className="w-full h-full object-fill"
                        src={image ? URL.createObjectURL(image!) : ''}
                        width={0} 
                        height={0}
                        alt='post form image icon' 
                      />
                    : 
                    <div onClick={handleDivClick} className="w-full h-full flex items-center justify-center cursor-pointer">
                      <ImageIcon className="text-gray-400" size={62}/>
                    </div>
                  }
                </div>
                :
                <div onClick={handleDivClick} className="w-full h-full flex items-center justify-center cursor-pointer">
                  <ImageIcon className="text-gray-400" size={62}/>
                </div>
              }
          </div>

          <div className="flex flex-col w-full justify-center items-center gap-2">
            <div className="w-full flex pl-8">
              <label htmlFor="tags">Nome do grupo</label>
            </div>
            <input onChange={(e) => setGroupName(e.target.value)} className="w-[90%] h-[35px] bg-slate-100 rounded p-2" 
              type="text" 
              name="name" 
              id="name" 
              placeholder="Nome"
            />
          </div>

          <div className="flex flex-col w-full justify-center items-center gap-2">
            <div className="w-full flex pl-8">
              <label htmlFor="tags">Descriçao do grupo</label>
            </div>
            <textarea
              onChange={(e) => setGroupDescription(e.target.value)} 
              className="w-[90%] h-[100px] bg-slate-100 rounded p-2 resize-none" 
              name="descr" 
              id="descr" 
              placeholder="Descrição"
            />
          </div>

          <div className="flex flex-col w-full gap-2 items-center">
            <div className="w-full flex pl-8">
              <label htmlFor="tags">Assuntos do seu grupo</label>
            </div>
            <input
              className="w-[90%] h-[35px] bg-slate-100 rounded p-2"
              type="text"
              value={tagInput}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyPress}
              placeholder="Digite a tag e precione 'Enter'"
              name="tags"
            />
            <div className="flex gap-2">
              {tags.map((tag, index) => (
                <div onClick={(e) => removeTag(e, index)} key={index} className="flex gap-1 bg-slate-100 rounded p-1 cursor-pointer">
                  <span className="">{tag}</span>
                  <span ><X size={20} /></span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <button 
              className="w-[90%] h-[35px] bg-slate-100 rounded p-2" 
              type="submit">
              Criar grupo
            </button>
          </div>
        </form>
      </section>
    </main>
  )
};
