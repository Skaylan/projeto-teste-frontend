"use client"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { user } from "../[id]/page";
import Header from "@/components/Header";

export default function Page() {
  const [user, setUser] = useState<user | null>(null)
  const searchParams = useSearchParams();

  const getUserData = async () => {
    const userId = searchParams.get('user_id')
		try {
			const res = await fetch(`http://localhost:5000/api/get_user_by_id?user_id=${userId}`, {
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
  )
}