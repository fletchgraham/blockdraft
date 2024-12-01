import "./global.css";

export const metadata = {
  title: "BlockDraft AI",
  description: "Create curated content with an AI-enabled block editor.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth" data-theme="cmyk">
      <head>
        <meta charSet="UTF-8" />
        <link rel="icon" href="/favicon.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{metadata.title}</title>

        {/* Google Analytics Tag */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-YWDLGM8K5T"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-YWDLGM8K5T');
            `,
          }}
        />

        {/* Google Ads Conversion Tracking */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              function gtag_report_conversion(url) {
                var callback = function () {
                  if (typeof(url) != 'undefined') {
                    window.location = url;
                  }
                };
                gtag('event', 'conversion', {
                  'send_to': 'AW-16802466582/9j1YCJ3N9PAZEJaWhcw-',
                  'value': 1.0,
                  'currency': 'USD',
                  'event_callback': callback
                });
                return false;
              }
            `,
          }}
        />
      </head>
      <body className="font-body">{children}</body>
    </html>
  );
}
