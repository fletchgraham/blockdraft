"use client";

import Link from "next/link";

export default function DraftCard({ draft }) {
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
      <figure>
        <img src={thumbnailUrl} alt={draft.name || "Draft"} />
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
          {/* Open the modal using document.getElementById('ID').showModal() method */}
          <button
            className="btn"
            onClick={() => document.getElementById("my_modal_1").showModal()}
          >
            Delete Draft
          </button>
          <dialog id="my_modal_1" className="modal">
            <div className="modal-box">
              <h3 className="font-bold text-lg">Hello!</h3>
              <p className="py-4">
                Press ESC key or click the button below to close
              </p>
              <div className="modal-action">
                <form method="dialog">
                  {/* if there is a button in form, it will close the modal */}
                  <button className="btn">Cancel</button>
                </form>
              </div>
            </div>
          </dialog>
        </div>
      </div>
    </div>
  );
}
