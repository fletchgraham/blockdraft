"use client";

import { useState } from "react";
import Link from "next/link";

export default function DraftCard({ draft, onDelete }) {
  const [confirmationText, setConfirmationText] = useState("");
  const [moveBlocksToInbox, setMoveBlocksToInbox] = useState(false);

  let thumbnailUrl = "https://via.placeholder.com/150";

  if (draft.blocks) {
    for (const block of draft.blocks) {
      if (block.thumbnailUrl) {
        thumbnailUrl = block.thumbnailUrl;
        break;
      }
    }
  }

  const handleDelete = (e) => {
    e.preventDefault();
    if (confirmationText.toLowerCase() === "delete") {
      onDelete(draft._id, moveBlocksToInbox);
    }
  };

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
          <button
            className="btn"
            onClick={() =>
              document.getElementById(`delete-modal-${draft._id}`).showModal()
            }
          >
            Delete Draft
          </button>
          <dialog id={`delete-modal-${draft._id}`} className="modal">
            <form method="dialog" className="modal-box" onSubmit={handleDelete}>
              <h3 className="font-bold text-lg">Delete Draft</h3>
              <p className="py-4">
                Are you sure you want to delete this draft? This action cannot
                be undone.
              </p>
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Type "delete" to confirm</span>
                </label>
                <input
                  type="text"
                  placeholder="delete"
                  className="input input-bordered"
                  value={confirmationText}
                  onChange={(e) => setConfirmationText(e.target.value)}
                />
              </div>
              <div className="form-control mb-4">
                <label className="label cursor-pointer">
                  <span className="label-text">Move blocks back to inbox</span>
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={moveBlocksToInbox}
                    onChange={(e) => setMoveBlocksToInbox(e.target.checked)}
                  />
                </label>
              </div>
              <div className="modal-action">
                <button
                  type="submit"
                  className="btn btn-error"
                  disabled={confirmationText.toLowerCase() !== "delete"}
                >
                  Confirm Delete
                </button>
                <button className="btn">Cancel</button>
              </div>
            </form>
          </dialog>
        </div>
      </div>
    </div>
  );
}
