"use client";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
export default function UserLayout({ children }: { children: React.ReactNode }) {
  const { replace } = useRouter();
  const token = Cookies.get("token");
  if (!token) {
    replace("/");
  }
  
  return <>{ token ? children : null}</>;
}