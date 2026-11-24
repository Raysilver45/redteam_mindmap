import type { Metadata } from "next";
import { Inter, Monoton, Changa_One, Stack_Sans_Notch, Sofia_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Navigation from "@/components/NavBar";
import Footer from "@/components/Footer";
import localFont from 'next/font/local';

// 1. Correction des chemins et des styles
const riantDisplay = localFont({
  src: [
    {
      path: '../public/fonts/riant-display-inline.otf', // Chemin relatif vers public
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/riant-display-semibold.otf',
      weight: '600',
      style: 'normal', // 'normal' est la valeur attendue ici
    },
    {
      path: '../public/fonts/riant-display-bold.otf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-riant',
  display: 'swap',
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const monoton = Monoton({
  variable: "--font-monoton",
  subsets: ["latin"],
  weight: "400",
});

const changa_one = Changa_One({
  variable: "--font-changa_one",
  subsets: ["latin"],
  weight: "400",
});

// 2. Fix pour l'erreur "Failed to find font override values"
const stack_sans_notch = Stack_Sans_Notch({
  variable: "--font-stack_sans_notch",
  subsets: ["latin"],
  weight: "400",
  adjustFontFallback: false, // Désactive le calcul automatique du fallback
});

const sofia_sans = Sofia_Sans({
  variable: "--font-sofia_sans",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Arcadia - Offensive hacking",
  description: "The ultimate pentesting blog",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* 3. AJOUT de riantDisplay.variable ici ! */}
      <body className={`${inter.variable} ${monoton.variable} ${changa_one.variable} ${stack_sans_notch.variable} ${sofia_sans.variable} ${riantDisplay.variable} font-sans antialiased`}>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Navigation />
            {children}
            <Footer />
          </ThemeProvider>
      </body>
    </html>
  );
}