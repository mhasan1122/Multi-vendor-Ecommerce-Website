"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()

  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] p-4">
      <h1 className="text-4xl font-bold text-red-500 mb-4">Something went wrong</h1>
      <p className="text-lg text-center mb-6">
        We apologize for the inconvenience. An error occurred while processing your request.
      </p>
      <div className="flex gap-4">
        <Button onClick={() => reset()}>Try again</Button>
        <Button variant="outline" onClick={() => router.push("/refund")}>
          Go to Refund List
        </Button>
      </div>
    </div>
  )
}

