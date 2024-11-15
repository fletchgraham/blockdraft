import { redirect } from "next/navigation";
import { getUserFromCookies } from "@/lib/getUser";

export default async function GeneratedPage({ params }) {
  const user = await getUserFromCookies();
  if (!user) {
    redirect("/");
  }

  return (
    <div>
      <h1>Generated Page for {params.draftId}</h1>
      <p>This is a generated page.</p>
    </div>
  );
}
