import { signIn } from "@/auth";

export default function SignIn({ provider, children }) {
  return (
    <form
      action={async () => {
        "use server";
        await signIn(provider);
      }}
      className="w-full p-4"
    >
      <button className="btn w-full" type="submit">
        {children}
      </button>
    </form>
  );
}
