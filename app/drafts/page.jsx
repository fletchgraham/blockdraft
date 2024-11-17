import { redirect } from "next/navigation";
import Link from "next/link";
import { getUserFromCookies } from "@/lib/getUser";
import { getDrafts } from "@/lib/db";

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
