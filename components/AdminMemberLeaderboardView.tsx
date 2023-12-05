import { CommendationStatInfo, MembersWithCommendations } from "@/types/admin";
import { Box, Typography,useMediaQuery } from "@mui/material";
import CommendationCountCard from "./CommendationCountCard";
import theme from "@/config/theme";

export default function AdminMemberLeaderboardView({ members }: {members: MembersWithCommendations}) {
  const bigScreen = useMediaQuery(theme.breakpoints.up("sm"));
  
  const spacing = (bigScreen) ? 8 : 2;
  
  // Order members by most to least commendations in each category
  members.sendMembers.sort((a, b) =>  b.sentCommendations.length - a.sentCommendations.length);
  members.recvMembers.sort((a, b) =>  b.commendations.length - a.commendations.length);
  
  return (
    <Box display={"flex"} flexWrap={"wrap"}>
      <Box display={"flex"} flexDirection={"column"} flexGrow={1}>
        <Typography fontWeight={700} textAlign={"center"} fontSize={18} mt={spacing}>Sent</Typography>
        {
          members.sendMembers.map((member) => (
            <CommendationCountCard key={member.id} id={member.id} name={member.name} imageURL={member.imageURL} numCommendations={member.sentCommendations.length}/>
          ))
        }
      </Box>
      <Box display={"flex"} flexDirection={"column"} flexGrow={1}>
        <Typography fontWeight={700} textAlign={"center"} fontSize={18} mt={spacing}>Received</Typography>
        {
          members.recvMembers.map((member) => (
            <CommendationCountCard key={member.id} id={member.id} name={member.name} imageURL={member.imageURL} numCommendations={member.commendations.length}/>
          ))
        }
      </Box>
    </Box>
  );
}