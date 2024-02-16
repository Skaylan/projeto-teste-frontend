"use client";
import Header from "@/components/Header";
import LoginForm from "@/components/LoginForm";

export default function Home() {
  return (
    <>
      <Header />
      <main className="w-[100%] h-[100vh] flex flex-col items-center justify-center">
        <LoginForm />
      </main>
    </>
  );
}
