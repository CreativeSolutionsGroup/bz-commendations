import { Avatar, Box, Paper, Stack, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { Raleway } from "@next/font/google";
import { GetStaticPropsContext } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { readUserCommendations } from "../../lib/api/commendations";
import { prisma } from "../../lib/api/db";

export async function getStaticPaths() {
  const users = await prisma.member.findMany();

  return {
    paths: users.map(u => ({
      params: {
        email: u.email
      }
    })),
    fallback: true
  }
}

export async function getStaticProps({ params }: GetStaticPropsContext) {
  if (!params) throw new Error("No path parameters found");
  const comms = await readUserCommendations(params?.email as string ?? "");

  if (!comms) return { notFound: true, revalidate: 10 };

  return {
    props: { comms },
    revalidate: 3600
  }
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