import { redirect } from "next/navigation";
import Link from "next/link";
import { getUserFromCookies } from "@/lib/getUser";
import { getDraftsWithBlocks } from "@/lib/db";
import DraftCard from "@/components/DraftCard";

export default async function DraftsPage() {
  const user = await getUserFromCookies();
  if (!user) {
    return redirect("/");
  }

  // Fetch drafts with blocks to get thumbnail URLs
  const drafts = await getDraftsWithBlocks();

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">Drafts</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {drafts.map((draft) => (
          <DraftCard key={draft._id} draft={draft} />
        ))}
        <div className="card card-compact bg-base-100 w-60 shadow-md">
          <div className="card-body flex items-center justify-center">
            <Link href="/drafts/create" className="btn btn-primary">
              + New Draft
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
