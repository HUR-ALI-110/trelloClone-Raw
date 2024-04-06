import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Modal from "./_components/Modal";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Trello Clone 2.0",
  description: "Trello Clone 2.0 developed By Hurr Ali",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="bg-[#F5F6F8]">{children}
        <Modal />
        </div>
      </body>
    </html>
  );
}
