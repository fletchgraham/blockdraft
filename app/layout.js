import "./global.css";

export const metadata = {
  title: "BlockDraft.ai",
  description: "Create curated content with an AI-enabled block editor.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="lofi">
      <body>{children}</body>
    </html>
  );
}
