import type React from "react";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "../lib/auth-context";
import ContextProvider from "../context";
import { cookies } from "next/headers";
import "../styles/globals.css";
import { ToastProvider, ToastViewport } from "../components/ui/toast";
import ToastRootClient from "../components/ui/ToastRootClient";

export const metadata = {
  title: "OanicAI Dashboard",
  description: "Web3 dashboard for OanicAI platform",
  icons: {
    icon: "/favicon.ico",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  return (
    <html lang="en">
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <ContextProvider
            cookies={decodeURIComponent(cookieStore.toString()) || null}
          >
            <AuthProvider>
              <ToastRootClient>
                <ToastProvider>
                  {/* ToastViewport should be outside the main content but inside the provider */}
                  <ToastViewport />
                  {children}
                </ToastProvider>
              </ToastRootClient>
            </AuthProvider>
          </ContextProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}