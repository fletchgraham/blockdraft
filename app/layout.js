import "./global.css";
import NavBar from "../components/NavBar";

export const metadata = {
  title: "BlockDraft.ai",
  description: "Create curated content with an AI-enabled block editor.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light">
      <body>
        <header className="shadow-md">
          <div className="container mx-auto">
            <NavBar />
          </div>
        </header>
        <main className="container mx-auto p-10">{children}</main>
        <footer className="text-center fixed bottom-5 left-5">
          © {new Date().getFullYear()} blockdraft.ai
        </footer>
      </body>
    </html>
  );
}
