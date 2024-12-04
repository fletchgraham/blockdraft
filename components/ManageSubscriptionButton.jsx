"use client";

import { useState } from "react";
import { getPortalLink } from "@/actions/user/getPortalLink";

export default function ManageSubscriptionButton({ stripeCustomerId }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handlePortalLink() {
    setLoading(true);
    setError("");

    try {
      const { url } = await getPortalLink(stripeCustomerId);
      // Redirect the user to the Stripe Customer Portal
      window.location.href = url;
    } catch (err) {
      setError("Failed to load subscription portal.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button onClick={handlePortalLink} disabled={loading}>
        {loading ? "Loading..." : "Manage Subscription"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
