import { SignIn } from "@clerk/nextjs"

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Legal Saathi</h1>
          <p className="mt-2 text-gray-600">Admin Sign In</p>
        </div>
        <SignIn
          appearance={{
            elements: {
              rootBox: "w-full mx-auto",
              card: "shadow-lg rounded-xl border border-gray-200",
              headerTitle: "text-2xl font-bold text-center",
              headerSubtitle: "text-center",
              formButtonPrimary: "bg-primary hover:bg-primary/90",
            },
          }}
          redirectUrl="/admin/dashboard"
        />
      </div>
    </div>
  )
}
