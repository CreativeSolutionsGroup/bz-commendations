import { ArrowRight, EmojiEvents, GridView, Settings } from "@mui/icons-material";
import { Card, IconButton, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/system";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { InferGetStaticPropsType,  } from "next";
import Head from "next/head";
import { useState } from "react";
import AdminLeaderboardView from "../components/AdminLeaderboardView";
import AdminSquareView from "../components/AdminSquareView";
import { getMembersWithReceivedCommendations, getMembersWithSentCommendations } from "../lib/api/members";
import { getLastMonthCommendations, getTeams, getThisMonthCommendations } from "../lib/api/teams";

export async function getStaticProps() {
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

  const sending = await getMembersWithSentCommendations();
  const receiving = await getMembersWithReceivedCommendations();

  return { props: { teams, sending, receiving, commendationsReceived, commendationsSent, lastMonthCommendations, thisMonthCommendations } };
}

export default function Admin({ teams, sending, receiving, commendationsReceived, commendationsSent, lastMonthCommendations, thisMonthCommendations }: InferGetStaticPropsType<typeof getStaticProps>) {
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
                <GridView />
                <Typography ml={1} fontWeight="bold">Square View</Typography>
              </Box>
            </MenuItem>
            <MenuItem key={2} value={"leaderboard"}>
              <Box display={"flex"} flexDirection={"row"}>
                <EmojiEvents />
                <Typography ml={1} fontWeight={700}>Leaderboard</Typography>
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
        {viewMode === "square" ?
          <AdminSquareView teams={teams} commendationsReceived={commendationsReceived} commendationsSent={commendationsSent} /> :
          <AdminLeaderboardView receivingUsers={receiving} sendingUsers={sending} />
        }
        <Box sx={{ position: "fixed", bottom: 0, display: "flex" }}>
          <Card sx={{ marginLeft: 1, marginBottom: 1, fontSize: 20, padding: 1 }}>Commendations sent last month: {lastMonthCommendations}</Card>
          <Card sx={{ marginLeft: 1, marginBottom: 1, fontSize: 20, padding: 1 }}>Commendations sent this month: {thisMonthCommendations}</Card>
        </Box>
      </main>
    </>
  )
}