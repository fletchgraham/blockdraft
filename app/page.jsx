import SignIn from "@/components/SignIn";
import RegisterForm from "../components/RegisterForm";
import { auth } from "@/auth";
import BlockEditor from "@/components/BlockEditor/BlockEditor";
import Header from "@/components/Header";

export default async function Page() {
  const session = await auth();

  if (!session) {
    return (
      <>
        <Header title="Register" />
        <div className="mx-auto max-w-md flex flex-col items-center mt-10">
          <h2 className="text-center text-2xl font-bold m-2">
            Create an account
          </h2>
          <SignIn />
          <p>or</p>
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
