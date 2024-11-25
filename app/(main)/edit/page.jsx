import { redirect } from "next/navigation";
import { auth } from "@/auth";
import BlockEditor from "@/components/BlockEditor/BlockEditor";

export default async function Page() {
  const session = await auth();
  if (!session) {
    redirect("/");
  }
  return <BlockEditor />;
}
