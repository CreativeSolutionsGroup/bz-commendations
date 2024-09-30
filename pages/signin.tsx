import { Paper, Stack, Typography, Button } from "@mui/material";
import { signIn } from "next-auth/react";
import { Raleway } from "@next/font/google";
import GoogleIcon from "@/components/GoogleIcon";

const raleway = Raleway({ subsets: ["latin"], weight: "900" });

export default function SignIn() {
  return (
    <Paper
      elevation={4}
      sx={{ mt: "15rem", mx: "auto", maxWidth: "18rem", py: 1 }}
    >
      <Stack alignItems="center">
        <Button onClick={() => signIn("google", { callbackUrl: "/" })}>
          <GoogleIcon />
          <Typography
            className={raleway.className}
            fontSize={18}
            fontWeight={900}
            sx={{ ml: 1.5 }}
          >
            Sign in with Google
          </Typography>
        </Button>
      </Stack>
    </Paper>
  );
}
