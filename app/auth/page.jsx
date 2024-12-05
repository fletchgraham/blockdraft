"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useActionState } from "react";
import { GitHubLogo, GoogleLogo } from "@/components/Logos";
import { register, login } from "@/actions/user";

export default function AuthPage() {
  const [isRegistering, setIsRegistering] = useState(false);

  // Use Action States for login and registration
  const [registerState, registerFormAction] = useActionState(register, {});
  const [loginState, loginFormAction] = useActionState(login, {});

  const handleSignIn = async (provider) => {
    await signIn(provider);
  };

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
          </div>

          <p className="text-center mb-4">or</p>

          {/* Form for Login or Registration */}
          <form
            action={isRegistering ? registerFormAction : loginFormAction}
            className="w-full"
          >
            <label className="input input-bordered flex items-center gap-2 mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-4 w-4 opacity-70"
              >
                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
              </svg>
              <input
                autoComplete="off"
                name="username"
                type="text"
                className="grow"
                placeholder="Username"
              />
            </label>
            {(isRegistering
              ? registerState.errors?.username
              : loginState.errors?.username) && (
              <div role="alert" className="alert mb-3 alert-warning">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 shrink-0 stroke-current"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <span>
                  {isRegistering
                    ? registerState.errors.username
                    : loginState.errors.username}
                </span>
              </div>
            )}
            <label className="input input-bordered flex items-center gap-2 mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-4 w-4 opacity-70"
              >
                <path
                  fillRule="evenodd"
                  d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                  clipRule="evenodd"
                />
              </svg>
              <input
                name="password"
                autoComplete="off"
                type="password"
                className="grow"
                placeholder="Password"
              />
            </label>
            {(isRegistering
              ? registerState.errors?.password
              : loginState.errors?.password) && (
              <div role="alert" className="alert mb-3 alert-warning">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 shrink-0 stroke-current"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <span>
                  {isRegistering
                    ? registerState.errors.password
                    : loginState.errors.password}
                </span>
              </div>
            )}
            <button className="btn btn-primary w-full">
              {isRegistering ? "Create account" : "Login"}
            </button>
          </form>

          {/* Toggle Button */}
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
