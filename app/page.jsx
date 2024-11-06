import RegisterForm from "../components/RegisterForm";
import { getUserFromCookies } from "../lib/getUser";

export default async function Page() {
  const user = await getUserFromCookies();
  if (user) {
    return (
      <>
        <h1 className="text-center text-2xl font-bold mb-5">Coming Soon!</h1>
        <p className="text-center">
          BlockDraft AI is a platform that allows you to create curated content
          with an AI-enabled block editor. It's currently in development, so
          come back soon for functionality!
        </p>
      </>
    );
  }
  return (
    <>
      <p className="text-center text-2xl font-bold mb-5">Create an acount</p>
      <RegisterForm />
    </>
  );
}
