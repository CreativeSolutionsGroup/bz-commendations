import {
  CommendationStatInfo,
  MembersWithCommendations,
  TeamsList,
} from "@/types/admin";
import { Send, MoveToInbox } from "@mui/icons-material";
import { Card, Chip, Typography, Tooltip, useMediaQuery } from "@mui/material";
import { Box } from "@mui/system";
import bz from "@/assets/BZ-letters.png";
import hash from "@/assets/bz-letters-hash.png";
import Image from "next/image";
import { ReactElement } from "react";
import { Raleway, Rubik } from "@next/font/google";
import { useTheme } from "@mui/material/styles";

const raleway = Raleway({ subsets: ["latin"], weight: "900" });
const rubik = Rubik({ subsets: ["latin"], weight: "600"});

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

  const recvInfo: CommendationStatInfo[] = teams.map(team => {
    return ({
      id: team.id,
      name: team.name,
      imageURL: team.imageURL,
      numCommendations: team.members.reduce((prev, curr) => prev + curr.commendations.length, 0)
    });
  });

  // Order teams by most comms to least comms
  sentInfo.sort((a, b) => b.numCommendations - a.numCommendations);
  recvInfo.sort((a, b) => b.numCommendations - a.numCommendations);

  // Order members by most to least commendations in each category
  members.sendMembers.sort((a, b) => b.sentCommendations.length - a.sentCommendations.length);
  members.recvMembers.sort((a, b) => b.commendations.length - a.commendations.length);

  const topTeam = sentInfo[0];
  const topMember = members.sendMembers[0];
  const topTeamRecv = recvInfo[0];
  const topMemberRecv = members.recvMembers[0];

  const theme = useTheme();
  const largeScreen = useMediaQuery(theme.breakpoints.up("lg"));
  const mediumScreen = useMediaQuery(theme.breakpoints.up("md"));

  const totalComms = members.sendMembers.reduce((prev, curr) => prev + curr.sentCommendations.length, 0);

  const topSendingMember = () => {
    return (
      <Tooltip title="Top Sending Member" placement="top">
        <Card sx={{ alignItems: "center", display: "flex", flexDirection: "column", height: 250, flexGrow: 1, mt: 2, mx: 1 }}>
          <Box position={"relative"} height={"60%"} width={"90%"} display="flex" justifyContent="center" mt={2}>
            <Image fill placeholder="blur" blurDataURL={hash.src} src={topMember.imageURL ?? bz.src} alt={topMember.name + " image"} style={{ objectFit: "contain" }} />
          </Box>
          <Box display={"flex"} flexDirection="row" mt={2}>
            <Typography textAlign={"center"} fontSize={20} className={raleway.className}>{topMember.name}</Typography>
            <DataChip label={topMember.sentCommendations.length.toString()} icon={<Send />} />
          </Box>
        </Card>
      </Tooltip>
    );
  };

  const topReceivingMember = () => {
    return(
      <Tooltip title="Top Receiving Member" placement="top">
        <Card sx={{ alignItems: "center", display: "flex", flexDirection: "column", height: 250, flexGrow: 1, mt: 2, mx: 1 }}>
          <Box position={"relative"} height={"60%"} width={"90%"} display="flex" justifyContent="center" mt={2}>
            <Image fill placeholder="blur" blurDataURL={hash.src} src={topMemberRecv.imageURL ?? bz.src} alt={topMemberRecv.name + " image"} style={{ objectFit: "contain" }} />
          </Box>
          <Box display={"flex"} flexDirection="row" mt={2}>
            <Typography textAlign={"center"} fontSize={20} className={raleway.className}>{topMemberRecv.name}</Typography>
            <DataChip label={topMemberRecv.commendations.length.toString()} icon={<MoveToInbox />} />
          </Box>
        </Card>
      </Tooltip>
    );
  };
  const topSendingTeam = () => {
    return(
      <Tooltip title="Top Sending Team"placement="top">
        <Card sx={{ alignItems: "center", display: "flex", flexDirection: "column", height: 250, flexGrow: 1, mt: 2, mx: 1 }}>
          <Box position={"relative"} height={"60%"} width={"90%"} display="flex" justifyContent="center" mt={2}>
            <Image fill placeholder="blur" blurDataURL={hash.src} src={topTeam.imageURL ?? bz.src} alt={topTeam.name + " image"} style={{ objectFit: "contain" }} />
          </Box>
          <Box display={"flex"} flexDirection="row" mt={2}>
            <Typography textAlign={"center"} fontSize={20} className={raleway.className}>{topTeam.name}</Typography>
            <DataChip label={topTeam.numCommendations.toString()} icon={<Send />} />
          </Box>
        </Card>
      </Tooltip>
    );
  };
  const topReceivingTeam = () => {
    return(
      <Tooltip title="Top Receiving Team" placement="top">
        <Card sx={{ alignItems: "center", display: "flex", flexDirection: "column", height: 250, flexGrow: 1, mt: 2, mx: 1 }}>
          <Box position={"relative"} height={"60%"} width={"90%"} display="flex" justifyContent="center" mt={2}>
            <Image fill placeholder="blur" blurDataURL={hash.src} src={topTeamRecv.imageURL ?? bz.src} alt={topTeamRecv.name + " image"} style={{ objectFit: "contain" }} />
          </Box>
          <Box display={"flex"} flexDirection="row" mt={2}>
            <Typography textAlign={"center"} fontSize={20} className={raleway.className}>{topTeamRecv.name}</Typography>
            <DataChip label={topTeamRecv.numCommendations.toString()} icon={<MoveToInbox />} />
          </Box>
        </Card>
      </Tooltip>
    );
  };
  
  return (
    <>
      {largeScreen ?
        (<Box display="flex" flexDirection="row">
          <Box display="flex" flexDirection="column" width={"30%"} minWidth={225}>
            {topSendingMember()}
            {topReceivingMember()}
          </Box>

          <Card sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", width: "40%", mt: 2, mx: 1, minWidth: 350 }}>
            <Typography textAlign={"center"} fontSize={40} className={raleway.className}>Total<br/>Commendations</Typography>
            <Typography textAlign={"center"} fontSize={150} className={raleway.className}>
              {totalComms}
            </Typography>
          </Card>

          <Box display="flex" flexDirection="column" width={"30%"} minWidth={"15"}>
            {topSendingTeam()}
            {topReceivingTeam()}
          </Box>
        </Box>) : mediumScreen ? (
          (<Box display="flex" flexDirection="column" alignItems={"center"}>
            <Box display="flex" flexDirection="row" width={"100%"} minWidth={225} >
              {topSendingMember()}
              {topReceivingMember()}
            </Box>

            <Box display="flex" flexDirection="row" width={"100%"} minWidth={225} alignItems={"center"} justifyContent={"center"}>
              <Card sx={{ display: "flex", flexDirection: "row", justifyContent: "space-evenly", alignItems: "center", width: "100%", height: "200px", mt: 2, mx: 1, minWidth: 350 }}>
                <Typography textAlign={"center"} fontSize={40} className={raleway.className}>Total<br/>Commendations</Typography>
                <Typography textAlign={"center"} fontSize={120} lineHeight={"80%"} pb={4} className={raleway.className}>
                  {totalComms}
                </Typography>
              </Card>
            </Box>

            <Box display="flex" flexDirection="row" width={"100%"} minWidth={"15"}>
              {topSendingTeam()}
              {topReceivingTeam()}
            </Box>
          </Box>)
        ) : (
          <Box display="flex" flexDirection="column" alignItems={"center"}>
            <Box display="flex" flexDirection="column" width={"90%"} minWidth={"30%"}>
              <Card sx={{ maxHeight: "50%", display: "flex", flexDirection: "column", justifyContent: "center", height: 325, flexGrow: 1,  mt: 2, mx: 1}}>
                <Typography textAlign={"center"} fontSize={40} className={raleway.className}>Total<br/>Commendations</Typography>
                <Typography textAlign={"center"} fontSize={150} lineHeight={"100%"} className={raleway.className}>
                  {totalComms}
                </Typography>
              </Card>
            </Box>
            <Box display="flex" flexDirection="column" width={"90%"} minWidth={"30%"}>
              {topSendingTeam()}
              {topSendingMember()}
            </Box>
            <Box display="flex" flexDirection="column"  width={"90%"} minWidth={"30%"}>
              {topReceivingMember()}
              {topReceivingTeam()}
            </Box>
          </Box>
        )
      }
    </>
  );
}
