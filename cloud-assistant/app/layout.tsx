import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import AmplifyProvider from "@/components/amplify-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AWS Cloud Assistant",
  description: "Conversational AI Assistant for AWS Services",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AmplifyProvider>{children}</AmplifyProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}