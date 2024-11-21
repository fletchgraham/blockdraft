import Link from "next/link";

export default function OpenDraftMenu({ drafts, onOpenDraft }) {
  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn">
        Open Draft
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content menu border border-black bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
      >
        {drafts.map((draft) => (
          <li key={draft._id} onClick={() => onOpenDraft(draft._id)}>
            <a>{draft.name}</a>
          </li>
        ))}
        <li key="new">
          <Link href="/drafts/create">+ New Draft</Link>
        </li>
      </ul>
    </div>
  );
}
