"use client"
import LoginForm from '@/components/auth/LoginForm'
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"

const Page = () => {

  const { isAuthenticated } = useAuth()
  const router = useRouter()



  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard")
    }
    
  }, [isAuthenticated, router])

  return (
    <div >
     

      
      <LoginForm/>
    </div>
  )
}

export default Page
