import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Alvaro Gervasini Automóviles",
  description: "Venta de vehículos usados y financiados en Uruguay. Financiación y permuta disponible.",
  openGraph: {
    title: "Alvaro Gervasini Automóviles",
    description: "Venta de vehículos usados y financiados en Uruguay. Financiación y permuta disponible.",
    url: "https://gervasiniautomoviles.com.uy",
    siteName: "Alvaro Gervasini Automóviles",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Alvaro Gervasini Automóviles",
      },
    ],
    locale: "es_UY",
    type: "website",
  },
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="es" data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}