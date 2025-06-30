import { ThemeProvider } from "next-themes"
import { AuthProvider } from "../lib/auth-context"
import ContextProvider from "../context"
import "../styles/globals.css"

import { GetServerSidePropsContext } from "next";

function getServerSideProps({ req }: GetServerSidePropsContext) {
  const cookies = req.headers.cookie || null
  return { props: { cookies } }
}
import { AppProps } from "next/app";

function MyApp({ Component, pageProps, cookies }: AppProps & { cookies: string | null }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
       <ContextProvider cookies={cookies}>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
      </ContextProvider>
    </ThemeProvider>
  )
}
export { getServerSideProps }
export default MyApp
