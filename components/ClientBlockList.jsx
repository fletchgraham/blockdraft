// components/ClientBlockList.jsx
"use client";

import ClientBlockItem from "./ClientBlockItem";

export default function ClientBlockList({ blocks, title, onMove }) {
  return (
    <div
      className="client-block-list border-red-500 border-2 p-2 rounded-md"
      style={{ overflowY: "auto", maxHeight: "400px" }}
    >
      <h2 className="text-center font-bold mb-2">{title}</h2>
      <ul>
        {blocks.map((block) => (
          <ClientBlockItem key={block._id} block={block} onMove={onMove} />
        ))}
      </ul>
    </div>
  );
}
