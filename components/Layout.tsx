import { ThemeProvider } from "@mui/material/styles";
import { PropsWithChildren } from "react"
import { Header } from "./Header";

import { Roboto } from '@next/font/google'
import theme from "../config/theme";
import Head from "next/head";
import Link from "next/link";
import favicon from "../assets/favicon.ico"

const roboto = Roboto({ weight: ["400", "700"], subsets: ["latin"] });

export const Layout = ({ children }: PropsWithChildren<{ children: any }>) => {
  return (
    <ThemeProvider theme={theme}>
      <div className={roboto.className}>
        <Header />
        <main>{children}</main>
      </div>
    </ThemeProvider>
  )
}