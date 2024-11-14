import { getUserFromCookies } from "@/lib/getUser";
import { logout } from "@/actions/user";
import Link from "next/link";

export default async function Sidebar({ children }) {
  const user = await getUserFromCookies();
  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col items-center justify-center">
        {/* Page content here */}
        {children}
        <label
          htmlFor="my-drawer-2"
          className="btn btn-primary drawer-button lg:hidden"
        >
          Open drawer
        </label>
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-2"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu bg-white border-gray-800 border-r text-base-content min-h-full w-56 p-4">
          {/* Sidebar content here */}
          <li className="mb-10">
            <Link className="text-xl btn btn-ghost" href="/">
              blockdraft.ai
            </Link>
          </li>
          {user && (
            <>
              <li>
                <Link className="btn btn-ghost" href="/import-urls">
                  Import urls
                </Link>
              </li>
              <li>
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
              <Link href="/login" className="btn btn-ghost">
                Login
              </Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
