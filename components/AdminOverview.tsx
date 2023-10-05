import {
  CommendationStatInfo,
  MembersWithCommendations,
  TeamsList,
} from "@/types/admin";
import { Send } from "@mui/icons-material";
import { Card, Chip, Typography } from "@mui/material";
import { Box } from "@mui/system";
import bz from "@/assets/BZ-letters.png";
import hash from "@/assets/bz-letters-hash.png";
import Image from "next/image";
import { ReactElement } from "react";
import { Raleway, Cabin_Sketch } from "@next/font/google";

const raleway = Raleway({ subsets: ["latin"], weight: "900" });
const cabin = Cabin_Sketch({weight: "700"});

function DataChip({ label, icon }: { label: string | null, icon: ReactElement }) {
  return (
    <Chip icon={icon} label={label} sx={{ padding: 0.3, flex: 1, mx: 1 }} />
  );
};

export default function AdminOverview({ members, teams }: { members: MembersWithCommendations, teams: TeamsList }) {

  // Sum member commendations per team
  const sentInfo: CommendationStatInfo[] = teams.map(team => {
    return ({
      id: team.id,
      name: team.name,
      imageURL: team.imageURL,
      numCommendations: team.members.reduce((prev, curr) => prev + curr.sentCommendations.length, 0)
    });
  });

  // Order teams by most comms to least comms
  sentInfo.sort((a, b) => b.numCommendations - a.numCommendations);

  // Order members by most to least commendations in each category
  members.sendMembers.sort((a, b) => b.sentCommendations.length - a.sentCommendations.length);

  const topTeam = sentInfo[0];
  const topMember = members.sendMembers[0];

  return (
    <Box display="flex" flexDirection="row">
      <Box display="flex" flexDirection="column" >
        <Card sx={{ alignItems: "center", display: "flex", flexDirection: "column", height: 250, flexGrow: 1, marginTop: 3, width: 400, mx: 1 }}>
          <Box position={"relative"} height={"60%"} width={"90%"} display="flex" justifyContent="center" mt={2}>
            <Image fill placeholder="blur" blurDataURL={hash.src} src={topTeam.imageURL ?? bz.src} alt={topTeam.name + " Logo"} style={{ objectFit: "contain" }} />
          </Box>
          <Box display={"flex"} mt={2} flexDirection="row">
            <Typography textAlign={"center"} fontSize={20} className={raleway.className}>{topTeam.name}</Typography>
            <DataChip label={topTeam.numCommendations.toString()} icon={<Send />} />
          </Box>
        </Card>

        <Card sx={{ alignItems: "center", display: "flex", flexDirection: "column", height: 250, flexGrow: 1, marginTop: 3, width: 400, mx: 1 }}>
          <Box position={"relative"} height={"60%"} width={"90%"} display="flex" justifyContent="center" mt={2}>
            <Image fill placeholder="blur" blurDataURL={hash.src} src={topMember.imageURL ?? bz.src} alt={topMember.name + " image"} style={{ objectFit: "contain" }} />
          </Box>
          <Box display={"flex"} mt={2} flexDirection="row">
            <Typography textAlign={"center"} fontSize={20} className={raleway.className}>{topMember.name}</Typography>
            <DataChip label={topMember.sentCommendations.length.toString()} icon={<Send />} />
          </Box>
        </Card>
      </Box>

      <Card sx={{ justifyContent: "center", alignItems: "center", display: "flex", height: 525, flexGrow: 1, marginTop: 3, mx: 1, backgroundImage: "radial-gradient(ellipse closest-side, #4b85ab, white)"  }}>
        <Box display={"flex"} flexDirection={"column"}>
          <Typography textAlign={"center"} fontSize={50} className={raleway.className}>Total Commendation Count:</Typography>
          <Typography textAlign={"center"} fontSize={150} className={cabin.className}>
            {members.sendMembers.reduce((prev, curr) => prev + curr.sentCommendations.length, 0)}
          </Typography>
        </Box>
      </Card>
    </Box>
  );
}
