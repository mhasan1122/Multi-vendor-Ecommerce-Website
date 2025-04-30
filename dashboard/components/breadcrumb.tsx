"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { usePathname } from "next/navigation"

interface BreadcrumbItem {
  label: string
  href: string
  active?: boolean
}

export function Breadcrumb() {
  const pathname = usePathname()
  const paths = pathname.split("/").filter(Boolean)

  const breadcrumbs: BreadcrumbItem[] = [
    {
      label: "Dashboard",
      href: "/dashboard",
      active: pathname === "/dashboard",
    },
    ...paths.map((path, index) => {
      const href = `/${paths.slice(0, index + 1).join("/")}`
      const formatLabel = (label: string) => {
        // Format path for display (e.g., "product-list" -> "Product List")
        return label
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
      }

      return {
        label: formatLabel(path),
        href,
        active: href === pathname,
      }
    }),
  ]

  // If we're at the dashboard, we don't need to show breadcrumbs
  if (breadcrumbs.length === 1) {
    return null
  }

  return (
    <nav className="flex items-center text-sm text-muted-foreground px-4 py-2">
      {breadcrumbs.map((breadcrumb, index) => (
        <div key={breadcrumb.href} className="flex items-center">
          {index > 0 && <ChevronRight className="h-4 w-4 mx-2" />}
          {breadcrumb.active ? (
            <span className="font-medium text-foreground">{breadcrumb.label}</span>
          ) : (
            <Link href={breadcrumb.href} className="hover:underline">
              {breadcrumb.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  )
}

