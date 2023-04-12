import { ThemeProvider } from "@mui/material/styles";
import { PropsWithChildren } from "react";
import { Roboto } from "@next/font/google";
import theme from "@/config/theme";
import { Header } from "./Header";
import IndexAbsoluteElements from "./IndexAbsoluteElements";

const roboto = Roboto({ weight: ["400", "700"], subsets: ["latin"] });

export function Layout({ children }: PropsWithChildren<{ children: any }>) {
  return (
    <ThemeProvider theme={theme}>
      <Header />
      <main className={roboto.className}>
        {children}
      </main>

      <IndexAbsoluteElements />
    </ThemeProvider>
  );
};