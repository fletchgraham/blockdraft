import { getDrafts } from "../../actions/draftController";
import Link from "next/link";

export default async function DraftsPage() {
  const drafts = await getDrafts();
  return (
    <div>
      <h1>Drafts</h1>
      <ul>
        {drafts.map((draft) => (
          <li key={draft._id}>
            <Link href={`/drafts/${draft._id}`}>{draft.name}</Link>
          </li>
        ))}
        <li>
          <Link href="/drafts/create">New Draft</Link>
        </li>
      </ul>
    </div>
  );
}
