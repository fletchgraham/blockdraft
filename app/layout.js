import "./global.css";
import NavBar from "../components/NavBar";
import Sidebar from "@/components/SideBar";

export const metadata = {
  title: "BlockDraft.ai",
  description: "Create curated content with an AI-enabled block editor.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="lofi">
      <body>
        <Sidebar>
          <main className="container mx-auto">{children}</main>
        </Sidebar>
      </body>
    </html>
  );
}
