import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ChatWidget from "./components/ChatWidget";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Glovo Sales Agent — Lead Discovery",
  description:
    "AI-powered lead generation agent for Glovo. Discover restaurants, cafés, pharmacies, and more in Nairobi that aren't on Glovo yet.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* Header */}
        <header
          className="sticky top-0 z-50 backdrop-blur-lg"
          style={{
            background: "rgba(11, 15, 20, 0.85)",
            borderBottom: "1px solid var(--color-border)",
          }}
        >
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Glovo Logo Mark */}
              <div
                className="flex items-center justify-center w-9 h-9 rounded-xl font-bold text-base"
                style={{
                  background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))",
                  color: "var(--color-text-inverse)",
                }}
              >
                G
              </div>
              <div>
                <h1 className="text-base font-bold gradient-text">
                  Glovo Sales Agent
                </h1>
                <p
                  className="text-[10px] font-medium -mt-0.5"
                  style={{ color: "var(--color-text-tertiary)" }}
                >
                  Lead Discovery · Nairobi
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                style={{
                  background: "color-mix(in srgb, var(--color-primary) 12%, transparent)",
                  color: "var(--color-primary)",
                  border: "1px solid color-mix(in srgb, var(--color-primary) 20%, transparent)",
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full animate-pulse-glow"
                  style={{ background: "var(--color-primary)" }}
                />
                AI Agent Ready
              </span>
            </div>
          </nav>
        </header>

        {/* Main Content */}
        <main className="flex-1">{children}</main>

        {/* Footer */}
        <footer
          className="py-6 text-center"
          style={{
            borderTop: "1px solid var(--color-border)",
            background: "var(--color-bg-elevated)",
          }}
        >
          <p
            className="text-xs"
            style={{ color: "var(--color-text-tertiary)" }}
          >
            Glovo Sales Agent · Built by{" "}
            <span style={{ color: "var(--color-primary)" }}>
              Nexus Data &amp; Design
            </span>{" "}
            · Powered by Groq AI
          </p>
        </footer>

        {/* Floating Chat Widget */}
        <ChatWidget />
      </body>
    </html>
  );
}
