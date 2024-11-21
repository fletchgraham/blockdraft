import { redirect } from "next/navigation";

import { getUserFromCookies } from "@/lib/getUser";
import DraftsGrid from "@/components/DraftGrid/DraftsGrid";
import Header from "@/components/Header";

export default async function DraftsPage() {
  const user = await getUserFromCookies();
  if (!user) {
    return redirect("/");
  }

  return (
    <>
      <Header title="Drafts" />
      <DraftsGrid />
    </>
  );
}
