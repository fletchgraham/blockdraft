"use client";
import React from "react";
import { signIn } from "next-auth/react";
import { redirect } from "next/navigation";

import { register } from "@/actions/user";

export default function AuthForm({ isRegistering }) {
  const [error, setError] = React.useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    if (isRegistering) {
      const response = await register(null, formData);
      if (response.errors) {
        setError(
          Object.values(response.errors).join(", ") || "Registration failed."
        );
      } else if (response.success) {
        redirect("/auth/login?registered=true");
      } else {
        setError("Registration failed. Please try again.");
      }
    } else {
      const email = formData.get("email");
      const password = formData.get("password");

      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (!result.ok) {
        setError("Invalid email or password.");
      } else {
        redirect("/edit");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
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
          name="email"
          type="email"
          className="grow"
          placeholder="Email"
        />
      </label>
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
      {error && (
        <div role="alert" className="alert mb-3 alert-warning text-sm">
          {error}
        </div>
      )}
      <button className="btn btn-primary w-full">
        {isRegistering ? "Create account" : "Login"}
      </button>
    </form>
  );
}
