"use client";
import { useState, useEffect } from "react";

export default function GenerateProgress({ initialComplete, initialTotal }) {
  const [complete, setComplete] = useState(initialComplete);

  console.log(complete, initialTotal);

  // make a little timeout to simulate progress updating
  useEffect(() => {
    const interval = setInterval(() => {
      if (complete >= initialTotal) {
        clearInterval(interval);
        return;
      }
      setComplete((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <progress
        className="progress w-full"
        value={complete}
        max={initialTotal}
      />
    </div>
  );
}
