import type { Metadata } from "next";
import { QueryProvider } from "@/components/providers/query-provider";
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
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
