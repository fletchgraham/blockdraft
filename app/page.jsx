import SignIn from "@/components/SignIn";
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
        <div className="mx-auto max-w-md flex flex-col items-center mt-10">
          <SignIn />
          <p>or</p>
          <h2 className="text-center text-2xl font-bold m-2">
            Create an account
          </h2>
          <RegisterForm />
        </div>
      </>
    );
  }

  return (
    <>
      <BlockEditor />
    </>
  );
}
