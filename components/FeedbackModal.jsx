"use client";

import { useState, useEffect } from "react";
import { getSession } from "next-auth/react"; // Import auth.js session management
import { sendFeedback } from "@/actions/user"; // Adjust the path if necessary
import { ChatBubbleLeftEllipsisIcon } from "@/components/icons";

export default function FeedbackModal() {
  const [feedbackText, setFeedbackText] = useState("");
  const [email, setEmail] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Fetch session data on component mount
  useEffect(() => {
    async function fetchSession() {
      const session = await getSession();
      if (session) {
        setEmail(session.user.email || ""); // Autofill email if user is logged in
        setIsLoggedIn(true);
      }
    }
    fetchSession();
  }, []);

  const handleSendFeedback = async (e) => {
    e.preventDefault();
    const result = await sendFeedback(feedbackText, email);
    if (result.success) {
      alert("Feedback sent successfully!");
      setFeedbackText(""); // Clear the feedback form
    } else {
      alert(`Failed to send feedback: ${result.message}`);
    }
  };

  return (
    <>
      <button
        className="btn btn-secondary fixed bottom-0 right-0 m-6 z-10 shadow-lg"
        onClick={() => document.getElementById("feedback-modal").showModal()}
      >
        <ChatBubbleLeftEllipsisIcon />
        Feedback
      </button>
      <dialog id="feedback-modal" className="modal">
        <form
          method="dialog"
          className="modal-box"
          onSubmit={handleSendFeedback}
        >
          <h3 className="font-bold text-lg">Send Feedback</h3>
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Your Email</span>
            </label>
            <input
              type="email"
              placeholder="Your email"
              className="input input-bordered"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoggedIn} // Disable input if user is logged in
              required
            />
          </div>
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Your Feedback</span>
            </label>
            <textarea
              placeholder="Your feedback"
              className="textarea textarea-bordered"
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              required
            />
          </div>
          <div className="modal-action">
            <button type="submit" className="btn btn-primary">
              Send Feedback
            </button>
            <button
              type="button"
              className="btn"
              onClick={() => {
                document.getElementById("feedback-modal").close();
                setFeedbackText("");
                if (!isLoggedIn) setEmail(""); // Clear email for logged-out users
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}
