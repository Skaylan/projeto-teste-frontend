"use client"

import Cookies from "js-cookie";
import { Bolt, LogOut, Newspaper, Search, User } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Header() {
	const [token, setToken] = useState<string | null>(null)
	const [userId, setUserId] = useState<string | null>(null)
	const [searchValue, setSearchValue] = useState<string>("")
	const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false)

	const router = useRouter()
	const ref: React.RefObject<HTMLDivElement> = useRef(null)

	useEffect(() => {
		const token = Cookies.get('token')
		const userId = Cookies.get('userId')
		setToken(token!)
		setUserId(userId!)
		
		const handleOutSideClick = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) {
				setIsProfileModalOpen(false)
      }
    };

    window.addEventListener("mousedown", handleOutSideClick);

    return () => {
      window.removeEventListener("mousedown", handleOutSideClick);
    };
	}, [ref])
	const path = usePathname()


	function handleSearchButton() {
		if (path === '/search/people') {
			window.location.replace(`/search/people?search=${searchValue}`)
		} else {
			router.push(`/search/people?search=${searchValue}`)
		}
	}

  return (
		<>
			<header className="flex fixed bg-white w-[100%] h-[50px] shadow-md">
				<div className="w-[5%] flex items-center">
					<Link className="ml-4 p-2 hover:bg-gray-200 rounded-md" href="/">Logo</Link>
				</div>
				<div className="w-[65%] flex items-center justify-end pr-[6rem] gap-2">
					<input onKeyDown={e => e.key === 'Enter' && handleSearchButton()} className="p-1 rounded bg-gray-100 w-[300px]" onChange={e => setSearchValue(e.target.value)} value={searchValue} type="text" placeholder="Pesquisar" />
					<button onClick={handleSearchButton}><Search size={20} /></button>
				</div>
				<div className="flex items-center justify-end text-lg w-[30%]">
					{
						token ?
						<div ref={ref} className="p-2 flex gap-8">
							<Link className="flex gap-1 hover:bg-gray-200 p-1 rounded-md" href="/feed"><Newspaper /> Feed</Link>
							<div onClick={() => setIsProfileModalOpen(!isProfileModalOpen)} className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-300 cursor-pointer">
								<User />
							</div>
							{
								isProfileModalOpen ?
								<div className="absolute flex flex-col gap-1 w-[200px] h-[200px] top-[55px] left-[85%] p-2 shadow-full">
									<Link className="flex gap-2 hover:bg-gray-300 cursor-pointer p-2 rounded-md" href={`/user/${userId}`}><User /> Perfil</Link>
									<Link className="flex gap-2 hover:bg-gray-300 cursor-pointer p-2 rounded-md" href="#"><Bolt /> Configurações</Link>
									<Link className="flex gap-2 hover:bg-gray-300 cursor-pointer p-2 rounded-md" href="/logout"><LogOut /> Sair</Link>
								</div>
								:
									null
							}
						</div>
						:
						<div className="p-2 flex gap-12">
							<a href="/register">Registrar</a>
							<a href="/">Entrar</a>
						</div>
					}
				</div>
			</header>
		</>
	);
}
