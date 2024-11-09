// components/ClientBlockItem.jsx
"use client";

import Image from "next/image";

export default function ClientBlockItem({ block }) {
  return (
    <li className="flex items-center p-4 bg-base-100 shadow rounded-lg mb-2">
      {block.thumbnailUrl && (
        <Image
          src={block.thumbnailUrl}
          alt="Thumbnail"
          width={64}
          height={64}
          className="object-cover rounded-md mr-4"
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
