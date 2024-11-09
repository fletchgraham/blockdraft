import BlockList from "../components/BlockList";
import Link from "next/link";
import RegisterForm from "../components/RegisterForm";
import { getUserFromCookies } from "../lib/getUser";
import { getInboxBlocks } from "../lib/blocks";

export default async function Page() {
  const user = await getUserFromCookies();

  if (!user) {
    return (
      <>
        <p className="text-center text-2xl font-bold mb-5">Create an account</p>
        <RegisterForm />
      </>
    );
  }

  const blocks = await getInboxBlocks(user.userId);

  if (!blocks.length) {
    return (
      <div className="text-center">
        <p className="text-center text-2xl font-bold">Your inbox empty.</p>
        <Link className="text-center text-xl link-primary" href="import-urls">
          Import some URLs to get started.
        </Link>
      </div>
    );
  }

  return (
    <>
      <BlockList blocks={blocks} />
    </>
  );
}
