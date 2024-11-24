"use client";

import Link from "next/link";
import DeleteDraftModal from "./DeleteDraftModal";

export default function DraftCard({ draft, onDelete }) {
  let thumbnailUrl = "https://via.placeholder.com/150";

  if (draft.blocks) {
    for (const block of draft.blocks) {
      if (block.thumbnailUrl) {
        thumbnailUrl = block.thumbnailUrl;
        break;
      }
    }
  }

  return (
    <div className="card card-compact bg-base-100 w-60 shadow-md">
      <figure className="h-40 overflow-hidden">
        <img
          src={thumbnailUrl}
          alt={draft.name || "Draft"}
          className="object-cover w-full h-full"
        />
      </figure>
      <div className="card-body">
        <Link
          className="card-title hover:underline"
          href={`/drafts/${draft._id}`}
        >
          <h2>{draft.name}</h2>
        </Link>
        <p>{draft.blocks?.length || 0} blocks</p>
        <div className="card-actions justify-end">
          <button className="btn btn-ghost">E</button>
          <button className="btn btn-ghost">C</button>
          <button
            className="btn btn-ghost"
            onClick={() =>
              document.getElementById(`delete-modal-${draft._id}`).showModal()
            }
          >
            D
          </button>
        </div>
        <DeleteDraftModal draft={draft} onDelete={onDelete} />
      </div>
    </div>
  );
}
