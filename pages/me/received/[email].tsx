import { BottomBar } from "@/components/BottomBar";
import { prisma } from "@/lib/api/db";
import { Avatar, Box, Paper, Stack, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { Raleway } from "@next/font/google";
import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { readUserCommendations } from "../../../lib/api/commendations";
import stinger from "../../../assets/stinger.png";
import { useState } from "react";

export async function getStaticPaths() {
  const users = await prisma.member.findMany();

  return {
    paths: users.map(u => ({
      params: {
        email: u.email
      }
    })),
    fallback: true
  };
}

export async function getStaticProps({ params }: GetStaticPropsContext) {
  if (!params) throw new Error("No path parameters found");
  const comms = await readUserCommendations(params?.email as string ?? "");

  if (!comms) return { notFound: true, revalidate: 10 };

  // Sort commendations by most recent creation date
  comms?.sort((comm1, comm2) => {
    return comm2.createdAt.getTime() - comm1.createdAt.getTime();
  });

  // Clean up error caused by "createdAt" property
  // https://stackoverflow.com/a/72837265
  const uncleanComms: typeof comms = JSON.parse(JSON.stringify(comms));

  return {
    props: { uncleanComms },
    revalidate: 60
  };
}

const raleway = Raleway({ subsets: ["latin"], weight: "900" });

export default function MyCommendations({ uncleanComms }: InferGetStaticPropsType<typeof getStaticProps>) {
  // Cleanse the lepers
  const [comms, updateComms] = useState<typeof uncleanComms>(uncleanComms.map((comm) => {
    comm.createdAt = new Date(comm.createdAt);
    return comm;
  }));
  
  const router = useRouter();

  if (router.isFallback) {
    return <h1>Loading...</h1>;
  }

  return (
    <>
      <main>
        <Box flexGrow={1} p={1}>
          <Typography className={raleway.className} fontSize={30} fontWeight={900} mt={2} mb={1.25} align="center">Received Commendations</Typography>
          {comms.map((comm, i) =>
            <Paper key={i} sx={{ mb: 2, mx: "auto", maxWidth: "44rem", p: 2, backgroundColor: grey[200], borderRadius: "18px" }}>
              <Box sx={{ display: "flex", flexDirection: "row" }} minHeight="6.5rem">
                <Avatar>
                  <Image fill src={comm.sender.imageURL ?? stinger.src} alt={comm.sender.name} />
                </Avatar>
                <Stack ml={2}>
                  <Typography fontWeight="bold">{comm.sender.name}</Typography>
                  <Typography fontSize="0.9rem" sx={{ wordWrap: "break-word", wordBreak: "break-all" }}>{comm.message}</Typography>
                  <Typography fontSize="0.9rem" sx={{ wordWrap: "break-word", wordBreak: "break-all" }}>
                    {comm.createdAt.getMonth() + 1}{"/"}
                    {comm.createdAt.getDate()}{"/"}
                    {comm.createdAt.getFullYear()}
                  </Typography>
                </Stack>
              </Box>
            </Paper>)}
        </Box>
        <BottomBar page="/received" />
      </main>
    </>
  );
}