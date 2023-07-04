import { AppBar, Toolbar, IconButton, Typography, Stack, Menu, MenuItem, Box, Avatar, Tooltip } from "@mui/material";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";

import bravo from "@/assets/BZ-flag-red.png";
import zulu from "@/assets/BZ-flag.png";
import bz from "@/assets/BZ-letters-solid.png";
import Image from "next/image";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { Raleway } from "@next/font/google";
import { Analytics, Logout } from "@mui/icons-material";
import { MouseEvent, useEffect, useState } from "react";
import Skeleton from "@mui/material/Skeleton";
import theme from "@/config/theme";

const raleway = Raleway({ subsets: ["latin"], weight: "900" });

export function Header() {
  const { data: session } = useSession();
  const [anchorElement, setAnchorElement] = useState<null | HTMLElement>(null);
  const [pfpLoading, setPfpLoading] = useState(true);
  const open = Boolean(anchorElement);
  const handleClose = () => {
    setAnchorElement(null);
  };

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Link href={"/"} style={{ display: "flex", flexDirection: "row", textDecoration: "none", color: "white" }}>
          <Stack>
            <Box><Image width={35} height={20} alt="Bravo Flag" src={bravo.src}></Image></Box>
            <Box><Image width={35} height={20} alt="Zulu Flag" src={zulu.src}></Image></Box>
          </Stack>
          <Box ml={1.5} mt={0.6}><Image width={50} height={35} alt="BZ Logo" src={bz.src} /></Box>
          <Typography className={raleway.className} ml={2} mt={0.6} fontSize={25} fontWeight={900} sx={{ display: { xs: "none", sm: "block" } }}>
            COMMENDATIONS
          </Typography>
        </Link>

        <Box ml="auto" display="flex">
          {session?.isAdmin &&
            <IconButton>
              <Link href="/admin">
                <Tooltip title="Admin Dashboard">
                  <Analytics color="secondary" />
                </Tooltip>
              </Link>
            </IconButton>}
          <IconButton>
            <Link href={`/me/received/${session?.user?.email}`}>
              <Tooltip title="My Commendations">
                <ChatBubbleIcon color="secondary" />
              </Tooltip>
            </Link>
          </IconButton>
          <IconButton onClick={(e: MouseEvent<HTMLElement>) => { setAnchorElement(e.currentTarget); }}>
            <Avatar sx={{ ml: 0.5 }}>
              <Image fill onLoadingComplete={() => setPfpLoading(false)} src={session?.user?.image ?? ""} alt="" />
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorElement}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right"
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right"
            }}
            sx={{
              marginTop: "50px"
            }}
          >
            <MenuItem onClick={() => {
              signOut();
              handleClose();
            }}>
              <Typography className={raleway.className}>SIGN OUT</Typography>
              <Logout sx={{ marginLeft: 1 }} />
            </MenuItem>
          </Menu>

        </Box>
      </Toolbar>

    </AppBar>
  );
};