import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { AddRightForm } from "@/components/add-right-form"
import { RightsTable } from "@/components/rights-table"
import { AdminHeader } from "@/components/admin-header"
import { currentUser } from "@clerk/nextjs/server"
import { isAdmin } from "@/lib/server/admin-auth";


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
  const user = await currentUser()

  if (!user) {
    redirect("/sign-in")
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
  const admin = await isAdmin();
  
  if (!admin) {
    redirect('/');
  }

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


