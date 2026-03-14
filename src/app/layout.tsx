import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI·机器人产业链投资分析助手",
  description: "实时产业情报 · 深度洞察 · 投资建议",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Noto+Sans+SC:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
