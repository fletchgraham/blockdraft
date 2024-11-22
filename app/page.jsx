import { RegisterForm } from "@/components/Auth";
import { auth } from "@/auth";
import BlockEditor from "@/components/BlockEditor/BlockEditor";
import Header from "@/components/Header";

export default async function Page() {
  const session = await auth();

  if (!session) {
    return (
      <>
        <Header title="Register" />
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
