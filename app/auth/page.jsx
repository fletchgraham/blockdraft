"use client";

import { LoginForm, RegisterForm } from "@/components/Auth";
import { useState } from "react";

export default function AuthPage() {
  const [isRegistering, setIsRegistering] = useState(false);

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

          {isRegistering ? <RegisterForm /> : <LoginForm />}

          <div className="card-actions justify-center mt-4">
            <button
              onClick={() => setIsRegistering(!isRegistering)}
              className="btn btn-link"
            >
              {isRegistering
                ? "Already have an account? Sign In"
                : "Need an account? Register"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
