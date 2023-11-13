import stinger from "@/assets/stinger.png";
import { CommendationWithPeople, MemberWithTeams } from "@/types/commendation";
import { ArrowCircleRight, Send } from "@mui/icons-material";
import { Avatar, Box, FormControl, InputLabel, MenuItem, Paper, Select, SelectChangeEvent, Stack, Typography, useMediaQuery } from "@mui/material";
import { grey } from "@mui/material/colors";
import { useTheme } from "@mui/material/styles";
import { Team } from "@prisma/client";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { SendIcon, Newspaper } from "@mui/icons-material";


const sentCommendations = (commsSent: Array<CommendationWithPeople>) => (
  <Box flexGrow={1} px={1}>
    <Typography fontWeight={700} textAlign={"center"} fontSize={18} mb={1}>
      Sent
    </Typography>
    {commsSent?.map((comm, index: number) => (
      <Paper
        key={index}
        sx={{
          mb: 2,
          mx: "auto",
          maxWidth: "44rem",
          p: 2,
          backgroundColor: grey[200],
          borderRadius: "18px",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "row" }} minHeight="6.5rem">
          <Avatar>
            <Image
              fill
              src={comm.sender.imageURL ?? stinger.src}
              alt={comm.sender.name}
            />
          </Avatar>
          <Stack ml={2}>
            <Box display={"flex"}>
              <Typography fontWeight={"bold"}>{comm.sender.name}</Typography>
              <ArrowCircleRight sx={{ ml: 1 }} />
              <Typography fontWeight="bold" ml={1}>
                {comm.recipient.name}
              </Typography>
            </Box>
            <Typography
              fontSize="0.9rem"
              sx={{ wordWrap: "normal", wordBreak: "break-word" }}
            >
              {comm.message}
            </Typography>
          </Stack>
        </Box>
      </Paper>
    ))}
  </Box>
);

const recvCommendations = (commsRecv: Array<CommendationWithPeople>) => (
  <Box flexGrow={1} px={1}>
    <Typography fontWeight={700} textAlign={"center"} fontSize={18} mb={1}>
      Received
    </Typography>
    {commsRecv?.map((comm, index: number) => (
      <Paper
        key={index}
        sx={{
          mb: 2,
          mx: "auto",
          maxWidth: "44rem",
          p: 2,
          backgroundColor: grey[200],
          borderRadius: "18px",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "row" }} minHeight="6.5rem">
          <Avatar>
            <Image
              fill
              src={comm.recipient.imageURL ?? stinger.src}
              alt={comm.recipient.name}
            />
          </Avatar>
          <Stack ml={2}>
            <Box display={"flex"}>
              <Typography fontWeight={"bold"}>{comm.sender.name}</Typography>
              <ArrowCircleRight sx={{ ml: 1 }} />
              <Typography fontWeight="bold" ml={1}>
                {comm.recipient.name}
              </Typography>
            </Box>
            <Typography
              fontSize="0.9rem"
              sx={{ wordWrap: "normal", wordBreak: "break-word" }}
            >
              {comm.message}
            </Typography>
          </Stack>
        </Box>
      </Paper>
    ))}
  </Box>
);

export default function AdminTeamView({
  firstDate,
  secondDate,
}: {
  firstDate: dayjs.Dayjs;
  secondDate: dayjs.Dayjs;
}) {
  const { data } = useSession();
  const user = data?.user;
  const [teamSelected, setTeamSelected] = useState("");
  const [exec, setExec] = useState<MemberWithTeams>({} as MemberWithTeams);
  const [commsSent, setCommsSent] = useState<Array<CommendationWithPeople>>();
  const [commsRecv, setCommsRecv] = useState<Array<CommendationWithPeople>>();
  const theme = useTheme();
  const bigScreen = useMediaQuery(theme.breakpoints.up("sm"));
  const [sentSelected, setSentSelected] = useState(true);

  useEffect(() => {
    fetch(`/api/user/teams?email=${user?.email}`).then((res) =>
      res.json().then((j: MemberWithTeams) => {
        setExec(j);
        setTeamSelected(j.teams[0].id);
      }));
  }, [user?.email]);

  useEffect(() => {
    if (teamSelected) {
      fetch(`/api/teams?id=${teamSelected}&firstDate=${firstDate
        .toDate()
        .getTime()}&secondDate=${secondDate.toDate().getTime()}`).then((res) =>
        res.json().then((j) => {
          setCommsSent(j.sentComms);
          setCommsRecv(j.recvComms);
        }));
    }
  }, [teamSelected, firstDate, secondDate]);

  return (
    <Box>
      <Box
        mx={2}
        display="flex"
        flexDirection="row"
        sx={{ justifyContent: "space-between" }}
      >
        {!bigScreen ? (
          <FormControl>
            <InputLabel id="type-select-label" sx={{ mt: 1 }}>
              Type
            </InputLabel>
            <Select
              label="Type"
              labelId="type-select-label"
              name="commType"
              value={sentSelected}
              justify-content={"space-between"}
              onChange={(e) => setSentSelected(e.target.value === "true")}
              sx={{ minWidth: "150px", height: "56px", mt: 1, mr: 1}}
            >
              <MenuItem key={0} value={"true"} sx={{ width: "fit-container", fontWeight: 700 }}>
                <Box display={"flex"}>
                  <Image
                    src={Send}}
                    alt={"Team image"}
                    width={25}
                    height={25}
                    style={{ objectFit: "contain" }}
                  />
                  <Typography my={"auto"} fontWeight={700} ml={2}>
                    Sent
                  </Typography>
                </Box>
              </MenuItem>
              <MenuItem key={1} value={"false"} sx={{ width: "fit-container", fontWeight: 700 }}>
                <Box display={"flex"}>
                  <Image
                    src={Newspaper}
                    alt={"Team image"}
                    width={25}
                    height={25}
                    style={{ objectFit: "contain" }}
                  />
                  <Typography my={"auto"} fontWeight={700} ml={2} width={"fit-content"}>
                    Received
                  </Typography>
                </Box>
              </MenuItem>
            </Select>
          </FormControl>
        ) : (
          <></>
        )}
        <FormControl>
          <InputLabel id="team-select-label" sx={{ mt: 1 }}>
            Team
          </InputLabel>
          <Select
            label="Team"
            labelId="team-select-label"
            name="team"
            value={teamSelected}
            justify-content={"space-between"}
            onChange={(e: SelectChangeEvent) => setTeamSelected(e.target.value)}
            sx={{ minWidth: "100px", mt: 1 }}
          >
            {exec.teams?.map((currentTeam: Team, index: number) => (
              <MenuItem key={index} value={currentTeam.id}>
                <Box display={"flex"}>
                  <Image
                    src={
                      currentTeam.imageURL ??
                      "https://via.placeholder.com/25?text="
                    }
                    alt={"Team image"}
                    width={25}
                    height={25}
                    style={{ objectFit: "contain" }}
                  />
                  <Typography my={"auto"} fontWeight={700} ml={2}>
                    {currentTeam.name}
                  </Typography>
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Box display={"flex"} px={1}>
        {bigScreen ? (
          <>
            {sentCommendations(commsSent ?? [])}
            {recvCommendations(commsRecv ?? [])}
          </>
        ) : (
          <>
            {sentSelected
              ? sentCommendations(commsSent ?? [])
              : recvCommendations(commsRecv ?? [])}
          </>
        )}
      </Box>
    </Box>
  );
}
