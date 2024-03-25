"use client"

import Header from "@/components/Header";
import { useEffect, useState } from "react";
import getUserGroups from "./server";
import Cookies from "js-cookie";
import { group } from "@/components/TypesAndInterfaces";
import { convertDatetime } from "@/components/utils";
import Link from "next/link";
import GroupSideBar from "@/components/GroupSideBar";


export default function Page() {
	const [groups, setGroups] = useState<group[]>([])
	const [isLoading, setIsLoading] = useState<boolean>(true)
	const userId = Cookies.get('userId')
	useEffect(() => {
		setIsLoading(true)
		const promise = Promise.resolve(getUserGroups(userId!))
		promise.then((value) => {
			setGroups(value.groups)
			setIsLoading(false)
		})
	}, [])

	return (
		<>
			<Header />
			<GroupSideBar />
			<main className="w-full h-[100vh] flex flex-col items-center justify-center">
				{
					isLoading ? <span>Carregando...</span> :
					groups.length === 0 ? <span>Você ainda não está em nenhum grupo!</span>
					:
					groups.map((group: group) => (
						<Link key={group.id} href={`/group/${group.id}`}>
							<div className="w-[600px] h-[150px] shadow-full flex flex-col p-2">
								<div className="w-full h-10 flex items-center justify-center">
									<h1>{group.name}</h1>
								</div>
								<div className="w-full h-full flex items-center justify-center">
									<h1>{group.descr}</h1>
								</div>
								<div className="w-full h-full flex items-center justify-end">
									<span>criado em: {convertDatetime(group.created_at)}</span>
								</div>
							</div>
						</Link>
					))
					
				}
			</main>
		</>
	)
}