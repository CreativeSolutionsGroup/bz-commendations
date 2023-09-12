import { CommendationStatInfo, MembersWithCommendations, TeamsList } from "@/types/admin";
import { Box, Typography } from "@mui/material";
import CommendationCountCard from "./CommendationCountCard";

export default function AdminLeaderboardView({ membersOrTeams }: { membersOrTeams: MembersWithCommendations | TeamsList}) {
  
  const sentInfo: CommendationStatInfo[] = [];
  const recvInfo: CommendationStatInfo[] = [];

  // If it has this parameter, then it's a member
  if("sendMembers" in membersOrTeams){
    //Set the send info
    membersOrTeams.sendMembers.forEach((member) => {
      sentInfo.push({
        id: member.id,
        name: member.name,
        imageURL: member.imageURL,
        numCommendations: member.sentCommendations.length
      });
    });

    //Set the recieve info
    membersOrTeams.recvMembers.forEach((member) => {
      recvInfo.push({
        id: member.id,
        name: member.name,
        imageURL: member.imageURL,
        numCommendations: member.commendations.length
      });
    });
  }
  //Else, it is a team
  else{
    membersOrTeams.forEach((team) =>{
      //Set the send info
      sentInfo.push({
        id: team.id,
        name: team.name,
        imageURL: team.imageURL,
        numCommendations: team.members.reduce((prev, curr) => prev + curr.sentCommendations.length, 0)
      });

      //Set the recieve info
      recvInfo.push({
        id: team.id,
        name: team.name,
        imageURL: team.imageURL,
        numCommendations: team.members.reduce((prev, curr) => prev + curr.commendations.length, 0)
      });
    });

    sentInfo.sort((a, b) =>  b.numCommendations - a.numCommendations);
    recvInfo.sort((a, b) =>  b.numCommendations - a.numCommendations);
  }
  
  return (
    <Box display={"flex"} flexWrap={"wrap"}>
      <Box display={"flex"} flexDirection={"column"} flexGrow={1}>
        <Typography fontWeight={700} textAlign={"center"} fontSize={18} mt={8}>Sent</Typography>
        {
          sentInfo.map((currentStats) => (
            <CommendationCountCard key={currentStats.id} stats={currentStats} />
          ))
        }
      </Box>
      <Box display={"flex"} flexDirection={"column"} flexGrow={1}>
        <Typography fontWeight={700} textAlign={"center"} fontSize={18} mt={8}>Received</Typography>
        {
          recvInfo.map((currentStats) => (
            <CommendationCountCard key={currentStats.id} stats={currentStats} />
          ))
        }
      </Box>
    </Box>
  );
}