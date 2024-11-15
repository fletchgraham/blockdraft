import { redirect } from "next/navigation";
import { getUserFromCookies } from "@/lib/getUser";
import { getBlocksForDraft } from "@/lib/blocks";

export default async function GeneratedPage({ params }) {
  const user = await getUserFromCookies();
  if (!user) {
    redirect("/");
  }

  const draftId = await params.draftId;
  const blocks = await getBlocksForDraft(params.draftId);

  return (
    <div>
      <h1>Generated Page for {draftId}</h1>
      <ul>
        {blocks.map((block) => (
          <li key={block._id.toString()}>{block.title}</li>
        ))}
      </ul>
    </div>
  );
}
