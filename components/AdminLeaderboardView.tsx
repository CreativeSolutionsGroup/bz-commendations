import { MembersWithCommendations } from "@/types/admin";
import { Box, Paper, Typography } from "@mui/material";
import Image from "next/image";

export default function AdminLeaderboardView({ members }: { members: MembersWithCommendations }) {
  return (
    <Box display={"flex"} flexWrap={"wrap"}>
      <Box display={"flex"} flexDirection={"column"} flexGrow={1}>
        <Typography fontWeight={700} textAlign={"center"} fontSize={18} mt={6}>Sent</Typography>
        {
          members.sendMembers.map((currentPerson) => (
            <Paper key={currentPerson.id} sx={{ margin: 1, padding: 1, display: "flex" }} >
              <Image src={currentPerson.imageURL ?? "https://via.placeholder.com/50?text="} alt={"User image"} width={50} height={50} style={{ borderRadius: "100%" }} />
              <Typography ml={2} my={"auto"} fontSize={20} fontWeight={700} flexGrow={1}>{currentPerson.name}</Typography>
              <Box my={"auto"} mr={2} textAlign={"center"} sx={{ backgroundColor: "#005288", borderRadius: "100%" }} color={"white"} height={35} width={35} display={"flex"} flexDirection={"column"}>
                <Typography my={"auto"}>{currentPerson.sentCommendations.length}</Typography>
              </Box>
            </Paper>
          ))
        }
      </Box>
      <Box display={"flex"} flexDirection={"column"} flexGrow={1}>
        <Typography fontWeight={700} textAlign={"center"} fontSize={18} mt={6}>Received</Typography>
        {
          members.recvMembers.map((currentPerson) => (
            <Paper key={currentPerson.id} sx={{ margin: 1, padding: 1, display: "flex" }} >
              <Image src={currentPerson.imageURL ?? "https://via.placeholder.com/50?text="} alt={"User image"} width={50} height={50} style={{ borderRadius: "100%" }}></Image>
              <Typography ml={2} my={"auto"} fontSize={20} fontWeight={700} flexGrow={1}>{currentPerson.name}</Typography>
              <Box my={"auto"} mr={2} textAlign={"center"} sx={{ backgroundColor: "#005288", borderRadius: "100%" }} color={"white"} height={35} width={35} display={"flex"} flexDirection={"column"}>
                <Typography my={"auto"}>{currentPerson.commendations.length}</Typography>
              </Box>
            </Paper>
          ))
        }
      </Box>
    </Box>
  );
}