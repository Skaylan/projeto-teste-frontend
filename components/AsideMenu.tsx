import { User, Users } from 'lucide-react'
import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode'
import { token } from './TypesAndInterfaces'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AsideMenu() {
  const userInfo: token = jwtDecode(Cookies.get('token')!)
  const router = useRouter()
  return (
    <>
      <aside className="flex fixed flex-col gap-1 w-[250px] h-full top-[50px] p-2 shadow-2xl">
        <Link href={`/user/${userInfo.id}`}>
          <div className="flex gap-2 items-center w-full h-12 hover:bg-gray-300 cursor-pointer p-2 rounded-md">
            <User />
              <h4>{userInfo.name.split(' ')[0]}</h4>
          </div>
        </Link>
        <div onClick={() => {router.replace('/group')}} className="flex gap-2 items-center w-full h-12 hover:bg-gray-300 cursor-pointer p-2 rounded-md">
          <Users />
          <h4>Grupos</h4>
        </div>
      </aside>
    </>
  )
}