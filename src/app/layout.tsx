import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LINE OA Webchat",
  description: "Webchat for sending messages through a LINE Official Account.",
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
