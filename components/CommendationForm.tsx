import bz from "@/assets/bz-logo.png";
import { MemberWithTeams, TeamWithMembers } from "@/types/commendation";
import { Person } from "@mui/icons-material";
import SendIcon from "@mui/icons-material/Send";
import { Autocomplete, Avatar, Button, ListSubheader, MenuItem, Paper, Popper, Stack, TextField, Typography } from "@mui/material";
import { autocompleteClasses } from "@mui/material/Autocomplete";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/system";
import { Raleway } from "@next/font/google";
import { Team } from "@prisma/client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { HTMLAttributes, ReactNode, createContext, forwardRef, useContext, useEffect, useRef, useState } from "react";
import { ListChildComponentProps, VariableSizeList } from "react-window";
import VirtualizedAutocomplete from "./VirtualizedAutocomplete";

const raleway = Raleway({ subsets: ["latin"], weight: "900" });

const isMemberListItem = (obj: any): obj is Array<MemberWithTeams> => {
  return obj[0].email !== undefined;
};

export default function CommendationForm({ recipients, teamTab }: { recipients: (MemberWithTeams | TeamWithMembers)[], teamTab?: boolean }) {
  const [sending, setSending] = useState(false);
  const [itemData, setToItem] = useState("");
  const [_recipients, setRecipients] = useState(recipients);

  const { data: session, status } = useSession();

  useEffect(() => {
    if (status !== "authenticated") return;
    if (isMemberListItem(recipients)) {
      setRecipients(recipients.filter(member => (member as MemberWithTeams).email !== session?.user?.email));
    }
  }, [status, recipients, session?.user?.email]);

  return (
    <Paper sx={{ mt: 4, mx: "auto", maxWidth: "30rem", p: 2 }}>
      <form onSubmit={() => setSending(true)} action="api/commendation" method="POST">
        <Stack spacing={1}>
          <Typography color="primary" className={raleway.className} fontSize={25} fontWeight={900}>Create {teamTab ? "Team" : ""} Commendation</Typography>
          <TextField sx={{ display: "none" }} hidden name="recipient" value={itemData} />
          <VirtualizedAutocomplete onChange={setToItem} options={_recipients}/>
          <TextField required label="Message" variant="filled" name="msg" minRows={8} multiline={true} />
          <Button disabled={sending} variant="contained" color="secondary" type="submit" endIcon={<SendIcon />} sx={{ fontSize: 18, textTransform: "uppercase", minWidth: "fit-content" }}>
            <Typography className={raleway.className} fontSize={18} fontWeight={900}>Send</Typography>
          </Button>
        </Stack>
      </form>
    </Paper>
  );
};