"use client";

import Link from "next/link";
import DeleteDraftModal from "./DeleteDraftModal";
import DuplicateDraftModal from "./DuplicateDraftModal";
import {
  TrashIcon,
  DocumentDuplicateIcon,
  ArchiveBoxIcon,
} from "@/components/icons";

type DraftCardProps = {
  draft: any;
  onDelete: (draftId: string, moveBlocksToInbox: boolean) => void;
  onDuplicate: (draftId: string, newName: string) => void;
  onArchive: (draftId: string) => void;
};

export default function DraftCard({
  draft,
  onDelete,
  onDuplicate,
  onArchive,
}: DraftCardProps) {
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
    <div className="card card-compact bg-base-100 w-full sm:w-60 shadow-md">
      <figure className="h-40 overflow-hidden">
        <img
          src={thumbnailUrl}
          alt={draft.name || "Draft"}
          className="object-cover w-full h-full"
        />
        {draft.archived && (
          <h3 className="absolute text-2xl font-bold text-white/70">
            ARCHIVED
          </h3>
        )}
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
          {/* <button className="btn btn-ghost">Edit</button> */}
          <button
            className="btn btn-ghost text-xl"
            onClick={() =>
              (
                document.getElementById(
                  `duplicate-modal-${draft._id}`
                ) as HTMLDialogElement
              ).showModal()
            }
          >
            <DocumentDuplicateIcon className="size-6" />
          </button>
          <button
            className="btn btn-ghost text-xl"
            onClick={() => onArchive(draft._id)}
          >
            <ArchiveBoxIcon className="size-6" />
          </button>
          <button
            className="btn btn-ghost text-xl text-red-500"
            onClick={() =>
              (
                document.getElementById(
                  `delete-modal-${draft._id}`
                ) as HTMLDialogElement
              ).showModal()
            }
          >
            <TrashIcon className="size-6" />
          </button>
        </div>
        <DeleteDraftModal draft={draft} onDelete={onDelete} />
        <DuplicateDraftModal draft={draft} onDuplicate={onDuplicate} />
      </div>
    </div>
  );
}
