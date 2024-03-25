'use client'

import { Newspaper, Plus, Search, UsersRound } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function GroupSideBar() {
  const router = useRouter()

  return (
    <>
      <aside className="flex fixed flex-col gap-1 w-[250px] h-full top-[50px] p-2 shadow-2xl">
        <Link href={'/group'}>
          <div className="flex gap-2 items-center w-full h-12 hover:bg-gray-300 cursor-pointer p-2 rounded-md">
            <Newspaper />
            <h4>Feed dos grupos</h4>
          </div>
        </Link>
        <Link href={'/group/my-groups'} >
          <div className="flex gap-2 items-center w-full h-12 hover:bg-gray-300 cursor-pointer p-2 rounded-md">
            <UsersRound />
            <h4>Seus Grupos</h4>
          </div>
        </Link>
        <div className="flex gap-2 items-center w-full h-12 hover:bg-gray-300 cursor-pointer p-2 rounded-md">
          <Search />
          <h4>Procurar Grupos</h4>
        </div>
        <Link href={'/group/create-group'} >
          <div className="flex gap-2 items-center w-full h-12 hover:bg-blue-100 cursor-pointer p-2 rounded-md text-blue-500">
            <Plus />
            <h4>Criar novo Grupo</h4>
          </div>
        </Link>
      </aside>
    </>
  )
};
