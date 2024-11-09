import { deleteBlock, moveBlockToDraft } from "@/actions/blocks";
import { getDrafts } from "../lib/drafts";
import { getUserFromCookies } from "../lib/getUser";

export default async function BlockItem({ block }) {
  const user = await getUserFromCookies();
  const drafts = await getDrafts(user.userId);
  return (
    <div className="flex items-center p-4 bg-base-100 shadow rounded-lg mb-2 relative">
      {/* Thumbnail */}
      {block.thumbnailUrl && (
        <img
          src={block.thumbnailUrl}
          alt="Thumbnail"
          className="w-16 h-16 object-cover rounded-md mr-4"
        />
      )}

      {/* Content */}
      <div className="flex-1">
        <a
          href={block.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-lg font-bold text-primary hover:underline"
        >
          {block.title}
        </a>
        <p className="text-sm text-gray-500">{block.text}</p>
      </div>

      <form action={deleteBlock} className="btn btn-ghost ml-auto">
        <input type="hidden" name="blockId" value={block._id.toString()} />
        <button>X</button>
      </form>
      <div className="dropdown dropdown-end">
        <div tabIndex={0} role="button" className="btn m-1">
          +
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
        >
          {drafts.map((draft) => (
            <li key={draft._id.toString()}>
              <form action={moveBlockToDraft}>
                <input
                  type="hidden"
                  name="blockId"
                  value={block._id.toString()}
                />
                <input
                  type="hidden"
                  name="draftId"
                  value={draft._id.toString()}
                />
                <button>{draft.name}</button>
              </form>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
