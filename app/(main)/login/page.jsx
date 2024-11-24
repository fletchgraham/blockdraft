import { redirect } from "next/navigation";
import { LoginForm } from "@/components/Auth";

import Header from "@/components/Header";
import { auth } from "@/auth";

export default async function LoginPage() {
  // Redirect to home page if user is already logged in
  const user = (await auth())?.user;
  if (user) {
    return redirect("/");
  }

  return (
    <div>
      <Header title="Login" />
      <LoginForm />
    </div>
  );
}
