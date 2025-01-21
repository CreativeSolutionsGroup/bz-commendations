import { Paper, Stack, Typography, Button } from "@mui/material";
import { signIn } from "next-auth/react";
import { Raleway } from "next/font/google";
import MicrosoftIcon from "@/components/MicrosoftIcon";

const raleway = Raleway({ subsets: ["latin"], weight: "900" });

export default function SignIn() {
  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      sx={{ mx: "auto", height: "85vh" }}
    >
      <Button onClick={() => signIn("azure-ad", { callbackUrl: "/" })}>
        <MicrosoftIcon />
      </Button>
    </Stack>
  );
}
