import { redirect } from "next/navigation";
import LoginForm from "../../components/LoginForm";
import { getUserFromCookies } from "../../lib/getUser";
import Header from "@/components/Header";

export default async function LoginPage() {
  // Redirect to home page if user is already logged in
  const user = await getUserFromCookies();
  if (user) {
    return redirect("/");
  }

  return (
    <div>
      <Header title="Login" />
      <h2 className="text-center text-2xl font-bold mb-5 mt-10">
        Welcome Back!
      </h2>
      <LoginForm />
    </div>
  );
}
