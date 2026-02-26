import type { Metadata } from "next";
import "./globals.css";

const title = "Kevin Frey — Where Vision Meets Creativity";
const description =
  "Director and creative producer delivering cinematic, movement-driven systems for film, television, and large-scale live moments.";

export const metadata: Metadata = {
  metadataBase: new URL("https://kevinfrey.com"),
  title: {
    default: title,
    template: "%s | Kevin Frey",
  },
  description,
  keywords: [
    "Kevin Frey",
    "Director",
    "Creative Producer",
    "Producer Coordinator",
    "Netflix",
    "Star Search",
    "Lady Gaga",
    "Taylor Swift",
    "Ariana Grande",
    "J Balvin",
    "Choreographer",
  ],
  openGraph: {
    title,
    description,
    url: "https://kevinfrey.com",
    siteName: "Kevin Frey",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Kevin Frey Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    creator: "@kevinfrey",
    images: ["/twitter-image"],
  },
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/icons/favicon.ico" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: ["/icons/favicon.ico"],
    apple: [
      { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  other: {
    author: "Kevin Frey",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-black">
      <body className="bg-black text-white">
        {children}
      </body>
    </html>
  );
}
