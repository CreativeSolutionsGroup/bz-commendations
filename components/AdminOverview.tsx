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


/*function DataChip({ label, icon }: { label: string | null, icon: ReactElement }) {
    return (
      <Chip icon={icon} label={label} sx={{ padding: 0.3, flex: 1, mx: 1 }} />
    );
  };*/

export default function AdminOverview({ members, teams }: { members: MembersWithCommendations, teams: TeamsList }) {

    //console.log(members.sendMembers[0]);
    //console.log(teams[0]);
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
    <></>
    /*<Box display="flex" flexDirection="row" >
        

        
        <Box display="flex" flexDirection="column" >
            <Card sx={{ alignItems: "center", display: "flex", flexDirection: "column", height: 300, flexGrow: 1, marginTop: 3, width: 300, mx: 1 }}>
                <Box position={"relative"} height={"60%"} width={"90%"} display="flex" justifyContent="center">
                    <Image fill placeholder="blur" blurDataURL={hash.src} src={topTeam.imageURL ?? bz.src} alt={topTeam.name + " Logo"} style={{ objectFit: "contain" }} />
                </Box>
                <Typography textAlign={"center"} fontSize={20} mt={3}>{topTeam.name}</Typography>
                <Box display={"flex"} mt={2}>
                    <DataChip label={topTeam.numCommendations.toString()} icon={<Send />} />
                </Box>
            </Card>
        </Box>
    </Box>*/
  );
}
