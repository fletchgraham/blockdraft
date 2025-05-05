import FeedbackModal from "@/components/FeedbackModal";
import Sidebar from "@/components/SideBar";

export const metadata = {
  title: "BlockDraft.ai",
  description: "Create curated content with an AI-enabled block editor.",
};

export default function Layout({ children }) {
  return (
    <Sidebar>
      <main className="w-full">{children}</main>
      {/* <FeedbackModal /> */}
    </Sidebar>
  );
}
