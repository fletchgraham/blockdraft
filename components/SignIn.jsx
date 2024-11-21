import { signIn } from "@/auth";

export default function SignIn() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("github");
      }}
      className="w-full p-4"
    >
      <button className="btn w-full" type="submit">
        Signin with GitHub
      </button>
    </form>
  );
}
