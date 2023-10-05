import AdminMemberLeaderboardView from "@/components/AdminMemberLeaderboardView";
import AdminTeamLeaderboardView from "@/components/AdminTeamLeaderboardView";
import AdminSquareView from "@/components/AdminSquareView";
import AdminTeamView from "@/components/AdminTeamView";
import AdminOverview from "@/components/AdminOverview";
import { TimeRangeCommendations } from "@/types/commendation";
import { EmojiEvents, GridView, Group, Newspaper, Settings } from "@mui/icons-material";
import { Button, Card, CircularProgress, Divider, Drawer, IconButton, List, ListItem, ListItemButton, Menu, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/system";
import { DatePicker } from "@mui/x-date-pickers";
import { Raleway } from "@next/font/google";
import dayjs from "dayjs";
import { MouseEvent, useEffect, useState } from "react";
import theme from "@/config/theme";

const raleway = Raleway({ subsets: ["latin"], weight: "900" });

export default function Admin() {
  const [viewMode, setViewMode] = useState("overview");
  const [data, setData] = useState<TimeRangeCommendations>({} as TimeRangeCommendations);
  const [firstDate, setFirstDate] = useState<dayjs.Dayjs | null>(dayjs().set("date", 1).set("hours", 1));
  const [secondDate, setSecondDate] = useState<dayjs.Dayjs | null>(dayjs());
  const [settingsAnchorEl, setSettingsAnchorEl] =
    useState<null | HTMLElement>();
  const settingsOpen = Boolean(settingsAnchorEl);
  const handleSettingsClick = (event: MouseEvent<HTMLElement>) => {
    setSettingsAnchorEl(event.currentTarget);
  };
  const handleSettingsClose = () => {
    setSettingsAnchorEl(null);
  };

  useEffect(() => {
    fetch(`/api/commendation?firstDate=${firstDate}&secondDate=${secondDate}`)
      .then((r) => r.json())
      .then((j) => setData(j));
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

  const drawerWidth = 260;

  return (
    <Box display={"flex"} flexDirection={"row"}>
      <Box width={drawerWidth}>
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              position: "relative",
              borderColor: "white",
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
          variant="permanent"
          anchor="left"
        >
          <List>
            <ListItemButton
              onClick={() => {
                setViewMode("overview");
              }}
            >
              <Box display={"flex"} flexDirection={"row"}>
                <Newspaper />
                <Typography ml={1} fontWeight="bold">Overview</Typography>
              </Box>
            </ListItemButton>
            <ListItemButton
              onClick={() => {
                setViewMode("square");
              }}
            >
              <Box display={"flex"} flexDirection={"row"}>
                <GridView />
                <Typography ml={1} fontWeight="bold">
                  Square
                </Typography>
              </Box>
            </ListItemButton>
            <ListItemButton
              onClick={() => {
                setViewMode("memberLeaderboard");
              }}
            >
              <Box display={"flex"} flexDirection={"row"}>
                <EmojiEvents />
                <Typography ml={1} fontWeight={700}>
                  Member Leaderboard
                </Typography>
              </Box>
            </ListItemButton>
            <ListItemButton
              onClick={() => {
                setViewMode("teamLeaderboard");
              }}
            >
              <Box display={"flex"} flexDirection={"row"}>
                <EmojiEvents />
                <Typography ml={1} fontWeight={700}>
                  Team Leaderboard
                </Typography>
              </Box>
            </ListItemButton>
            <ListItemButton
              onClick={() => {
                setViewMode("teams");
              }}
            >
              <Box display={"flex"} flexDirection={"row"}>
                <Group />
                <Typography ml={1} fontWeight={700}>
                  Teams
                </Typography>
              </Box>
            </ListItemButton>
          </List>
          <Divider />
          <List>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                marginRight: 2,
                marginTop: 1,
                marginLeft: 2,
              }}
            >
              <Box flexGrow={1} />
              <Typography mr={1} fontWeight={700}>Start</Typography>
              <DatePicker
                value={firstDate}
                onChange={(v) => {
                  v && setFirstDate(v);
                  v && fetch(`/api/admin?first=${v}`, { method: "POST" });
                  handleSettingsClose();
                }}
                sx={{ width: 175, marginRight: 1 }}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                marginRight: 2,
                marginTop: 1,
              }}
            >
              <Box flexGrow={1} />
              <Typography mr={1} fontWeight={700}>End</Typography>
              <DatePicker
                value={secondDate}
                onChange={(v) => {
                  v && setSecondDate(v);
                  v && fetch(`/api/admin?second=${v}`, { method: "POST" });
                  handleSettingsClose();
                }}
                sx={{ width: 175, marginRight: 1 }}
              />
            </Box>
            <Button
              sx={{
                float: "right",
                marginTop: 1,
                marginRight: 3,
                marginBottom: 2,
              }}
              onClick={() => {
                const first = dayjs().set("date", 1).set("hour", 1);
                const second = dayjs();
                setFirstDate(first);
                fetch(`/api/admin?first=${first}`, { method: "POST" });
                setSecondDate(second);
                fetch(`/api/admin?second=${second}`, { method: "POST" });
                handleSettingsClose();
              }}
            >
              <Typography
                color={theme.palette.primary.main}
                fontWeight="bold"
                textTransform="capitalize"
              >
                Reset Date Range
              </Typography>
            </Button>
          </List>
        </Drawer>
      </Box>
      <Box width={`calc(100% - ${drawerWidth}px)`}>
        <Box display={"flex"} flexDirection={"row"} flexWrap={"wrap"}>
          <Typography
            sx={{
              textAlign: "center",
              fontSize: 30,
              fontWeight: 900,
              marginTop: 1,
              flexGrow: 1,
              className: raleway.className,
            }}
          >
            Admin Dashboard
          </Typography>
        </Box>
        {data.teams == null ? (
          <CircularProgress />
        ) : (
          <>
            {viewMode === "overview" ? (
              <AdminOverview members={data.members} teams={data.teams} />
            ) : viewMode === "square" ? (
              <AdminSquareView teams={data.teams} />
            ) : viewMode === "memberLeaderboard" ? (
              <AdminMemberLeaderboardView members={data.members} />
            ) : viewMode === "teamLeaderboard" ? (
              <AdminTeamLeaderboardView teams={data.teams} />
            ) : (
              <AdminTeamView
                firstDate={firstDate ?? new dayjs.Dayjs().set("date", 1)} // set to the first day of the month
                secondDate={secondDate ?? dayjs()}
              />
            )}
          </>
        )}
      </Box>
      { viewMode !== "overview" &&
        <Box sx={{ position: "fixed", bottom: 0, display: "flex" }}>
          <Card sx={{ marginLeft: 1, marginBottom: 1, fontSize: 20, padding: 1 }}>
            <Typography color={theme.palette.primary.main} fontWeight="bold">Commendation Count: {data.members?.sendMembers.reduce((prev, curr) => prev + curr.sentCommendations.length, 0)}</Typography>
          </Card>
        </Box>
      }
    </Box>
  );
}
