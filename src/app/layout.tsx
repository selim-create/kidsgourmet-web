import type { Metadata } from "next";
import "./globals.css";
import { UserProvider } from "@/hooks/use-user";
import { ChildProfileProvider } from "@/contexts/ChildProfileContext";
import { ActiveChildProvider } from "@/contexts/ActiveChildContext";
import { Toaster } from "sonner";

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
      <body className="bg-gray-50 text-brand-dark font-sans antialiased">
        <UserProvider>
          <ActiveChildProvider>
            <ChildProfileProvider>
              {children}
              <Toaster position="top-center" richColors />
            </ChildProfileProvider>
          </ActiveChildProvider>
        </UserProvider>
      </body>
    </html>
  );
}