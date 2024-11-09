// components/BlockEditor.jsx
"use client";

import { useState } from "react";
import ClientBlockList from "./ClientBlockList";

export default function BlockEditor() {
  const [leftBlocks, setLeftBlocks] = useState([]);
  const [rightBlocks, setRightBlocks] = useState([]);

  return (
    <div className="block-editor-container">
      <div className="flex space-x-4">
        <div className="w-1/2">
          <ClientBlockList blocks={leftBlocks} title="Inbox" />
        </div>
        <div className="w-1/2">
          <ClientBlockList blocks={rightBlocks} title="Draft" />
        </div>
      </div>
    </div>
  );
}
