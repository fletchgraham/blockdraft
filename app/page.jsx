import RegisterForm from "../components/RegisterForm";
import { getUserFromCookies } from "../lib/getUser";
import BlockEditor from "@/components/BlockEditor/BlockEditor";
import Header from "@/components/Header";

export default async function Page() {
  const user = await getUserFromCookies();

  if (!user) {
    return (
      <>
        <Header title="Register" />
        <h2 className="text-center text-2xl font-bold mb-5 mt-10">
          Create an account
        </h2>
        <RegisterForm />
      </>
    );
  }

  return (
    <>
      <BlockEditor />
    </>
  );
}
