import { signIn } from "@/auth";
import { GitHubLogo } from "@/components/Logos";

export default function AuthProviderBtns() {
  return (
    <>
      <form
        action={async () => {
          "use server";
          await signIn("github");
        }}
        className="w-full mb-4"
      >
        <button className="btn w-full" type="submit">
          <GitHubLogo />
          Continue with Github
        </button>
      </form>
      <form
        action={async () => {
          "use server";
          await signIn("github");
        }}
        className="w-full mb-4"
      >
        <button className="btn w-full" type="submit">
          <GitHubLogo />
          Continue with Google
        </button>
      </form>
    </>
  );
}
