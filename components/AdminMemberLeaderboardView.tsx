import { CommendationStatInfo, MembersWithCommendations } from "@/types/admin";
import { Box, Typography } from "@mui/material";
import CommendationCountCard from "./CommendationCountCard";

export default function AdminMemberLeaderboardView({ members }: {members: MembersWithCommendations}) {
  
  // Order members by most to least commendations in each category
  members.sendMembers.sort((a, b) =>  b.sentCommendations.length - a.sentCommendations.length);
  members.recvMembers.sort((a, b) =>  b.commendations.length - a.commendations.length);
  
  return (
    <Box display={"flex"} flexWrap={"wrap"}>
      <Box display={"flex"} flexDirection={"column"} flexGrow={1}>
        <Typography fontWeight={700} textAlign={"center"} fontSize={18} mt={8}>Sent</Typography>
        {
          members.sendMembers.map((member) => (
            <CommendationCountCard key={member.id} id={member.id} name={member.name} imageURL={member.imageURL} numCommendations={member.sentCommendations.length}/>
          ))
        }
      </Box>
      <Box display={"flex"} flexDirection={"column"} flexGrow={1}>
        <Typography fontWeight={700} textAlign={"center"} fontSize={18} mt={8}>Received</Typography>
        {
          members.recvMembers.map((member) => (
            <CommendationCountCard key={member.id} id={member.id} name={member.name} imageURL={member.imageURL} numCommendations={member.commendations.length}/>
          ))
        }
      </Box>
    </Box>
  );
}