import { Sidebar } from "@/components/ui/sidebar";
import React from "react";

function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-background">
      <div className="grid lg:grid-cols-5">
        <Sidebar className="hidden lg:block" />
        <div className="col-span-3 lg:col-span-4 lg:border-l h-screen">
          <div className="flex flex-row h-full">
            <div className="w-full h-full">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default AuthenticatedLayout;
