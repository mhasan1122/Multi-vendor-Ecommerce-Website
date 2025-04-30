import type React from "react";
import { Sidebar } from "@/components/sidebar";
import { Navbar } from "@/components/navbar";
import PrivateRouteProvider from "@/Provider/PrivateProvider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PrivateRouteProvider>
      <div className="flex min-h-screen bg-[#2a2a2a]">
      <div className="sticky   left-0 top-0 h-full">
        <Sidebar />
      </div>
      <div className="sticky flex  flex-1 flex-col">
     
        <Navbar />
        <main className="flex-1 bg-white p-4 dark:bg-[#2a2a2a] md:p-6">
          {children}
        </main>
      </div>
    </div>
    </PrivateRouteProvider>
  );
}
