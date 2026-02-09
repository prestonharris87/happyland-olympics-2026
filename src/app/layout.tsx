import type { Metadata } from "next";
import { Tourney, Montserrat } from "next/font/google";
import "./globals.css";

const tourney = Tourney({
  variable: "--font-tourney",
  subsets: ["latin"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Happyland Olympics 2026 | Bigger, Badder, Better",
  description:
    "The 3rd annual Happyland Olympics. June 12-14, 2026 in Happyland, Oklahoma. Bigger, Badder, Better.",
  openGraph: {
    title: "Happyland Olympics 2026",
    description:
      "The 3rd annual Happyland Olympics. June 12-14, 2026 in Happyland, Oklahoma.",
    images: ["/images/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${tourney.variable} ${montserrat.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
