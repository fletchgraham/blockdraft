import Link from "next/link";
import { getUserFromCookies } from "../lib/getUser";
import { logout } from "../actions/userController";

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
            <li>
              <form action={logout}>
                <button>Log Out</button>
              </form>
            </li>
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
