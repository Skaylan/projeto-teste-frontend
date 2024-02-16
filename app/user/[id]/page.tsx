'use client'

import Header from "@/components/Header";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

export interface userTypeInterface {
  id: string;
  descr: string;
  created_at: Date;
  updated_at: Date;
}

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
	user_type: userTypeInterface,
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
				console.log(data)
			}

		} catch (error) {
			console.error(error)
		}
	
	}

	useEffect(() => {
		// if (!token) {
		// 	window.location.replace("/");
		// }
		getUserData()
	}, [])

  return (
    <>
			<Header />
			<main className="bg-gray-100 min-h-screen flex items-center justify-center">
				<div className="w-[300px] bg-white p-8 rounded shadow-lg">
					{/* <p className="text-gray-600 mb-2">id: {user?.id}</p> */}
					<h1 className="text-2xl font-bold mb-4">{user?.name}</h1>
					<p className="text-gray-600 mb-2">Email: {user?.email}</p>
					<p className="text-gray-600 mb-2">tipo: {user?.user_type.descr}</p>
				</div>
			</main>
    </>
  );
}
