"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

import DraftCard from "./DraftCard";
import { getDraftsWithBlocks } from "@/lib/db";

export default function DraftsGrid() {
  const [drafts, setDrafts] = useState([]);

  // Fetch drafts with blocks to get thumbnail URLs
  useEffect(() => {
    const fetchData = async () => {
      const drafts = await getDraftsWithBlocks();
      setDrafts(drafts);
    };
    fetchData();
  }, []);

  const handleDelete = async (draftId, moveBlocksToInbox) => {
    try {
      console.log("Deleting draft:", draftId);
    } catch (error) {
      console.error("Error deleting draft:", error);
      alert("An error occurred while deleting the draft.");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">Drafts</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {drafts.map((draft) => (
          <DraftCard key={draft._id} draft={draft} onDelete={handleDelete} />
        ))}
        <div className="card card-compact bg-base-100 w-60 shadow-md">
          <div className="card-body flex items-center justify-center">
            <Link href="/drafts/create" className="btn btn-primary">
              + New Draft
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
