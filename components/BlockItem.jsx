export default function BlockItem({ block }) {
  return (
    <div className="flex items-center p-4 bg-base-100 shadow rounded-lg mb-2">
      {/* Thumbnail */}
      {block.thumbnailUrl && (
        <img
          src={block.thumbnailUrl}
          alt="Thumbnail"
          className="w-16 h-16 object-cover rounded-md mr-4"
        />
      )}

      {/* Content */}
      <div>
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
    </div>
  );
}
