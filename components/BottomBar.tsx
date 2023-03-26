import { BottomNavigation, BottomNavigationAction, Box, Paper } from "@mui/material";
import { useState } from "react";
import CallReceivedIcon from '@mui/icons-material/CallReceived';
import CallMadeIcon from '@mui/icons-material/CallMade';
import { useSession } from "next-auth/react";
import Link from "next/link";

export const BottomBar = () => {
    const { data: session } = useSession()
    const [value, setValue] = useState(0);
    
    return (
      <Box pt={8} >
        <BottomNavigation showLabels value={value} component={Paper} elevation={3} sx={{ position: "fixed", bottom: 0, minWidth: "100%", mt: 5 }} onChange={(event, newValue) => { setValue(newValue); }}>
          <BottomNavigationAction label="Received" value="/received" href={`/me/received/${session?.user?.email}`} LinkComponent={Link} icon={<CallReceivedIcon />} />
          <BottomNavigationAction label="Sent" value="/sent" href={`/me/sent/${session?.user?.email}`} LinkComponent={Link} icon={<CallMadeIcon />} />
        </BottomNavigation>
      </Box>
    );
}