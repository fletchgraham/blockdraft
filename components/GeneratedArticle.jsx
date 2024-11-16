"use client";
import { useState, useEffect } from "react";
import GenerateProgress from "@/components/GenerateProgress";

function getSummarizedProgress(blocks) {
  const blocksWithUrl = blocks.filter((block) => block.url);
  const summarizedBlocks = blocksWithUrl.filter((block) => block.summary);

  return {
    completed: summarizedBlocks.length,
    total: blocksWithUrl.length,
  };
}

async function getBlocks(draftId) {
  try {
    const response = await fetch("/api/drafts");
    const drafts = await response.json();
    const draft = drafts.find((draft) => draft._id === draftId);
    return draft.blocks;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

export default function GeneratedArticle({ startingBlocks }) {
  const [blocks, setBlocks] = useState(startingBlocks);
  const [progress, setProgress] = useState(getSummarizedProgress(blocks));

  //   // get blocks again every half second until complete
  //   useEffect(() => {
  //     const interval = setInterval(async () => {
  //       const id = blocks[0].draftId;
  //       const newBlocks = await getBlocks(id);
  //       setBlocks(newBlocks);
  //     }, 500);

  //     return () => clearInterval(interval);
  //   }, [blocks]);

  useEffect(() => {
    setProgress(getSummarizedProgress(blocks));
  }, [blocks]);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <GenerateProgress progress={progress} />
      <p className="text-lg mb-6">
        {`URL Blocks Summarized: ${progress.completed} / ${progress.total}`}
      </p>
      <div className="space-y-8">
        {blocks.map((block) => (
          <div key={block._id.toString()}>
            {block.content && (
              <h2 className="text-2xl font-semibold mb-4">{block.content}</h2>
            )}
            {block.thumbnailUrl && (
              <div className="flex justify-center mb-4">
                <img
                  src={block.thumbnailUrl}
                  alt="Block thumbnail"
                  className="max-w-full w-48 h-auto rounded shadow"
                />
              </div>
            )}
            <p className="font-bold text-lg mb-2">
              <a
                href={block.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {block.title}
              </a>
            </p>
            {block.summary && <p className="text-gray-700">{block.summary}</p>}
            <hr className="my-4" />
          </div>
        ))}
      </div>
    </div>
  );
}
