import { redirect } from "next/navigation";

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
      <Header title="Drafts" />
      <DraftsGrid />
    </>
  );
}
