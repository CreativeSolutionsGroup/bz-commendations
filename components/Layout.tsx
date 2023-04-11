import { ThemeProvider } from "@mui/material/styles";
import { PropsWithChildren } from "react";
import { Roboto } from "@next/font/google";
import theme from "@/config/theme";
import { Header } from "./Header";

const roboto = Roboto({ weight: ["400", "700"], subsets: ["latin"] });

export const Layout = ({ children }: PropsWithChildren<{ children: any }>) => {
  return (
    <ThemeProvider theme={theme}>
      <div className={roboto.className}>
        <Header />
        <main>{children}</main>
      </div>
    </ThemeProvider>
  );
};