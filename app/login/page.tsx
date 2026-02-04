"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

import { Suspense } from "react";

function LoginContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/home";

  return (
    <div className="p-10">
      <h1>Login</h1>

      <button
        onClick={() =>
          signIn("google", {
            callbackUrl,
          })
        }
      >
        Continue with Google
      </button>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
