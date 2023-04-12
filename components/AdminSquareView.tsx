import { Group, MoveToInbox, Send } from "@mui/icons-material";
import { Box, Card, Chip, CircularProgress, Typography } from "@mui/material";
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

function DataChip({ label, icon }: { label: string | null, icon: ReactElement }) {
  return (
    <Chip icon={icon} label={label} sx={{ padding: 0.3, flex: 1, mx: 1 }} />
  );
};

function SquareView({ teams }: { teams: TeamsList }) {
  return (<Box display={"flex"} flexDirection={"row"} flexWrap={"wrap"} mb={10}>
    {
      teams?.map((currentTeam, currentIndex) =>
        <Card key={currentIndex} sx={{ alignItems: "center", display: "flex", flexDirection: "column", height: 350, flexGrow: 1, marginTop: 3, width: 300, mx: 1 }}>
          <Box position={"relative"} height={"60%"} width={"90%"} display="flex" justifyContent="center">
            <Image fill placeholder="blur" blurDataURL={hash.src} src={currentTeam.imageURL ?? bz.src} alt={currentTeam.name + " Logo"} style={{ objectFit: "contain" }} />
          </Box>
          <Typography textAlign={"center"} fontSize={20} mt={3}>{currentTeam.name}</Typography>
          <Box display={"flex"} mt={2}>
            <DataChip label={currentTeam.members.length.toString()} icon={<Group />} />
            <DataChip label={currentTeam.members.reduce((prev, curr) => prev + curr.sentCommendations.length, 0).toString()} icon={<Send />} />
            <DataChip label={currentTeam.members.reduce((prev, curr) => prev + curr.commendations.length, 0).toString()} icon={<MoveToInbox />} />
          </Box>
        </Card>)
    }
  </Box>);
}

export default SquareView;