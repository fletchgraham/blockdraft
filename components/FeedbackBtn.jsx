import Link from "next/link";

export default function FeedbackBtn() {
  return (
    <Link
      className="btn btn-secondary fixed bottom-0 right-0 p-4 m-6 z-10 shadow-lg"
      href="/feedback"
    >
      Give Feedback
    </Link>
  );
}
