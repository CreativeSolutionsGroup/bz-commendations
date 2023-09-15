import { CommendationStatInfo, TeamsList } from "@/types/admin";
import { Box, Typography } from "@mui/material";
import CommendationCountCard from "./CommendationCountCard";

export default function AdminMemberLeaderboardView({ teams }: {teams: TeamsList}) {
  
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
        <Typography fontWeight={700} textAlign={"center"} fontSize={18} mt={8}>Sent</Typography>
        {
          sentInfo.map((teamStats) => (
            <CommendationCountCard key={teamStats.id} id={teamStats.id} name={teamStats.name} imageURL={teamStats.imageURL} numCommendations={teamStats.numCommendations}/>
          ))
        }
      </Box>
      <Box display={"flex"} flexDirection={"column"} flexGrow={1}>
        <Typography fontWeight={700} textAlign={"center"} fontSize={18} mt={8}>Received</Typography>
        {
          recvInfo.map((teamStats) => (
            <CommendationCountCard key={teamStats.id} id={teamStats.id} name={teamStats.name} imageURL={teamStats.imageURL} numCommendations={teamStats.numCommendations}/>
          ))
        }
      </Box>
    </Box>
  );
}