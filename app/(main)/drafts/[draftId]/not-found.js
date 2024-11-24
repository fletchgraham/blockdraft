"use client";

export default function NotFound() {
  return (
    <main className="error">
      <h2 className="text-center text-2xl font-bold mt-10 mb-5">
        Draft Not Found :(
      </h2>
      <p className="text-center">Could not find the requested draft.</p>
    </main>
  );
}
