import "./global.css";

export const metadata = {
  title: "BlockDraft AI",
  description: "Create curated content with an AI-enabled block editor.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth" data-theme="light">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#ffffff" />
        <meta
          name="description"
          content="Create curated content with an AI-enabled block editor."
        />

        <link rel="icon" href="/favicon.png" />
        <link rel="manifest" href="/manifest.json" />

        {/* iOS home screen icon */}
        <link rel="apple-touch-icon" href="/ios/180.png" />

        <title>BlockDraft AI</title>
      </head>

      <body className="font-body">{children}</body>
    </html>
  );
}
