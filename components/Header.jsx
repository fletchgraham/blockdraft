export default function Header({ title, children }) {
  return (
    <div className="navbar bg-base-100 px-4">
      <div className="flex-1">
        <h1 className="font-semibold text-3xl">{title}</h1>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">{children}</ul>
      </div>
    </div>
  );
}
