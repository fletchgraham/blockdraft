import { redirect } from "next/navigation";

import { getUserFromCookies } from "@/lib/getUser";
import DraftsGrid from "@/components/DraftsGrid";

export default async function DraftsPage() {
  const user = await getUserFromCookies();
  if (!user) {
    return redirect("/");
  }

  return (
    <>
      <DraftsGrid />
    </>
  );
}
