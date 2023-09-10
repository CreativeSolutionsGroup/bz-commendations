import { MembersWithCommendations, TeamsList } from "@/types/admin";
import { Box, Typography } from "@mui/material";
import CommendationCountCard from "./CommendationCountCard";

export default function AdminLeaderboardView({ membersOrTeams, isMembers }: { membersOrTeams: MembersWithCommendations | TeamsList, isMembers: boolean;}) {
  // TODO: better name
  const data = isMembers ? membersOrTeams as MembersWithCommendations : membersOrTeams as TeamsList;

  return (
    <Box display={"flex"} flexWrap={"wrap"}>
      <Box display={"flex"} flexDirection={"column"} flexGrow={1}>
        <Typography fontWeight={700} textAlign={"center"} fontSize={18} mt={8}>Sent</Typography>
        {
          data.sendMembers.map((currentPerson) => (
            <CommendationCountCard key={currentPerson.id} member={currentPerson} />
          ))
        }
      </Box>
      <Box display={"flex"} flexDirection={"column"} flexGrow={1}>
        <Typography fontWeight={700} textAlign={"center"} fontSize={18} mt={8}>Received</Typography>
        {
          membersOrTeams.recvMembers.map((currentPerson) => (
            <CommendationCountCard key={currentPerson.id} member={currentPerson} />
          ))
        }
      </Box>
    </Box>
  );
}