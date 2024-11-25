import Link from "next/link";

export default function Hero() {
  return (
    <div className="hero bg-base-200 min-h-screen p-12">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <img
          src="/images/block-editor-preview.png"
          alt="Block editor preview"
          className="max-w-md rounded-lg shadow-2xl"
        />
        <div>
          <h1 className="text-5xl font-bold">
            Streamline Your Newsletter Workflow
          </h1>
          <p className="py-6">
            Build and curate your newsletters effortlessly with drag-and-drop
            blocks, powerful integrations, and AI-assisted summaries. Stay
            organized, save time, and deliver high-quality content to your
            audience.
          </p>
          <Link href="/register" className="btn btn-primary">
            Try for Free
          </Link>
          <Link href="/login" className="btn btn-ghost">
            Or Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
