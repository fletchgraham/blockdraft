"use client";

import { signIn } from "next-auth/react";
import { GitHubLogo, GoogleLogo } from "@/components/Logos";

export default function AuthProviderBtns() {
  const handleSignIn = async (provider) => {
    await signIn(provider);
  };

  return (
    <>
      <button
        onClick={() => handleSignIn("google")}
        className="btn w-full mb-4"
      >
        <GoogleLogo />
        Continue with Google
      </button>
      <button
        onClick={() => handleSignIn("github")}
        className="btn w-full mb-4"
      >
        <GitHubLogo />
        Continue with GitHub
      </button>
    </>
  );
}
