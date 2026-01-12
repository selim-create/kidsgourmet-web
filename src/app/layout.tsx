import type { Metadata } from "next";
// import { Inter, Quicksand } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header"; 
import Footer from "@/components/layout/Footer";
import { UserProvider } from "@/hooks/use-user";
import { ChildProfileProvider } from "@/contexts/ChildProfileContext";

// const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
// const quicksand = Quicksand({ subsets: ["latin"], variable: "--font-quicksand" });

export const metadata: Metadata = {
  title: "KidsGourmet - Mutlu Bebekler, Bilinçli Ebeveynler",
  description: "Bebek ve çocuk beslenmesinde güvenilir rehberiniz.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      {/* Localde className'i güncelleyin: className={`${inter.variable} ${quicksand.variable} ...`} */}
      <body className="bg-gray-50 text-brand-dark font-sans antialiased flex flex-col min-h-screen">
        <UserProvider>
          <ChildProfileProvider>
            <Header />
            <main className="flex-grow pt-24 w-full">
              {children}
            </main>
            <Footer />
          </ChildProfileProvider>
        </UserProvider>
      </body>
    </html>
  );
}