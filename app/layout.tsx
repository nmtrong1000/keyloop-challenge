import type { Metadata } from "next";
import { Hanken_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import { MockingProvider } from "@/shared/components/MockingProvider";
import { Providers } from "@/shared/components/Providers";
import { Sidebar } from "@/shared/components/Sidebar";
import { Header } from "@/shared/components/Header";
import { Breadcrumb } from "@/shared/components/Breadcrumb";
import "./globals.css";

const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-hanken-grotesk",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Intelligent Inventory Dashboard",
  description: "Dealership vehicle inventory, aging stock, and action logging.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${hankenGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <MockingProvider>
          <Providers>
            <div className="flex min-h-screen bg-surface text-on-surface">
              <Sidebar />
              <div className="flex min-w-0 flex-1 flex-col">
                <Header />
                <main className="flex-1 overflow-y-auto px-margin-mobile py-gutter md:px-margin-desktop">
                  <Breadcrumb />
                  {children}
                </main>
              </div>
            </div>
          </Providers>
        </MockingProvider>
      </body>
    </html>
  );
}
