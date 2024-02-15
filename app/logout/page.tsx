"use client"
import Cookies from "js-cookie";
import { useEffect } from "react";
export default function LogOut() {
    useEffect(() => {
        Cookies.remove('token')
        window.location.replace('/')
    }, [])
    return (
        <></>
    )
}