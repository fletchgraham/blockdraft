import { redirect } from "next/navigation";
import { LoginForm } from "@/components/Auth";

import { auth } from "@/auth";

export default async function LoginPage() {
  // redirect to the draft editor if already logged in
  const user = (await auth())?.user;
  if (user) {
    return redirect("/edit");
  }

  return <LoginForm />;
}
