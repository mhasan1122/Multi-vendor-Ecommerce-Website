"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
// import Link from "next/link"
import { useAuth } from "@/context/auth-context"

export default function Home() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  // useEffect(() => {
  //   router.push("/login")
  // }, [router])

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
    router.push("/dashboard")
  }, [isAuthenticated, router])


  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      <p className="ml-4 text-lg">Redirecting to dashboard...</p>
      <br />
      {/* <Link className="bg-red-500 p-2 rounded-xl flex-col" href='/dashboard'> Go Dashboard</Link> */}
  
    </div>
  )
}

