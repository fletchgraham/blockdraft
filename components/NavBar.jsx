import Link from "next/link";
import { getUserFromCookies } from "../lib/getUser";
import { logout } from "@/actions/user/logout";

export default async function NavBar() {
  const user = await getUserFromCookies();
  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <Link className="text-xl" href="/">
          blockdraft.ai
        </Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          {user && (
            <>
              <li className="mr-3">
                <Link className="btn btn-primary" href="/import-urls">
                  Import urls
                </Link>
              </li>
              <li className="mr-3">
                <Link className="btn btn-ghost" href="/drafts">
                  Drafts
                </Link>
              </li>
              <li>
                <form className="btn btn-ghost" action={logout}>
                  <button>Log Out</button>
                </form>
              </li>
            </>
          )}
          {!user && (
            <li>
              <Link href="/login">Login</Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
