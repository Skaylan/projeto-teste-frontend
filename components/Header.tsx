"use client"

import Cookies from "js-cookie";
import { useEffect, useState } from "react";

export default function Header() {
	const [token, setToken] = useState<string | null>(null)
	const [userId, setUserId] = useState<string | null>(null)

	useEffect(() => {
		const token = Cookies.get('token')
		const userId = Cookies.get('userId')
		setToken(token!)
		setUserId(userId!)
	})

  return (
		<>
			<header className="flex w-[100%] h-[40px] bg-slate-200">
				<div className="w-[30%] flex items-center">
					<a href="/">Logo</a>
				</div>
				<div className="w-[70%] flex items-center justify-end">
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
