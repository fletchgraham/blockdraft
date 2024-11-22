import { GitHubLogo } from "@/components/Icons";
import AuthProviderBtns from "./AuthProviderBtns";
import LoginWithEmail from "./LoginWithEmail";

export default function LoginForm() {
  return (
    <div className="mx-auto max-w-md flex flex-col items-center mt-10">
      <h2 className="text-center text-2xl font-bold mb-5 mt-10">
        Welcome Back!
      </h2>
      <AuthProviderBtns />
      <p className="mb-4">or</p>
      <LoginWithEmail />
    </div>
  );
}
