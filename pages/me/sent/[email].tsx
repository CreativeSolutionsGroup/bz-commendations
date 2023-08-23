import { BottomBar } from "@/components/BottomBar";
import { prisma } from "@/lib/api/db";
import { Avatar, Box, Paper, Stack, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { Raleway } from "@next/font/google";
import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { readTeamSentCommendations, readUserSentCommendations } from "../../../lib/api/commendations";
import stinger from "../../../assets/stinger.png";
import { NotFound } from "@/components/NotFound";

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
  const userComms = await readUserSentCommendations(params?.email as string ?? "") ?? [];
  const teamComms = await readTeamSentCommendations(params?.email as string ?? "") ?? [];

  const comms = [...userComms, ...teamComms].sort((a, b) => a.createdAt.getMilliseconds() - b.createdAt.getMilliseconds());

  return {
    props: { comms: comms.map(({ createdAt, ...rest }) => ({ ...rest })) },
    revalidate: 60
  };
}

const raleway = Raleway({ subsets: ["latin"], weight: "900" });

export default function MyCommendations({ comms }: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter();

  if (router.isFallback) {
    return <h1>Loading...</h1>;
  }

  return (
    <>
      <main>
        <Box flexGrow={1} p={1}>
          <Typography className={raleway.className} fontSize={30} fontWeight={900} m={2} mb={1.25} align="center">Sent Commendations</Typography>
          {comms.length === 0
            ? <NotFound page={"sent"} />
            : <>{comms.map((comm, i) =>
              <Paper key={i} sx={{ mb: 2, mx: "auto", maxWidth: "44rem", p: 2, backgroundColor: grey[200], borderRadius: "18px" }}>
                <Box sx={{ display: "flex", flexDirection: "row" }} minHeight="6.5rem">
                  <Avatar>
                    <Image fill src={comm.recipient.imageURL ?? stinger.src} alt={comm.recipient.name} />
                  </Avatar>
                  <Stack ml={2}>
                    <Typography fontWeight="bold">{comm.recipient.name}</Typography>
                    <Typography fontSize="0.9rem" sx={{ wordWrap: "break-word", wordBreak: "break-all" }}>{comm.message}</Typography>
                  </Stack>
                </Box>
              </Paper>)}</>
          }
        </Box>
        <BottomBar page="/sent" />
      </main>
    </>
  );
}