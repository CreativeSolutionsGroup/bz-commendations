import { ArrowRight, Group, MoveToInbox, Send, Settings } from "@mui/icons-material";
import GridViewIcon from "@mui/icons-material/GridView";
import { Card, IconButton, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/system";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { useState } from "react";
import bz from "../assets/BZ-letters.png"
import solid from "../assets/BZ-letters-solid.png"
import { getLastMonthCommendations, getTeams, getThisMonthCommendations } from "../lib/api/teams";
import { authOptions } from "./api/auth/[...nextauth]";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  let session = await getServerSession(context.req, context.res, authOptions);
  if (!session?.isAdmin) {
    return {
      redirect: {
        permanent: false,
        destination: "/"
      }
    }
  }

  const teams = await getTeams();

  // Reduce all teams from an array of teams to an array of # of commendations sent PER team.
  const commendationsSent = teams.reduce((previous, current) => {
    previous.push(
      current.members.reduce((previousCommendationsCount, currentMember) => {
        return previousCommendationsCount + currentMember.sentCommendations.length;
      }, 0)
    )
    return previous;
  }, [] as number[])


  // Reduce all teams from an array of teams to an array of # of commendations received PER team.
  const commendationsReceived = teams.reduce((previousTeamCommendationCount, currentTeam) => {
    previousTeamCommendationCount.push(
      currentTeam.members.reduce((previousCommendationsCount, currentMember) => {
        return previousCommendationsCount + currentMember.commendations.length;
      }, 0)
    )
    return previousTeamCommendationCount;
  }, [] as number[])

  const lastMonthCommendations = await getLastMonthCommendations();
  const thisMonthCommendations = await getThisMonthCommendations();

  return { props: { teams, commendationsReceived, commendationsSent, lastMonthCommendations, thisMonthCommendations } };
}

export default function Admin({ teams, commendationsReceived, commendationsSent, lastMonthCommendations, thisMonthCommendations }: InferGetServerSidePropsType<typeof getServerSideProps>) {

  const [viewMode, setViewMode] = useState("square");
  const [sortMode, setSortMode] = useState("atoz");

  return (
    <>
      <main>
        <Box display={"flex"} flexDirection={"row"} sx={{ marginTop: 1 }}>
          <Typography flexGrow={1} textAlign={"center"} fontSize={24} fontWeight={"bold"} mt={1}>Admin Dashboard</Typography>
          <Select label="View" name="view" value={viewMode} onChange={(e: SelectChangeEvent) => setViewMode(e.target.value)}>
            <MenuItem key={1} value={"square"}>
              <Box display={"flex"} flexDirection={"row"}>
                <GridViewIcon></GridViewIcon>
                <Typography ml={1} fontWeight="bold">Square View</Typography>
              </Box>
            </MenuItem>
          </Select>
          <Select label="Sort By" name="sortBy" value={sortMode} onChange={(e: SelectChangeEvent) => setSortMode(e.target.value)} sx={{ marginLeft: 1 }}>
            <MenuItem key={"atoz"} value={"atoz"}>
              <Box display={"flex"} flexDirection={"row"}>
                <Typography>A</Typography>
                <ArrowRight></ArrowRight>
                <Typography>Z</Typography>
              </Box>
            </MenuItem>
            <MenuItem key={"ztoa"} value={"ztoa"}>
              <Box display={"flex"} flexDirection={"row"}>
                <Typography>Z</Typography>
                <ArrowRight></ArrowRight>
                <Typography>A</Typography>
              </Box>
            </MenuItem>
          </Select>
          <IconButton>
            <Settings sx={{ marginY: "auto", marginX: 2 }}></Settings>
          </IconButton>
        </Box>
        <Box display={"flex"} flexDirection={"row"} flexWrap={"wrap"} mb={10}>
          {
            teams.map((currentTeam, currentIndex) =>
              <Card sx={{ height: 320, flexGrow: 1, marginX: 4, marginTop: 3, width: 250 }}>
                <Box position={"relative"} height={"60%"} marginRight={2.5}>
                  <Image placeholder="blur" blurDataURL={solid.src} sizes="(max-width: 350px) 16vw" src={currentTeam.imageURL ?? bz.src} alt={currentTeam.name + " Logo"} style={{ objectFit: "contain", margin: 10 }} fill />
                </Box>
                <Typography textAlign={"center"} fontSize={20} mt={3}>{currentTeam.name}</Typography>
                <Box display={"flex"} mt={2}>
                  <Box flexGrow={1} />
                  <Box sx={{ borderRadius: 5, backgroundColor: "#005288", paddingY: 1, paddingX: 2, marginRight: 1, color: "white" }} display={"flex"}>
                    <Group />
                    <Typography ml={1} textAlign={"right"}>{currentTeam.members.length}</Typography>
                  </Box>
                  <Box sx={{ borderRadius: 5, backgroundColor: "#005288", paddingY: 1, paddingX: 2, color: "white" }} display={"flex"}>
                    <Send />
                    <Typography ml={1} textAlign={"right"}>{commendationsSent[currentIndex]}</Typography>
                  </Box>
                  <Box sx={{ borderRadius: 5, backgroundColor: "#005288", paddingY: 1, paddingX: 2, marginLeft: 1, color: "white" }} display={"flex"}>
                    <MoveToInbox />
                    <Typography ml={1} textAlign={"right"}>{commendationsReceived[currentIndex]}</Typography>
                  </Box>
                  <Box flexGrow={1}></Box>
                </Box>
              </Card>
            )
          }
        </Box>
        <Box sx={{ position: "fixed", bottom: 0, display: "flex" }}>
          <Card sx={{ marginLeft: 1, marginBottom: 1, fontSize: 20, padding: 1 }}>Commendations sent last month: {lastMonthCommendations}</Card>
          <Card sx={{ marginLeft: 1, marginBottom: 1, fontSize: 20, padding: 1 }}>Commendations sent this month: {thisMonthCommendations}</Card>
        </Box>
      </main>
    </>
  )
}