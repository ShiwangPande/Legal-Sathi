"use client";

import { useRouter } from "next/navigation";
import { useClerk } from "@clerk/nextjs";

export function SignOutAndSignInButton() {
  const { signOut } = useClerk();
  const router = useRouter();

  const handleClick = async () => {
    await signOut();
    router.push("/sign-in");
  };

  return (
    <button
      onClick={handleClick}
      className="text-blue-600 hover:underline dark:text-blue-400 focus:outline-none mt-4 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      title="Sign out and sign in with a different account"
    >
      Sign In with a different account
    </button>
  );
}
