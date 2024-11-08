import { deleteBlock } from "../actions/blockController";

export default function BlockItem({ block }) {
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
    </div>
  );
}
