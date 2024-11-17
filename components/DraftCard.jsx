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
          {/* <Link href={`/drafts/${draft._id}`}>
            <button className="btn btn-primary">Open Draft</button>
          </Link> */}
        </div>
      </div>
    </div>
  );
}
