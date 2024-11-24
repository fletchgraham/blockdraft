import Sidebar from "@/components/SideBar";

export const metadata = {
  title: "BlockDraft.ai",
  description: "Create curated content with an AI-enabled block editor.",
};

export default function Layout({ children }) {
  return (
    <html lang="en" data-theme="lofi">
      <body>
        <Sidebar>
          <main className="w-full">{children}</main>
        </Sidebar>
      </body>
    </html>
  );
}
