import { TeamsList } from "@/types/admin";
import { ArrowCircleRight, ArrowRight, EmojiEvents, GridView, Group } from "@mui/icons-material";
import { Avatar, Box, MenuItem, Paper, Select, SelectChangeEvent, Stack, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { CommendationWithPeople, MemberWithTeams } from "@/types/commendation";
import { Commendation, Team } from "@prisma/client";
import Image from "next/image"
import { grey } from "@mui/material/colors";
import stinger from "@/assets/stinger.png";
import { ConfigurationSetAlreadyExistsException } from "@aws-sdk/client-ses";

export default function AdminTeamView({ teams }: { teams: TeamsList }) {
  const { data } = useSession();
  const user = data?.user;
  const [teamSelected, setTeamSelected] = useState("");
  const [exec, setExec] = useState<MemberWithTeams>({} as MemberWithTeams);
  const [commsSent, setCommsSent] = useState<Array<CommendationWithPeople>>();
  const [commsRecv, setCommsRecv] = useState<Array<CommendationWithPeople>>();


  useEffect(() => {
    fetch(`/api/user/teams?email=${user?.email}`).then(res => res.json().then(j => setExec(j)));
  }, [user?.email]);

  useEffect(() => {
    if (teamSelected) {
      fetch(`/api/teams?id=${teamSelected}`).then(res => res.json().then(j => { setCommsSent(j.sentComms); setCommsRecv(j.recvComms); console.log(j); }));
    }
  }, [teamSelected]);

  return (
    <Box>
      <Box marginX={2} display={"flex"}>
        <Box flexGrow={1} />
        <Select
          label="Team"
          name="team"
          value={teamSelected}
          onChange={(e: SelectChangeEvent) => setTeamSelected(e.target.value)}
          sx={{ minWidth: "200px", marginTop: 1 }}
        >
          {
            exec.teams?.map((currentTeam: Team, index: number) => (
              <MenuItem key={index} value={currentTeam.id}>
                <Box display={"flex"}>
                  <Avatar sx={{ backgroundColor: "#0000" }}>
                    <Image src={currentTeam.imageURL ?? "https://via.placeholder.com/25?text="} alt={"Team image"} fill style={{ objectFit: "contain" }} />
                  </Avatar>
                  <Typography marginY={"auto"} fontWeight={700} marginLeft={2}>{currentTeam.name}</Typography>
                </Box>
              </MenuItem>
            ))
          }
        </Select>
      </Box>
      <Box display={"flex"}>
        <Box flexGrow={1}>
          <Typography textAlign={"center"} variant="h5" marginBottom={2}>Sent</Typography>
          {commsSent?.map((comm, index: number) =>
            <Paper key={index} sx={{ mb: 2, mx: "auto", maxWidth: "44rem", p: 2, backgroundColor: grey[200], borderRadius: "18px" }}>
              <Box sx={{ display: "flex", flexDirection: "row" }} minHeight="6.5rem">
                <Avatar>
                  <Image fill src={comm.sender.imageURL ?? stinger.src} alt={comm.sender.name} />
                </Avatar>
                <Stack ml={2}>
                  <Box display={"flex"}>
                    <Typography fontWeight={"bold"}>{comm.sender.name}</Typography>
                    <ArrowCircleRight sx={{ marginLeft: 1 }} />
                    <Typography fontWeight="bold" marginLeft={1}>{comm.recipient.name}</Typography>
                  </Box>
                  <Typography fontSize="0.9rem" sx={{ wordWrap: "break-word", wordBreak: "break-all" }}>{comm.message}</Typography>
                </Stack>
              </Box>
            </Paper>)}
        </Box>
        <Box flexGrow={1}>
          <Typography textAlign={"center"} variant="h5" marginBottom={2}>Received</Typography>
          {commsRecv?.map((comm, index: number) =>
            <Paper key={index} sx={{ mb: 2, mx: "auto", maxWidth: "44rem", p: 2, backgroundColor: grey[200], borderRadius: "18px" }}>
              <Box sx={{ display: "flex", flexDirection: "row" }} minHeight="6.5rem">
                <Avatar>
                  <Image fill src={comm.recipient.imageURL ?? stinger.src} alt={comm.recipient.name} />
                </Avatar>
                <Stack ml={2}>
                  <Box display={"flex"}>
                    <Typography fontWeight={"bold"}>{comm.sender.name}</Typography>
                    <ArrowCircleRight sx={{ marginLeft: 1 }} />
                    <Typography fontWeight="bold" marginLeft={1}>{comm.recipient.name}</Typography>
                  </Box>
                  <Typography fontSize="0.9rem" sx={{ wordWrap: "break-word", wordBreak: "break-all" }}>{comm.message}</Typography>
                </Stack>
              </Box>
            </Paper>)}
        </Box>
      </Box>
    </Box>
  )
}