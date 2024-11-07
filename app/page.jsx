import BlockList from "../components/BlockList";
import RegisterForm from "../components/RegisterForm";
import { getUserFromCookies } from "../lib/getUser";

export default async function Page() {
  const user = await getUserFromCookies();
  if (user) {
    return (
      <div className="max-w-md mx-auto">
        <BlockList />
      </div>
    );
  }
  return (
    <>
      <p className="text-center text-2xl font-bold mb-5">Create an acount</p>
      <RegisterForm />
    </>
  );
}
