import { Group, MoveToInbox, Send } from "@mui/icons-material";
import { Box, Card, Typography } from "@mui/material";
import { Member, Team } from "@prisma/client";
import Image from "next/image";
import solid from "@/assets/BZ-letters-solid.png";
import bz from "@/assets/BZ-letters.png";


type TeamsList = (Team & {
  members: (Member & {
    commendations: {
      id: string;
    }[];
    sentCommendations: {
      id: string;
    }[];
  })[];
})[]

export default ({ teams, commendationsSent, commendationsReceived }: { teams: TeamsList, commendationsSent: number[], commendationsReceived: number[] }) => {
  return (<Box display={"flex"} flexDirection={"row"} flexWrap={"wrap"} mb={10}>
    {
      teams.map((currentTeam, currentIndex) =>
        <Card key={currentIndex} sx={{ height: 320, flexGrow: 1, marginX: 4, marginTop: 3, width: 250 }}>
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
  </Box>)
}