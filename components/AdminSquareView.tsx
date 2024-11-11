import bz from "@/assets/BZ-letters.png";
import hash from "@/assets/bz-letters-hash.png";
import { TeamsList } from "@/types/admin";
import { Group, MoveToInbox, Send } from "@mui/icons-material";
import { Box, Card, Chip, Typography } from "@mui/material";
import { Raleway } from "next/font/google";
import Image from "next/image";
import { ReactElement } from "react";

const raleway = Raleway({ subsets: ["latin"], weight: "900" });

function DataChip({
  label,
  icon,
}: {
  label: string | null;
  icon: ReactElement;
}) {
  return (
    <Chip icon={icon} label={label} sx={{ padding: 0.3, flex: 1, mx: 1 }} />
  );
}

export default function AdminSquareView({ teams }: { teams: TeamsList }) {
  return (
    <Box display={"flex"} flexDirection={"row"} flexWrap={"wrap"} mb={2}>
      {teams?.map((currentTeam, currentIndex) => (
        <Card
          key={currentIndex}
          sx={{
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
            height: 350,
            flexGrow: 1,
            mt: 2,
            width: 300,
            mx: 1,
          }}
        >
          <Box
            position={"relative"}
            height={"60%"}
            width={"90%"}
            display="flex"
            justifyContent="center"
            mt={2}
          >
            <Image
              fill
              placeholder="blur"
              blurDataURL={hash.src}
              src={currentTeam.imageURL ?? bz.src}
              alt={currentTeam.name + " Logo"}
              style={{ objectFit: "contain" }}
            />
          </Box>
          <Typography
            textAlign={"center"}
            fontSize={20}
            mt={2}
            className={raleway.className}
          >
            {currentTeam.name}
          </Typography>
          <Box display={"flex"} mt={2}>
            <DataChip
              label={currentTeam.members.length.toString()}
              icon={<Group />}
            />
            <DataChip
              label={currentTeam.members
                .reduce((prev, curr) => prev + curr.sentCommendations.length, 0)
                .toString()}
              icon={<Send />}
            />
            <DataChip
              label={currentTeam.members
                .reduce((prev, curr) => prev + curr.commendations.length, 0)
                .toString()}
              icon={<MoveToInbox />}
            />
          </Box>
        </Card>
      ))}
    </Box>
  );
}
