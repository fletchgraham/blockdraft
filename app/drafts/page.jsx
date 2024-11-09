import { getCollection } from "../../lib/db";
import { getUserFromCookies } from "../../lib/getUser";
import { redirect } from "next/navigation";
import Link from "next/link";

async function getDrafts(userId) {
  const draftCollection = await getCollection("drafts");
  const draftDocs = await draftCollection.find({ userId }).toArray();
  const drafts = draftDocs.map((draftDoc) => {
    return {
      _id: draftDoc._id,
      name: draftDoc.name,
    };
  });
  return drafts;
}

export default async function DraftsPage() {
  const user = await getUserFromCookies();
  if (!user) {
    return redirect("/");
  }
  const drafts = await getDrafts(user.userId);
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
