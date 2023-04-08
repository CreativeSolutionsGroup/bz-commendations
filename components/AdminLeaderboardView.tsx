import { Box, Paper, Typography } from "@mui/material"
import { Member } from "@prisma/client"
import Image from "next/image"

export type MemberWithCommendations = {
  sendMembers: (Member & {
    sentCommendations: {
      id: string;
    }[];
  })[];
  recvMembers: (Member & {
    commendations: {
      id: string;
    }[];
  })[];
}

export default ({ members }: { members: MemberWithCommendations }) => {
  return (
    <Box display={"flex"} flexWrap={"wrap"}>
      <Box display={"flex"} flexDirection={"column"} flexGrow={1}>
        <Typography fontWeight={700} textAlign={"center"}>Sent</Typography>
        {
          members.sendMembers.map((currentPerson) => (
            <Paper key={currentPerson.id} sx={{ margin: 1, padding: 1, display: "flex" }} >
              <Image src={currentPerson.imageURL ?? "https://via.placeholder.com/50?text="} alt={"User image"} width={50} height={50} style={{ borderRadius: "100%" }}></Image>
              <Typography ml={2} my={"auto"} fontSize={20} fontWeight={700} flexGrow={1}>{currentPerson.name}</Typography>
              <Box my={"auto"} mr={2} textAlign={"center"} sx={{ backgroundColor: "#005288", borderRadius: "100%" }} color={"white"} height={35} width={35} display={"flex"} flexDirection={"column"}>
                <Typography my={"auto"}>{currentPerson.sentCommendations.length}</Typography>
              </Box>
            </Paper>
          ))
        }
      </Box>
      <Box display={"flex"} flexDirection={"column"} flexGrow={1}>
        <Typography fontWeight={700} textAlign={"center"}>Received</Typography>
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
  )
}