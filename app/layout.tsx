import { ReactNode } from "react";
import "./globals.css";

export const metadata = { title: "Sawaka", description: "Artisanat authentique" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
