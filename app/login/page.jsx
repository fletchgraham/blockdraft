import { redirect } from "next/navigation";
import LoginForm from "../../components/LoginForm";
import { getUserFromCookies } from "../../lib/getUser";

export default async function LoginPage() {
  // Redirect to home page if user is already logged in
  const user = await getUserFromCookies();
  if (user) {
    return redirect("/");
  }

  return (
    <div>
      <h2 className="text-center text-2xl font-bold mb-5">Welcome Back!</h2>
      <LoginForm />
    </div>
  );
}
