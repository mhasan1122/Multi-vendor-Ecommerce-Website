"use client";


import Image from "next/image";

import { useAuth } from "@/context/auth-context";


export function Navbar() {
  const {  user } = useAuth()
// console.log("user data from nav", user)
 

  return (
    <>
      <header className="flex h-16 items-center gap-4 border-b border-gray-700 bg-[#333333]">
        <div className="w-full flex-1">
          {/* <div className="focus *:text-white:text-black relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search"
              className="w-full appearance-none border-none pl-8 shadow-none focus:bg-white md:w-2/3 lg:w-1/3"
            />
          </div> */}
        </div>
        <div className="flex items-center gap-4">
       <div className="flex items-center gap-4 pr-5">
       <Image
                  src={user?.avatar || "/images/avatar.png"}
                  alt="User Avatar"
                  width={42}
                  height={42}
                  className="rounded-full border"
                />
                <div className="flex flex-col items-start text-xs">
                  <h1 className="text-white text-[16px] font-bold capitalize"> {user?.name || "user Name"}</h1>
                  <span className="text-muted-foreground  text-sm font-bold capitalize"> {user?.role}</span>
                </div>

       </div>

          
        </div>
      </header>



      {/* <Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
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
          
            <Button variant="destructive" onClick={() =>   {logout()}}>
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}
    </>
  );
}
