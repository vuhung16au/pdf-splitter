import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NetworkProvider } from "./context/NetworkContext";
import OfflineNotification from "./components/OfflineNotification";
import ServiceWorkerRegistration from "./components/ServiceWorkerRegistration";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "PDF Splitter",
  description: "Split multi-page PDF files into single-page PDFs and download as a zip",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <NetworkProvider>
          <OfflineNotification />
          <ServiceWorkerRegistration />
          {children}
        </NetworkProvider>
      </body>
    </html>
  );
}
