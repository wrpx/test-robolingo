import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LINE OA Webchat Demo",
  description: "Webchat demo that sends messages through a LINE Official Account.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}
