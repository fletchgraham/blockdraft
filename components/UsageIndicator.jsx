"use client";

import { useState, useEffect } from "react";
import { getUserUsage } from "@/lib/db/usage"; // Import your server-side usage logic

export default function UsageIndicator() {
  const [currentUsage, setCurrentUsage] = useState(0);
  const [limit, setLimit] = useState(100);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsageData() {
      try {
        const data = await getUserUsage(); // Server action for usage data
        setCurrentUsage(data.currentUsage || 0);
        setLimit(data.limit || 100);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching usage data:", error);
        setLoading(false);
      }
    }

    fetchUsageData();
  }, []);

  const percentage = Math.min((currentUsage / limit) * 100, 100);

  return (
    <div className="p-4 bg-base-100 border rounded-lg shadow-sm">
      <h3 className="text-sm font-bold text-gray-700 mb-2">Usage</h3>
      {loading ? (
        <div className="text-sm text-gray-600 mb-2">Loading...</div>
      ) : (
        <>
          <div className="text-sm text-gray-600 mb-1">
            {currentUsage} of {limit} blocks summarized
          </div>
          <progress
            className="progress progress-primary w-56"
            value={percentage}
            max="100"
          ></progress>
          {percentage >= 100 && (
            <p className="text-sm text-red-600 mt-2">
              You've reached your usage limit! Upgrade to summarize more blocks.
            </p>
          )}
        </>
      )}
    </div>
  );
}
