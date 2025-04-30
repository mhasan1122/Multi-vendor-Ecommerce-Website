"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { format } from "date-fns";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Star } from "lucide-react";

// ----------------- Types -----------------
type Review = {
  _id: string;
  review: string;
  rating: number;
  createdAt: string;
  user: {
    name: string;
  };
};

// ----------------- API Call -----------------
const fetchReviews = async (): Promise<Review[]> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/reviews/allreviews`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch reviews");
  }

  return res.json();
};

export default function ReviewsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const {
    data: reviewsData = [],
    isLoading,
    isError,
  } = useQuery<Review[]>({
    queryKey: ["reviews"],
    queryFn: fetchReviews,
  });

  const totalPages = Math.ceil(reviewsData.length / itemsPerPage);

  const paginatedReviews = reviewsData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (isLoading) return <div>Loading reviews...</div>;
  if (isError) return <div>Failed to load reviews.</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Customer Review</h1>
      </div>
      <div>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard" className="#272727">
                Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/customers" className="#595959">
                Review
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <Card>
        <CardContent className="p-0">
          {paginatedReviews.map((review) => (
            <div key={review._id} className="border-b p-4 last:border-b-0">
              <div className="flex items-start gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback>
                    {review.user?.name?.charAt(0) ?? "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[18px] font-semibold">
                      {review.user?.name}
                    </h3>
                  </div>
                  <div className="ml-auto flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < review.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>

                  <p className="mt-2 text-sm text-muted-foreground">
                    {review.review}
                  </p>
                  <span className="text-[16px] font-medium text-[#000000]">
                    {format(new Date(review.createdAt), "dd/MM/yy")}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div>
        <div className="px-8 grid grid-cols-2">
          <div className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * itemsPerPage + 1}-
            {Math.min(currentPage * itemsPerPage, reviewsData.length)} from{" "}
            {reviewsData.length}
          </div>

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() =>
                    currentPage > 1 && setCurrentPage((prev) => prev - 1)
                  }
                  className={
                    currentPage === 1 ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>
              {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                const pageNumber = i + 1;
                return (
                  <PaginationItem key={i}>
                    <PaginationLink
                      isActive={currentPage === pageNumber}
                      onClick={() => setCurrentPage(pageNumber)}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              {totalPages > 5 && (
                <>
                  <PaginationItem>
                    <PaginationLink className="pointer-events-none opacity-50">
                      ...
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink
                      isActive={currentPage === totalPages}
                      onClick={() => setCurrentPage(totalPages)}
                    >
                      {totalPages}
                    </PaginationLink>
                  </PaginationItem>
                </>
              )}
              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    currentPage !== totalPages &&
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}
