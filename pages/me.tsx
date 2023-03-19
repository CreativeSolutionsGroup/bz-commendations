import { Avatar, Box, Paper, Stack, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { Raleway } from "@next/font/google";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getServerSession } from "next-auth";
import { readUserCommendations } from "../lib/api/commendations";
import { authOptions } from "./api/auth/[...nextauth]";
import Image from "next/image";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);
  const comms = await readUserCommendations(session!.user!.email!);
  return {
    props: { comms }
  }
}

const raleway = Raleway({ subsets: ["latin"], weight: "900" });

export default function MyCommendations({ comms }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <main>
        <Typography className={raleway.className} fontSize={30} fontWeight={900} mt={2} align="center" color={grey[500]}>YOUR COMMENDATIONS</Typography>
        {comms.map((comm, i) =>
          <Paper key={i} sx={{ mb: 2, mx: "auto", maxWidth: "44rem", p: 2, backgroundColor: grey[200], borderRadius: "18px" }}>
            <Box sx={{ display: "flex", flexDirection: "row" }} minHeight="6.5rem">
              <Avatar>
                <Image fill src={comm.sender.imageURL ?? "https://via.placeholder.com/25?text="} alt={comm.sender.name} />
              </Avatar>
              <Stack ml={2}>
                <Typography fontWeight="bold">{comm.sender.name}</Typography>
                <Typography fontSize="0.9rem" sx={{ wordWrap: "break-word", wordBreak: "break-all" }}>{comm.message}</Typography>
              </Stack>
            </Box>
          </Paper>
        )}
      </main>
    </>
  )
}