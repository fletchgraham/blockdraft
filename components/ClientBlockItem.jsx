// components/ClientBlockItem.jsx
"use client";

export default function ClientBlockItem({ block }) {
  return (
    <li className="flex items-center shadow p-4 bg-base-100 rounded-lg mb-2">
      {/* Thumbnail */}
      {block.thumbnailUrl && (
        <img
          src={block.thumbnailUrl}
          alt="Thumbnail"
          className="w-16 h-16 object-cover rounded-md mr-4"
        />
      )}
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
    </li>
  );
}
