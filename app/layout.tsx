import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import { GlobalStateProvider } from "./context/GlobalStateContext";
import { WagmiProviders } from "@/components/providers/WagmiProviders";
import SWRProvider from "./providers/SWRProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EGR - Educating Global Resilience",
  description: "Connecting students worldwide through innovative online learning experiences",
  keywords: ["online learning", "education", "courses", "global classrooms"],
  authors: [{ name: "EGR Team" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <WagmiProviders>
          <SWRProvider>
            <GlobalStateProvider>
              <AuthProvider>
                {children}
              </AuthProvider>
            </GlobalStateProvider>
          </SWRProvider>
        </WagmiProviders>
      </body>
    </html>
  );
}
