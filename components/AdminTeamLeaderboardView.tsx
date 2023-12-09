import { CommendationStatInfo, TeamsList } from "@/types/admin";
import { Box, Typography, useMediaQuery } from "@mui/material";
import CommendationCountCard from "./CommendationCountCard";
import theme from "@/config/theme";

export default function AdminMemberLeaderboardView({ teams }: {teams: TeamsList}) {
  const bigScreen = useMediaQuery(theme.breakpoints.up("sm"));
  
  const spacing = (bigScreen) ? 8 : 2;

  // Sum member commendations per team
  const sentInfo: CommendationStatInfo[] = teams.map(team => {
    return ({
      id: team.id,
      name: team.name,
      imageURL: team.imageURL,
      numCommendations: team.members.reduce((prev, curr) => prev + curr.sentCommendations.length, 0)
    });
  });
  const recvInfo: CommendationStatInfo[] = teams.map(team => {
    return ({
      id: team.id,
      name: team.name,
      imageURL: team.imageURL,
      numCommendations: team.members.reduce((prev, curr) => prev + curr.commendations.length, 0)
    });
  });

  // Order teams by most comms to least comms for each category
  sentInfo.sort((a, b) =>  b.numCommendations - a.numCommendations);
  recvInfo.sort((a, b) =>  b.numCommendations - a.numCommendations);
  
  return (
    <Box display={"flex"} flexWrap={"wrap"}>
      <Box display={"flex"} flexDirection={"column"} flexGrow={1}>
        <Typography fontWeight={700} textAlign={"center"} fontSize={18} mt={spacing}>Sent</Typography>
        {
          sentInfo.map((teamStats) => (
            <CommendationCountCard key={teamStats.id} id={teamStats.id} name={teamStats.name} imageURL={teamStats.imageURL} numCommendations={teamStats.numCommendations}/>
          ))
        }
      </Box>
      <Box display={"flex"} flexDirection={"column"} flexGrow={1}>
        <Typography fontWeight={700} textAlign={"center"} fontSize={18} mt={spacing}>Received</Typography>
        {
          recvInfo.map((teamStats) => (
            <CommendationCountCard key={teamStats.id} id={teamStats.id} name={teamStats.name} imageURL={teamStats.imageURL} numCommendations={teamStats.numCommendations}/>
          ))
        }
      </Box>
    </Box>
  );
}