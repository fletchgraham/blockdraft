import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

import AuthForm from "./AuthForm";
import ProviderSignInButtons from "./ProviderSignInButtons";

export default async function AuthPage({ params }) {
  const session = await auth();

  // Redirect if user is already authenticated
  if (session) {
    redirect("/edit");
  }

  const { slug } = params; // Extract slug from params
  const isRegistering = slug === "register"; // Check if registering

  return (
    <div className="flex justify-center items-center h-screen bg-base-200">
      <div className="card bg-base-100 w-96 shadow-xl">
        <div className="card-body items-center">
          <h2 className="card-title text-center">
            {isRegistering ? "Create an Account" : "Welcome Back"}
          </h2>
          <p className="text-center mb-4">
            {isRegistering
              ? "Sign up to access your account."
              : "Log in to your account."}
          </p>

          {/* Provider Buttons */}
          <div className="w-full">
            <ProviderSignInButtons />
          </div>

          <p className="text-center mb-4">or</p>

          {/* Dynamic Form */}
          <AuthForm isRegistering={isRegistering} />

          {/* Toggle Button */}
          <div className="card-actions justify-center mt-4">
            {isRegistering ? (
              <Link className="btn btn-link" href="/auth/login">
                Already have an account? Sign In
              </Link>
            ) : (
              <Link className="btn btn-link" href="/auth/register">
                Need an Account? Sign Up
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
