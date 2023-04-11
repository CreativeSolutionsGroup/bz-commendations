import { Group, MoveToInbox, Send } from "@mui/icons-material";
import { Box, Card, Chip, Typography } from "@mui/material";
import { Member, Team } from "@prisma/client";
import Image from "next/image";
import hash from "@/assets/bz-letters-hash.png";
import bz from "@/assets/BZ-letters.png";
import { ReactElement } from "react";


type TeamsList = (Team & {
  members: (Member & {
    commendations: {
      id: string;
    }[];
    sentCommendations: {
      id: string;
    }[];
  })[];
})[];

const DataChip = ({ label, icon }: { label: string | null, icon: ReactElement }) => {
  return (
    <Chip icon={icon} label={label} sx={{ padding: 0.3, flex: 1, mx: 1 }} />
  );
};

export default function AdminSquareView({ teams, commendationsSent, commendationsReceived }: { teams: TeamsList, commendationsSent: number[], commendationsReceived: number[] }) {
  return (<Box display={"flex"} flexDirection={"row"} flexWrap={"wrap"} mb={10}>
    {
      teams.map((currentTeam, currentIndex) =>
        <Card key={currentIndex} sx={{ alignItems: "center", display: "flex", flexDirection: "column", height: 350, flexGrow: 1, marginTop: 3, width: 250, mx: 1 }}>
          <Box position={"relative"} height={"60%"} width={"90%"}>
            <Image placeholder="blur" blurDataURL={hash.src} sizes="(max-width: 250px) 100vw" src={currentTeam.imageURL ?? bz.src} alt={currentTeam.name + " Logo"} style={{ objectFit: "contain",  }} fill />
          </Box>
          <Typography textAlign={"center"} fontSize={20} mt={3}>{currentTeam.name}</Typography>
          <Box display={"flex"} mt={2}>
            <DataChip label={currentTeam.members.length.toString()} icon={<Group />} />
            <DataChip label={commendationsSent[currentIndex].toString()} icon={<Send />} />
            <DataChip label={commendationsReceived[currentIndex].toString()} icon={<MoveToInbox />} />
          </Box>
        </Card>)
    }
  </Box>);
};