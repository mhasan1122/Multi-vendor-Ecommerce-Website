"use client";

import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package2,
  PackageOpen,
  ShoppingCart,
  Users,
  // RefreshCcw,
  MessageSquare,
  Settings,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
// import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth-context";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  // const { toast } = useToast();
const {logout} = useAuth()
  // const handleLogout = () => {
  //   setLogoutDialogOpen(false);
  //   toast({
  //     title: "Logged out successfully",
  //     description: "You have been logged out of your account",
  //   });
  //   // In a real application, you would handle the logout logic here
  // };

  const routes = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
      active: pathname === "/dashboard",
    },
    {
      label: "Product List",
      icon: Package2,
      href: "/product-list",
      active: pathname === "/product-list",
    },
    {
      label: "Product Categories",
      icon: PackageOpen,
      href: "/product-categories",
      active: pathname === "/product-categories",
    },
    {
      label: "Subcategories",
      icon: PackageOpen,
      href: "/subcategories",
      active: pathname === "/subcategories",
    },
    {
      label: "Orders",
      icon: ShoppingCart,
      href: "/orders",
      active: pathname === "/orders",
    },
    {
      label: "Customers",
      icon: Users,
      href: "/customers",
      active: pathname === "/customers",
    },
    // {
    //   label: "Analytics",
    //   icon: BarChart,
    //   href: "/analytics",
    //   active: pathname === "/analytics",
    // },
    // {
    //   label: "Refund",
    //   icon: RefreshCcw,
    //   href: "/refund",
    //   active: pathname === "/refund",
    // },
    {
      label: "Reviews",
      icon: MessageSquare,
      href: "/reviews",
      active: pathname === "/reviews",
    },
  ];

  return (
    <>
      <div
        className={cn(
          "flex h-screen w-[360px] flex-col items-start  bg-[#333333] text-white",
          className,
        )}
      >
        <div className="mb-[100px] flex h-20 items-center border-gray-700 px-6">
          <Link href="/dashboard" className="mt-6 flex items-center gap-2">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Frame%201618873995-jlE3wr7C7LQ5jCFdjoSxQcX2uprBuS.png"
              alt="Print Swag Logo"
              width={120}
              height={40}
            />
          </Link>
        </div>
        <div className="flex h-full w-full flex-col justify-between">
          <div className="flex flex-col items-end justify-end overflow-auto py-2">
            <nav className="w-[274px] px-4 text-sm font-medium">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "my-1 flex items-center gap-3 rounded-md px-3 py-2 text-base text-muted-foreground transition-all hover:bg-white hover:text-black hover:text-primary",
                    route.active ? "bg-white text-black" : "text-white",
                  )}
                >
                  <route.icon className="h-4 w-4" />
                  {route.label}
                </Link>
              ))}
            </nav>
          </div>
          {/* bottom menu */}
          <div className="mt-auto px-4 py-2 text-base">
            <button>
              <Link
                href="/setting"
                className={cn(
                  "my-1 flex items-center gap-3 rounded-md px-3 py-2 text-muted-foreground text-white transition-all hover:bg-white hover:text-black hover:text-primary",
                  pathname == "/setting" ? "bg-white text-black" : "text-white",
                )}
              >
                <Settings className="h-4 w-4" />
                Setting
              </Link>
            </button>
            <button
              onClick={() => setLogoutDialogOpen(true)}
              className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-muted-foreground text-red-500 transition-all hover:text-primary"
            >
              <LogOut className="h-4 w-4" />
              Log out
            </button>
          </div>
        </div>
      </div>

      <Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to logout?</DialogTitle>
            <DialogDescription>
              You will be logged out of your account and will need to login
              again to access the dashboard.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setLogoutDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={logout}>
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
