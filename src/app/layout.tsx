import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Titlebar from "@/components/Titlebar";
import { getUserRole } from "@/app/actions/cookieFetcher";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Velocity Development",
  description: "Premium Minecraft Resources",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookie = await getUserRole();
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Titlebar role={cookie}></Titlebar>
        {children}
      </body>
    </html>
  );
}
