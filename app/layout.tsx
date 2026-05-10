import type { Metadata } from "next";
import { Bebas_Neue, Inter } from "next/font/google";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "SAVOR.AI × Chowman | AI Dining Intelligence",
  description: "Your AI-powered dining companion at Chowman. Tell us your mood, we'll find your perfect dish.",
  keywords: ["AI", "food", "restaurant", "Chowman", "Chinese", "Kolkata", "dining"],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body className={`${bebasNeue.variable} ${inter.variable} font-body bg-brand-black text-white antialiased`}>
        {children}
      </body>
    </html>
  );
}
