// components/BlockEditor.jsx
"use client";

import { useState } from "react";
import ClientBlockList from "./ClientBlockList";

export default function BlockEditor() {
  const [leftBlocks, setLeftBlocks] = useState([
    {
      _id: "1",
      title: "Block 1",
      text: "Some text for block 1",
      thumbnailUrl: "",
    },
    {
      _id: "2",
      title: "Block 2",
      text: "Some text for block 2",
      thumbnailUrl: "",
    },
  ]);

  const [rightBlocks, setRightBlocks] = useState([
    {
      _id: "3",
      title: "Block 3",
      text: "Some text for block 3",
      thumbnailUrl: "",
    },
    {
      _id: "4",
      title: "Block 4",
      text: "Some text for block 4",
      thumbnailUrl: "",
    },
  ]);

  const moveToRight = (block) => {
    setLeftBlocks(leftBlocks.filter((b) => b._id !== block._id));
    setRightBlocks([...rightBlocks, block]);
  };

  const moveToLeft = (block) => {
    setRightBlocks(rightBlocks.filter((b) => b._id !== block._id));
    setLeftBlocks([...leftBlocks, block]);
  };

  return (
    <div className="block-editor-container">
      <div className="flex space-x-4">
        <div className="w-1/2">
          <ClientBlockList
            blocks={leftBlocks}
            title="Inbox"
            onMove={moveToRight}
          />
        </div>
        <div className="w-1/2">
          <ClientBlockList
            blocks={rightBlocks}
            title="Draft"
            onMove={moveToLeft}
          />
        </div>
      </div>
    </div>
  );
}
