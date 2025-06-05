import { SignUp } from "@clerk/nextjs"

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#e7ecf3] to-[#f9fafb] p-4">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-xl shadow-lg p-6">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-extrabold text-[#304674]">Legal Saathi</h1>
          <p className="mt-1 text-sm text-gray-600 tracking-wide">Admin Registration</p>
        </div>

        <SignUp
          appearance={{
            elements: {
              rootBox: "w-full mx-auto",
              card: "shadow-none border-0", // Card already styled externally
              headerTitle: "text-xl font-semibold text-[#304674] text-center",
              headerSubtitle: "text-center text-sm text-gray-500",
              formButtonPrimary:
                "bg-[#304674] hover:bg-[#223350] text-white font-medium rounded-lg transition-colors duration-200",
            },
          }}
          redirectUrl="/admin/dashboard"
        />
      </div>
    </div>
  )
}
