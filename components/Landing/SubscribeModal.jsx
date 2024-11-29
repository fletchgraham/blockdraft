"use client";

import { useState } from "react";
import { subscribeToMailingList } from "@/actions/user";

export default function SubscribeModal() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const result = await subscribeToMailingList(email);
    setIsLoading(false);

    if (result.success) {
      setSuccess(true);
      setEmail(""); // Clear the input
    } else {
      alert(result.message || "Something went wrong.");
    }
  };

  return (
    <>
      <dialog id="subscribe_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Subscribe to BlockDraft</h3>
          {!success ? (
            <>
              <p className="py-4">
                Enter your email to stay updated on development.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Your email address"
                  className="input input-bordered w-full"
                />
                <button
                  type="submit"
                  className={`btn ${isLoading ? "loading" : ""}`}
                  disabled={isLoading}
                >
                  Subscribe
                </button>
              </form>
            </>
          ) : (
            <div className="py-4 text-center">
              <p className="text-green-500">Thank you for subscribing!</p>
              <button
                className="btn"
                onClick={() => {
                  setSuccess(false);
                  document.getElementById("subscribe_modal").close();
                }}
              >
                Close
              </button>
            </div>
          )}
        </div>
      </dialog>
    </>
  );
}
