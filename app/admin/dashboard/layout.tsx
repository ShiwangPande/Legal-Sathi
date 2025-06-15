"use client";

import { useState } from "react";
import AdminDashboardClient from "./AdminDashboardClient";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="h-full">
      {/* Mobile Navigation */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-background border-b">
        <div className="flex items-center justify-between p-4">
          <span className="font-bold text-xl">Admin</span>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] p-0">
              <div className="h-full">
                <AdminDashboardClient onClose={() => setIsOpen(false)} />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex h-full w-72 flex-col fixed inset-y-0 z-50">
        <AdminDashboardClient />
      </div>

      {/* Main Content */}
      <main className="md:pl-72 h-full">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          <div className="md:hidden h-16" /> {/* Spacer for mobile header */}
          {children}
        </div>
      </main>
    </div>
  );
} 