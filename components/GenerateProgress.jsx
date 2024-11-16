"use client";

export default function GenerateProgress({ progress }) {
  return (
    <div>
      <progress
        className="progress w-full"
        value={progress.completed}
        max={progress.total}
      />
    </div>
  );
}
