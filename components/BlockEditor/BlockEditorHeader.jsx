import Link from "next/link";

export default function BlockEditorHeader({
  syncStatus,
  drafts,
  handleOpenDraft,
}) {
  return (
    <header className="flex justify-between items-center p-2 border-b border-black">
      <label
        htmlFor="my-drawer-2"
        className="btn btn-ghost drawer-button lg:hidden"
      >
        <div className="space-y-2">
          <span className="block h-0.5 w-8 bg-gray-600"></span>
          <span className="block h-0.5 w-8 bg-gray-600"></span>
          <span className="block h-0.5 w-8 bg-gray-600"></span>
        </div>
      </label>

      <h2 className="text-center font-semibold">Draft Editor</h2>
      <span>{syncStatus}</span>
      <div className="dropdown dropdown-end">
        <div tabIndex={0} role="button" className="btn m-1">
          Open Draft
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content menu border border-black bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
        >
          {drafts.map((draft) => (
            <li key={draft._id} onClick={() => handleOpenDraft(draft._id)}>
              <a>{draft.name}</a>
            </li>
          ))}
          <li key="new">
            <Link href="/drafts/create">+ New Draft</Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
