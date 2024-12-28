import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Menu from "@/components/Menu";
import "github-markdown-css/github-markdown.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "React Flexible Form",
  description: "React Flexible Form documentation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div
          style={{
            display: "grid",
            gridTemplateRows: "80px auto",
            gridTemplateColumns: "30% 70%",
            flex: 1,
            height: "100%",
          }}
        >
          <div
            style={{
              gridColumn: "1 / span 2",
              gridRow: 1,
              display: "flex",
              borderBottom: "2px solid rgba(0, 116, 217, 0.1)",
              backgroundColor: "#f6f6f7",
            }}
          >
            <Header />
          </div>
          <div
            style={{
              gridColumn: 1,
              gridRow: 2,
              display: "flex",
              flexDirection: "column",
              borderRight: "2px solid rgba(0, 116, 217, 0.1)",
              overflow: "auto",
              backgroundColor: "#f6f6f7",
            }}
          >
            <Menu />
          </div>
          <div
            style={{
              gridColumn: 2,
              gridRow: 2,
              padding: "20px 27px 20px 50px",
              overflow: "auto",
            }}
            className="markdown-body"
          >
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
