import { auth } from "@/auth";
import Landing from "@/components/Landing/Landing";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await auth();
  if (session) {
    redirect("/edit");
  }
  return <Landing />;
}
