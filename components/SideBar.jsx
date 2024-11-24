import { auth } from "@/auth";
import SideBarLinks from "./SideBarLinks";

export default async function Sidebar({ children }) {
  const session = await auth();
  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col items-center">
        {/* Page content here */}
        {children}
        {/* <label
          htmlFor="my-drawer-2"
          className="btn btn-primary drawer-button lg:hidden"
        >
          Open drawer
        </label> */}
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-2"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu bg-white border-gray-800 border-r text-base-content min-h-full w-56 p-4">
          {/* Sidebar content here */}
          <SideBarLinks sessionExists={session} />
        </ul>
      </div>
    </div>
  );
}
