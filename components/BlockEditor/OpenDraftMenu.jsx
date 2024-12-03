import Link from "next/link";
import { DocumentPlusIcon } from "@/components/icons";

export default function OpenDraftMenu({ drafts, onOpenDraft }) {
  return (
    <details className="dropdown dropdown-end">
      <summary className="btn">Open Draft</summary>
      <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow-lg">
        {drafts.map((draft) => (
          <li key={draft._id}>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault(); // Prevent default link behavior
                onOpenDraft(draft._id);
                const details = e.target.closest("details");
                if (details) details.removeAttribute("open"); // Close dropdown
              }}
            >
              {draft.name}
            </a>
          </li>
        ))}
        <li key="new">
          <Link
            href="/drafts/create"
            onClick={(e) => {
              const details = e.target.closest("details");
              if (details) details.removeAttribute("open"); // Close dropdown
            }}
          >
            <DocumentPlusIcon className="size-5" />
            New Draft
          </Link>
        </li>
      </ul>
    </details>
  );
}
