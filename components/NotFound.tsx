import { Paper, Typography } from "@mui/material";
import { Raleway } from "@next/font/google";

const raleway = Raleway({ subsets: ["latin"], weight: "900" });

export function NotFound({ page }: { page: string }) {
  return (
    <Paper sx={{ mt: 4, mx: "auto", maxWidth: "30rem", p: 2 }}>
      <Typography color="primary" className={raleway.className} fontSize={25} fontWeight={900} align="center">
        You have {page} zero commendations.
      </Typography>
    </Paper>
  );
};