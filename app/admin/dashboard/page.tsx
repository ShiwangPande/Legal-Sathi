import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { AddRightForm } from "@/components/add-right-form"
import { RightsTable } from "@/components/rights-table"
import { AdminHeader } from "@/components/admin-header"
import { currentUser } from "@clerk/nextjs/server"
import { isAdmin } from "@/lib/server/admin-auth";
import { SignOutAndSignInButton } from "@/components/signout-signinButton"



async function getLanguages() {

  
  return await prisma.language.findMany({
    orderBy: {
      name: "asc",
    },
  })
}

async function getCategories() {
  return await prisma.category.findMany({
    orderBy: {
      id: "asc",
    },
  })
}

async function getRights() {
  return await prisma.right.findMany({
    include: {
      category: true,
      language: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })
}

export default async function AdminDashboard() {

  
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const admin = await isAdmin(user.id); // ✅ await it here
  if (!admin) {
    return (
      <div className="min-h-screen bg-[#f8fafc] text-[#304674]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white dark:bg-gray-900 shadow-sm border-b">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Legal Saathi Admin
          </h1>
        </div>

        <div className="text-center py-20 text-red-600 text-xl font-semibold">
          403 - You do not have permission to view this page.
          <br />
          <div className="mt-4">
            Please sign in with an admin account to access the admin dashboard.
          <br />
        <SignOutAndSignInButton/>
        </div>
        </div>
      </div>
    );
  }

  // create a plain user object with only necessary fields
  const safeUser = {
    id: user.id,
    firstName: user.firstName ?? undefined,
    lastName: user.lastName,
    email: user.emailAddresses?.[0]?.emailAddress ?? null,
    imageUrl: user.imageUrl,
    emailAddresses: user.emailAddresses?.map((e) => ({ emailAddress: e.emailAddress })) ?? [],
  }

  const [languages, categories, rights] = await Promise.all([
    getLanguages(),
    getCategories(),
    getRights(),
  ])
  console.log("Languages available in form:", languages)


  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#304674]">
      <AdminHeader user={safeUser} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add New Right Form */}
          <div className="lg:col-span-1">
            <AddRightForm languages={languages} categories={categories} />
          </div>

          {/* Rights Table */}
          <div className="lg:col-span-2">
            <RightsTable rights={rights} languages={languages} categories={categories} />
          </div>
        </div>
      </div>
    </div>
  )
}


