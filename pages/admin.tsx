import AdminLeaderboardView from "@/components/AdminLeaderboardView";
import AdminSquareView from "@/components/AdminSquareView";
import { TimeRangeCommendations } from "@/lib/api/teams";
import { EmojiEvents, GridView, Settings } from "@mui/icons-material";
import { Card, IconButton, Menu, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/system";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { MouseEvent, useEffect, useState } from "react";

export default function Admin() {
  const [viewMode, setViewMode] = useState("square");
  const [data, setData] = useState<TimeRangeCommendations>({} as TimeRangeCommendations);
  const [firstDate, setFirstDate] = useState<dayjs.Dayjs | null>(dayjs().set("date", 1).set("hours", 1));
  const [secondDate, setSecondDate] = useState<dayjs.Dayjs | null>(dayjs());
  const [settingsAnchorEl, setSettingsAnchorEl] = useState<null | HTMLElement>();
  const settingsOpen = Boolean(settingsAnchorEl);
  const handleSettingsClick = (event: MouseEvent<HTMLElement>) => {
    setSettingsAnchorEl(event.currentTarget);
  };
  const handleSettingsClose = () => {
    setSettingsAnchorEl(null);
  };

  useEffect(() => {
    fetch(`/api/commendation?firstDate=${firstDate}&secondDate=${secondDate}`).then((res) => {
      res.json().then((value) => setData(value));
    });
  }, [firstDate, secondDate]);

  useEffect(() => {
    const first = getCookie("admin-first-date");
    const second = getCookie("admin-second-date");

    if (first && second) {
      setFirstDate(dayjs(decodeURIComponent(first)));
      setSecondDate(dayjs(decodeURIComponent(second)));
    }
  }, []);

  function getCookie(key: string) {
    const b = document.cookie.match("(^|;)\\s*" + key + "\\s*=\\s*([^;]+)");
    return b ? b.pop() : "";
  }

  return (
    <>
      <main>
        <Box display={"flex"} flexDirection={"row"} flexWrap={"wrap"}>
          <Typography
            sx={{
              textAlign: "center",
              fontSize: 24,
              fontWeight: "bold",
              marginTop: 1,
              flexGrow: 1,
            }}
          >
            Admin Dashboard
          </Typography>
          <Menu
            anchorEl={settingsAnchorEl}
            open={settingsOpen}
            onClose={handleSettingsClose}
          >
            <MenuItem sx={{ display: "flex" }}>
              <Box flexGrow={1} />
              <Typography mr={1}>Start Date</Typography>
              <DatePicker
                value={firstDate}
                onChange={v => {
                  v && setFirstDate(v);
                  v && fetch(`/api/admin?first=${v}`, { method: "POST" });
                  handleSettingsClose();
                }}
                sx={{ width: 175, marginRight: 1 }}
              />
            </MenuItem>
            <MenuItem sx={{ display: "flex" }}>
              <Box flexGrow={1} />
              <Typography mr={1}>End Date</Typography>
              <DatePicker
                value={secondDate}
                onChange={v => {
                  v && setSecondDate(v);
                  v && fetch(`/api/admin?second=${v}`, { method: "POST" });
                  handleSettingsClose();
                }}
                sx={{ width: 175, marginRight: 1 }}
              />
            </MenuItem>
            <MenuItem onClick={handleSettingsClose} sx={{ display: "flex" }}>
              <Box flexGrow={1} />
              <Typography mr={1}>Mode</Typography>
              <Select label="View" name="view" value={viewMode} onChange={(e: SelectChangeEvent) => setViewMode(e.target.value)} sx={{ marginRight: 1 }}>
                <MenuItem key={1} value={"square"}>
                  <Box display={"flex"} flexDirection={"row"}>
                    <GridView />
                    <Typography ml={1} fontWeight="bold">Square View</Typography>
                  </Box>
                </MenuItem>
                <MenuItem key={2} value={"leaderboard"}>
                  <Box display={"flex"} flexDirection={"row"}>
                    <EmojiEvents />
                    <Typography ml={1} fontWeight={700}>Leaderboard</Typography>
                  </Box>
                </MenuItem>
              </Select>
            </MenuItem>
          </Menu>
          <IconButton onClick={handleSettingsClick} sx={{ position: "absolute", right: 6, top: 70 }}>
            <Settings sx={{ marginY: "auto" }}></Settings>
          </IconButton>
        </Box>
        {viewMode === "square" ?
          <AdminSquareView teams={data.teams} /> :
          <AdminLeaderboardView members={data.members} />
        }
        <Box sx={{ position: "fixed", bottom: 0, display: "flex" }}>
          <Card sx={{ marginLeft: 1, marginBottom: 1, fontSize: 20, padding: 1 }}>Total commendations sent: {data.teams?.reduce((prev, curr) => prev + curr.sentCommendations, 0)}</Card>
        </Box>
      </main>
    </>
  );
}