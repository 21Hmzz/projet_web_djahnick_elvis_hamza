"use client";
import { cn } from "@/lib/utils";
import { Session } from "next-auth";
import {
  Bug,
  FolderArchive,
  KeyRound,
  LayoutDashboard,
  MailIcon,
  MonitorSmartphone,
  Ticket,
  User,
  UserCog,
  Users,
} from "lucide-react";
import { signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import React from "react";

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  return (
    <div className={cn("pb-12 relative", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="flex items-center"></div>
          <Separator className="w-full mt-2 mb-2" />
          <div className="space-y-1">
            <Button
              variant={pathname === "/dashboard" ? "secondary" : "ghost"}
              className="w-full justify-start"
              asChild
            >
              <Link href="/dashboard">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Accueil
              </Link>
            </Button>
            <Button
              variant={pathname.includes("/tickets") ? "secondary" : "ghost"}
              className="w-full justify-start"
              asChild
            >
              <Link href="/dossier">
                <Users className="mr-2 h-4 w-4" />
                Utilisateurs
              </Link>
            </Button>
            <Button
              variant={pathname.includes("/devices") ? "secondary" : "ghost"}
              className="w-full justify-start"
              asChild
            >
              <Link href="/invitations">
                <MailIcon className="mr-2 h-4 w-4" />
                Messages
              </Link>
            </Button>
          </div>
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Réglages et sécurité
          </h2>
          <div className="space-y-1">
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href={"/account/settings"}>
                <UserCog className="mr-2 h-4 w-4" />
                Compte
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href={"/account/security"}>
                <KeyRound className="mr-2 h-4 w-4" />
                Sécurité
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Bug className="mr-2 h-4 w-4" />
              Rapporter un bug
            </Button>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 w-full p-12"></div>
    </div>
  );
}
