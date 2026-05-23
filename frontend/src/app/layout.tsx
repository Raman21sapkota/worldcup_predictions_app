import type { Metadata } from "next"
import { Inter } from "next/font/google"
import AppLayout from "@/components/layout/app-layout"
import "./globals.css"

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "World Cup Predictor",
  description: "Predict match outcomes for the FIFA World Cup 2026",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  )
}
