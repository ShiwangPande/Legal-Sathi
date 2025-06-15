import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { AdminHeader } from "@/components/admin-header"
import { currentUser } from "@clerk/nextjs/server"
import { isAdmin } from "@/lib/server/admin-auth";
import { SignOutAndSignInButton } from "@/components/signout-signinButton"
import AdminDashboardClient from "./AdminDashboardClient"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Users, Info } from "lucide-react";

async function getLanguages() {
  return await prisma.language.findMany({
    orderBy: { name: "asc" },
  })
}

async function getCategories() {
  return await prisma.category.findMany({
    orderBy: { id: "asc" },
  })
}

async function getRights() {
  return await prisma.right.findMany({
    include: { category: true, language: true },
    orderBy: { createdAt: "desc" },
  })
}

export default async function DashboardPage() {
  const [rightsCount, teamCount, volunteerCount] = await Promise.all([
    prisma.right.count(),
    prisma.teamMember.count(),
    prisma.volunteer.count(),
  ]);

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rights</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rightsCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Volunteers</CardTitle>
            <Info className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{volunteerCount}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


