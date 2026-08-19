import type { Metadata } from "next";
import { NightSky } from "@/components/NightSky";
import "./globals.css";

export const metadata: Metadata = {
  title: "মায়াপুর — আমাদের স্বপ্নের রাজ্য",
  description: "দুজনের স্মৃতি, ছবি আর বার্ষিকী — শুধু আমাদের জন্য।",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bn">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Baloo+Da+2:wght@500;700&family=Hind+Siliguri:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <NightSky />
        {children}
      </body>
    </html>
  );
}
