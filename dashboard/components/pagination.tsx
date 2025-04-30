"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

const Pagination = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <nav
      ref={ref}
      role="navigation"
      aria-label="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  ),
)
Pagination.displayName = "Pagination"

const PaginationContent = React.forwardRef<HTMLUListElement, React.HTMLAttributes<HTMLUListElement>>(
  ({ className, ...props }, ref) => (
    <ul ref={ref} className={cn("flex flex-row items-center gap-1", className)} {...props} />
  ),
)
PaginationContent.displayName = "PaginationContent"

const PaginationItem = React.forwardRef<HTMLLIElement, React.HTMLAttributes<HTMLLIElement>>(
  ({ className, ...props }, ref) => <li ref={ref} className={cn("", className)} {...props} />,
)
PaginationItem.displayName = "PaginationItem"

type PaginationLinkProps = {
  isActive?: boolean
  disabled?: boolean
} & React.ButtonHTMLAttributes<HTMLButtonElement>

const PaginationLink = React.forwardRef<HTMLButtonElement, PaginationLinkProps>(
  ({ className, isActive, disabled, ...props }, ref) => (
    <button
      ref={ref}
      aria-current={isActive ? "page" : undefined}
      disabled={disabled}
      className={cn(
        buttonVariants({
          variant: isActive ? "outline" : "ghost",
        }),
        "h-9 w-9 p-0",
        {
          "pointer-events-none opacity-50": disabled,
        },
        className,
      )}
      {...props}
    />
  ),
)
PaginationLink.displayName = "PaginationLink"

const PaginationPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { disabled?: boolean }
>(({ className, disabled, ...props }, ref) => (
  <button
    ref={ref}
    aria-label="Go to previous page"
    disabled={disabled}
    className={cn(
      buttonVariants({
        variant: "ghost",
      }),
      "h-9 w-9 p-0",
      {
        "pointer-events-none opacity-50": disabled,
      },
      className,
    )}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
  </button>
))
PaginationPrevious.displayName = "PaginationPrevious"

const PaginationNext = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { disabled?: boolean }
>(({ className, disabled, ...props }, ref) => (
  <button
    ref={ref}
    aria-label="Go to next page"
    disabled={disabled}
    className={cn(
      buttonVariants({
        variant: "ghost",
      }),
      "h-9 w-9 p-0",
      {
        "pointer-events-none opacity-50": disabled,
      },
      className,
    )}
    {...props}
  >
    <ChevronRight className="h-4 w-4" />
  </button>
))
PaginationNext.displayName = "PaginationNext"

const PaginationEllipsis = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span ref={ref} aria-hidden className={cn("flex h-9 w-9 items-center justify-center", className)} {...props}>
      <MoreHorizontal className="h-4 w-4" />
      <span className="sr-only">More pages</span>
    </span>
  ),
)
PaginationEllipsis.displayName = "PaginationEllipsis"

export {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
}

