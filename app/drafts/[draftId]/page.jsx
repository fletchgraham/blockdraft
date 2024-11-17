import { notFound, redirect } from "next/navigation";
import { getUserFromCookies } from "@/lib/getUser";
import { getDraft, getBlocksForDraft } from "@/lib/db";
import GeneratedArticle from "@/components/GeneratedArticle";
import sharp from "sharp";
import CopyToClipboard from "@/components/CopyDraftToClipBoard";

async function processImageToBase64(url) {
  try {
    // Fetch the image
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    // Convert the response to an ArrayBuffer, then to a Node.js Buffer
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Resize and convert to base64 using sharp
    const resizedImage = await sharp(buffer)
      .resize(200, 150) // Resize to 200x150 pixels
      .jpeg({ quality: 50 }) // Convert to JPEG with 50% quality
      .toBuffer();

    return `data:image/jpeg;base64,${resizedImage.toString("base64")}`;
  } catch (error) {
    console.error(`Error processing image at ${url}:`, error.message);
    return null; // Fallback to null if processing fails
  }
}

export default async function DraftPage({ params }) {
  const user = await getUserFromCookies();
  if (!user) {
    return redirect("/");
  }

  const { draftId } = params;
  const draft = await getDraft(draftId);
  if (!draft) {
    notFound();
  }

  const blocks = await getBlocksForDraft(draftId);

  // Process images to base64
  const processedBlocks = await Promise.all(
    blocks.map(async (block) => {
      if (block.thumbnailUrl) {
        block.thumbnailUrl = await processImageToBase64(block.thumbnailUrl);
      }
      return block;
    })
  );

  return (
    <>
      <h1 className="text-3xl">{draft.name}</h1>
      <CopyToClipboard blocks={processedBlocks} />
      <GeneratedArticle blocks={processedBlocks} />
    </>
  );
}
