"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4">
      <h1 className="text-4xl font-bold text-red-500 mb-4">Something went wrong</h1>
      <p className="text-lg text-center mb-6">
        We apologize for the inconvenience. An error occurred while processing your request.
      </p>
      <div className="flex gap-4">
        <Button
          onClick={
            // Attempt to recover by trying to re-render the segment
            () => reset()
          }
        >
          Try again
        </Button>
        <Button variant="outline" onClick={() => (window.location.href = "/dashboard")}>
          Go to Dashboard
        </Button>
      </div>
    </div>
  )
}

