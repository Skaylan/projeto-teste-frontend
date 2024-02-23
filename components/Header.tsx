"use client"

import Cookies from "js-cookie";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header() {
	const [token, setToken] = useState<string | null>(null)
	const [userId, setUserId] = useState<string | null>(null)
	const [searchValue, setSearchValue] = useState<string>("")

	const router = useRouter()

	useEffect(() => {
		const token = Cookies.get('token')
		const userId = Cookies.get('userId')
		setToken(token!)
		setUserId(userId!)
	})


	function handleSearchButton() {
		console.log(searchValue)
		router.push(`/search/people?search=${searchValue}`)
	}

  return (
		<>
			<header className="flex w-[100%] h-[40px] bg-slate-200">
				<div className="w-[5%] flex items-center">
					<a className="pl-2" href="/">Logo</a>
				</div>
				<div className="flex items-center justify-center gap-2 w-[85%]">
					<input className="p-1 rounded" onChange={e => setSearchValue(e.target.value)} value={searchValue} type="text" placeholder="Pesquisar" />
					<button onClick={handleSearchButton}><Search size={20} /></button>
				</div>
				<div className="w-[10%] flex items-center justify-end">
					{
						token ?
						<div className="p-2 flex gap-2">
							<a href="/feed">Feed</a>
							<a href={`/user/${userId}`}>Perfil</a>
							<a href="/logout">Sair</a>
						</div>
						:
						<div className="p-2 flex gap-2">
							<a href="/register">Registrar</a>
							<a href="/">Entrar</a>
						</div>
					}
				</div>
			</header>
		</>
	);
}
