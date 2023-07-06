import bz from "@/assets/BZ-letters.png";
import hash from "@/assets/bz-letters-hash.png";
import { TeamsList } from "@/types/admin";
import { Group, MoveToInbox, Send } from "@mui/icons-material";
import { Box, Card, Chip, Skeleton, Typography } from "@mui/material";
import Image from "next/image";
import { ReactElement, ReactNode } from "react";

function DataChip({ label, icon }: { label: ReactNode | null, icon: ReactElement }) {
  return (
    <Chip icon={icon} label={label} sx={{ padding: 0.3, flex: 1, mx: 1 }} />
  );
};

function LoadingState() {
  return (
    <Card sx={{ alignItems: "center", display: "flex", flexDirection: "column", height: 350, flexGrow: 1, marginTop: 3, width: 300, mx: 1 }}>
      <Box position={"relative"} height={"60%"} width={"90%"} display="flex" justifyContent="center" paddingTop={3}>
        <Skeleton variant="rounded" width={"100%"} height={"100%"} />
      </Box>
      <Skeleton variant="text" width={"50%"} sx={{ fontSize: "20px" }} />
      <Box display={"flex"} mt={2}>
        <DataChip icon={<Group />} label={<Skeleton variant="text" width={15} sx={{ fontSize: "1.5rem" }} />} />
        <DataChip icon={<Send />} label={<Skeleton variant="text" width={15} sx={{ fontSize: "1.5rem" }} />} />
        <DataChip icon={<MoveToInbox />} label={<Skeleton variant="text" width={15} sx={{ fontSize: "1.5rem" }} />} />
      </Box>
    </Card>
  );
};

export default function AdminSquareView({ teams }: { teams: TeamsList }) {

  return (<Box display={"flex"} flexDirection={"row"} flexWrap={"wrap"} mb={10}>
    {
      !teams || teams.length === 0 ?
        (Array(12).fill(0)).map((v, i) => <LoadingState key={i} />) :
        teams?.map((currentTeam, currentIndex) =>
          <Card key={currentIndex} sx={{ alignItems: "center", display: "flex", flexDirection: "column", height: 350, flexGrow: 1, marginTop: 3, width: 300, mx: 1 }}>
            <Box position={"relative"} height={"60%"} width={"90%"} display="flex" justifyContent="center">
              <Image
                fill
                placeholder="blur"
                blurDataURL={hash.src}
                src={currentTeam.imageURL ?? bz.src}
                alt={currentTeam.name + " Logo"}
                style={{ objectFit: "contain" }}
                sizes="(max-width: 3800px) 9vw, 
                       (max-width: 3495px) 10vw,
                       (max-width: 3175px) 11vw,
                       (max-width: 2860px) 13vw,
                       (max-width: 2545px) 14vw,
                       (max-width: 2230px) 17vw,
                       (max-width: 1910px) 20vw,
                       (max-width: 1595px) 25vw,
                       (max-width: 1280px) 33vw,
                       (max-width: 965px) 50vw,
                       (max-width: 650px) 100vw"
              />
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