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
      // Trigger the Google Ads conversion tracking
      gtag_report_conversion(); // Call the conversion tracking function
    } else {
      alert(result.message || "Something went wrong.");
    }
  };

  return (
    <>
      <dialog id="subscribe_modal" className="modal">
        <div className="modal-box">
          {!success ? (
            <>
              <h3 className="font-bold text-lg">
                We're Still Under Development...
              </h3>
              <p className="py-4">
                Enter your email to stay updated on our progress.
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
                  className={`btn btn-primary${isLoading ? " loading" : ""}`}
                  disabled={isLoading}
                >
                  Subscribe
                </button>
              </form>
            </>
          ) : (
            <div className="py-4 text-center">
              <h3 className="font-bold text-lg text-green-500">
                Thank you for subscribing!
              </h3>
              <p>
                We'll reach out to see if you'd like to try an alpha version of
                BlockDraft AI
              </p>
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
