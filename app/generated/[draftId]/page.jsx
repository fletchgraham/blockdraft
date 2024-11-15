import { redirect } from "next/navigation";
import { getUserFromCookies } from "@/lib/getUser";
import { getBlocksForDraft } from "@/lib/blocks";
import GenerateProgress from "@/components/GenerateProgress";

export default async function GeneratedPage({ params }) {
  const user = await getUserFromCookies();
  if (!user) {
    redirect("/");
  }

  const draftId = params.draftId;
  const blocks = await getBlocksForDraft(draftId);

  // Filter blocks with a URL
  const blocksWithUrl = blocks.filter((block) => block.url);
  const summarizedBlocks = blocksWithUrl.filter((block) => block.summary);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <GenerateProgress
        initialComplete={0}
        initialTotal={blocksWithUrl.length}
      />
      <p className="text-lg mb-6">
        {`URL Blocks Summarized: ${summarizedBlocks.length} / ${blocksWithUrl.length}`}
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
