"use client";
import { signIn } from "next-auth/react";
import { GoogleLogo, GitHubLogo } from "@/components/Logos";

export default function ProviderSignInButtons() {
  const handleSignIn = async (provider) => {
    await signIn(provider, { redirectTo: "/edit" });
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
