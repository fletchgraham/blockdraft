import { redirect } from "next/navigation";
import Link from "next/link";

import { auth } from "@/auth";
import DraftsGrid from "@/components/DraftGrid/DraftsGrid";
import Header from "@/components/Header";

export default async function DraftsPage() {
  const user = (await auth())?.user;
  if (!user) {
    return redirect("/");
  }

  return (
    <>
      <Header title="Drafts">
        <Link href="/drafts/create" className="btn btn-primary">
          + New Draft
        </Link>
      </Header>
      <DraftsGrid />
    </>
  );
}
