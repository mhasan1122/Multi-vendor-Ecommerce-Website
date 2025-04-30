"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

// Sample notifications data
const notificationsData = Array(14)
  .fill(null)
  .map((_, index) => ({
    id: index + 1,
    name: "Alex rock",
    avatar: "/placeholder.svg?height=40&width=40",
    date: "5/10/25",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce bibendum, odio sit amet posuere volutpat, tellus erat hendrerit enim, porttitor ullamcorper odio odio eget erat. Mauris vitae enim odio. Mauris at metus cursus lectus dapibus ultrices a eget nunc. Integer condimentum libero non orci laoreet tempus.",
  }))

export default function NotificationsPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const totalPages = Math.ceil(notificationsData.length / itemsPerPage)

  const paginatedNotifications = notificationsData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Notifications</h1>
      </div>

      <Card>
        <CardContent className="p-0">
          {paginatedNotifications.map((notification) => (
            <div key={notification.id} className="border-b p-4 last:border-b-0">
              <div className="flex items-start gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={notification.avatar} alt={notification.name} />
                  <AvatarFallback>{notification.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{notification.name}</h3>
                    <span className="text-sm text-muted-foreground">{notification.date}</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{notification.text}</p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {(currentPage - 1) * itemsPerPage + 1}-
          {Math.min(currentPage * itemsPerPage, notificationsData.length)} from {notificationsData.length}
        </div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => currentPage > 1 && setCurrentPage((prev) => prev - 1)}
                className={currentPage === 1 ? "opacity-50 pointer-events-none" : ""}
              />
            </PaginationItem>
            {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
              const pageNumber = i + 1
              return (
                <PaginationItem key={i}>
                  <PaginationLink isActive={currentPage === pageNumber} onClick={() => setCurrentPage(pageNumber)}>
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              )
            })}
            {totalPages > 5 && (
              <>
                <PaginationItem>
                  <span className="opacity-50 pointer-events-none">...</span>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink isActive={currentPage === totalPages} onClick={() => setCurrentPage(totalPages)}>
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>
              </>
            )}
            <PaginationItem>
              <PaginationNext
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                className={currentPage === totalPages ? "opacity-50 pointer-events-none" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}

