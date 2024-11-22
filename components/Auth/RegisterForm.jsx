import { GitHubLogo } from "@/components/Icons";
import SignIn from "./SignIn";
import RegisterWithEmail from "./RegisterWithEmail";

export default function RegisterForm() {
  return (
    <div className="mx-auto max-w-md flex flex-col items-center mt-10">
      <h2 className="text-center text-2xl font-bold m-2">Create an account</h2>
      <SignIn provider="github">
        <GitHubLogo />
        Sign up with GitHub
      </SignIn>
      <p>or</p>
      <RegisterWithEmail />
    </div>
  );
}
