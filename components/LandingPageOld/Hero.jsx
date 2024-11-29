import Link from "next/link";
import HeroDemo from "./HeroDemo";

export default function Hero() {
  return (
    <div className="hero bg-base-200 min-h-screen p-12">
      <div className="hero-content flex-col lg:flex-row">
        <div className="mb-10">
          <h1 className="text-5xl font-bold">
            Streamline Your Content Workflow
          </h1>
          <p className="py-6">
            Curate and build your newsletter effortlessly with drag-and-drop
            blocks, AI summaries, and versatile rich-text output. Stay
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
        <HeroDemo />
      </div>
    </div>
  );
}
