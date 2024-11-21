export default function Header({ title, children }) {
  return (
    <div className="border-b navbar bg-base-100 px-2">
      <label
        htmlFor="my-drawer-2"
        className="btn btn-ghost drawer-button lg:hidden mr-4"
      >
        <div className="space-y-2">
          <span className="block h-0.5 w-8 bg-gray-600"></span>
          <span className="block h-0.5 w-8 bg-gray-600"></span>
          <span className="block h-0.5 w-8 bg-gray-600"></span>
        </div>
      </label>
      <div className="flex-1">
        <h1 className="font-semibold text-2xl">{title}</h1>
      </div>
      <div className="flex-none">
        <div className="menu menu-horizontal">{children}</div>
      </div>
    </div>
  );
}
