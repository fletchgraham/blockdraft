// components/ClientBlockList.jsx
"use client";

import ClientBlockItem from "./ClientBlockItem";

export default function ClientBlockList({ blocks, title }) {
  return (
    <div
      className="client-block-list"
      style={{ overflowY: "auto", maxHeight: "400px" }}
    >
      <h2 className="text-center font-bold mb-2">{title}</h2>
      <ul>
        {blocks.map((block) => (
          <ClientBlockItem key={block._id} block={block} />
        ))}
      </ul>
    </div>
  );
}
