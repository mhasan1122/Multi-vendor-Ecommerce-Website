"use client"

import type React from "react"

import { useState } from "react"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface SettingsAccordionProps {
  title: string
  children?: React.ReactNode
  defaultOpen?: boolean
  href?: string
}

export function SettingsAccordion({ title, children, defaultOpen = false, href }: SettingsAccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  const toggleAccordion = () => {
    if (!href) {
      setIsOpen(!isOpen)
    }
  }

  const content = (
    <div
      className={cn(
        "flex items-center justify-between p-4 border border-gray-200 rounded-md cursor-pointer",
        href ? "hover:bg-gray-50" : "",
      )}
      onClick={toggleAccordion}
    >
      <h3 className="text-base font-medium">{title}</h3>
      {!href && <ChevronRight className={cn("h-5 w-5 transition-transform", isOpen ? "transform rotate-90" : "")} />}
    </div>
  )

  return (
    <div className="mb-4">
      {href ? (
        <Link href={href}>{content}</Link>
      ) : (
        <>
          {content}
          {isOpen && children && <div className="p-4 border-x border-b border-gray-200 rounded-b-md">{children}</div>}
        </>
      )}
    </div>
  )
}

