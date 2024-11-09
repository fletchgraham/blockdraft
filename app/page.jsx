import BlockList from "../components/BlockList";
import Link from "next/link";
import RegisterForm from "../components/RegisterForm";
import { getUserFromCookies } from "../lib/getUser";
import { getInboxBlocks } from "../lib/blocks";

export default async function Page() {
  const user = await getUserFromCookies();
  const blocks = await getInboxBlocks();

  return (
    <>
      {!user ? (
        <>
          <p className="text-center text-2xl font-bold mb-5">
            Create an account
          </p>
          <RegisterForm />
        </>
      ) : blocks.length ? (
        <BlockList blocks={blocks} />
      ) : (
        <div className="text-center">
          <p className="text-center text-2xl font-bold">Your inbox empty.</p>
          <Link className="text-center text-xl link-primary" href="import-urls">
            Import some URLs to get started.
          </Link>
        </div>
      )}
    </>
  );
}
