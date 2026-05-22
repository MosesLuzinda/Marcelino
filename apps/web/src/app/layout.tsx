import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { Providers } from "@/components/providers";
import { Chatbot } from "@/components/Chatbot";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta" });

export const metadata: Metadata = {
  title: { default: "Marcelino International Academy", template: "%s | Marcelino Academy" },
  description: "World-class education in Uganda. Excellence Through Education.",
  keywords: ["school", "education", "Uganda", "academy", "Marcelino"],
  openGraph: { type: "website", locale: "en_US", siteName: "Marcelino Academy" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jakarta.variable} font-sans`}>
        <Providers>
          {children}
          <Chatbot />
        </Providers>
      </body>
    </html>
  );
}
