'use client'

import Header from "@/components/Header";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";


export interface paramType {
  params: { id: string };
}

export interface decoded {
  email: string,
	id: string
}

export interface user {
	id: string,
  email: string,
	name: string,
	created_at: string,
	updated_at: string
}

export default function Page({ params }: paramType) {
  const token = Cookies.get("token");
	const [user, setUser] = useState<user | null>(null)
	
	const getUserData = async () => {
		const token = Cookies.get("token");
		const decoded: decoded = jwtDecode(token!)
		const id = decoded.id
		
		try {
			const res = await fetch(`http://localhost:5000/api/get_user_by_id?user_id=${id}`, {
				method: 'GET',
				mode: 'cors',
				headers: {
					'Content-Type': 'application/json'
				}
			})
			
			if (res) {
				const data = await res.json()
				const { user } = data
				setUser(user)
			}

		} catch (error) {
			console.error(error)
		}
		
	
	}

	useEffect(() => {
		if (!token) {
			window.location.replace("/");
		}
		getUserData()
	})

  return (
    <>
			<Header />
      <main>
        <h1>{user?.name}</h1>
        <h1>{user?.email}</h1>
        <h1>{user?.id}</h1>
      </main>
    </>
  );
}
