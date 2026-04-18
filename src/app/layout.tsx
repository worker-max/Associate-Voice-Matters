import type { Metadata, Viewport } from "next";
import { Lora, Plus_Jakarta_Sans } from "next/font/google";
import { Navbar } from "@/components/nav/Navbar";
import { Footer } from "@/components/nav/Footer";
import "./globals.css";

const lora = Lora({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-lora",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://associatevoicematters.com"),
  title: {
    default: "AssociateVoiceMatters — Every voice matters. Especially yours.",
    template: "%s · AssociateVoiceMatters",
  },
  description:
    "A neutral platform where any associate, in any industry, can speak, be heard, and be represented by AI. Channel is always free. Envoy is success-fee only.",
  openGraph: {
    type: "website",
    url: "https://associatevoicematters.com",
    title: "AssociateVoiceMatters",
    description:
      "Channel — anonymous feedback, always free. Envoy — AI advocacy, success-fee only.",
    siteName: "AssociateVoiceMatters",
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#4A7C6F",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${lora.variable} ${jakarta.variable}`}>
      <body className="min-h-screen bg-ivory text-slate antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
