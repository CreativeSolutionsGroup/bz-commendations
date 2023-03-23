import { Button, Fab, TextField, Typography, MenuItem, Stack, Avatar, Paper, Autocomplete, Snackbar, Alert } from "@mui/material"
import { Box } from "@mui/system"
import { SyntheticEvent, useState } from "react"
import { Member, Team } from "@prisma/client";
import SendIcon from "@mui/icons-material/Send"
import { Raleway } from "@next/font/google";
import Image from "next/image";
import bz from "@/assets/bz-logo.png"

const raleway = Raleway({ subsets: ["latin"], weight: "900" });

type TeamListItem = Team & { members: Array<Member> };
type MemberListItem = Member & { team: Array<Team> };

export default ({ recipients, team }: { recipients: (MemberListItem | TeamListItem)[], team?: boolean }) => {
  const [sending, setSending] = useState(false);
  const [itemData, setToItem] = useState("");


  return (
    <Paper sx={{ mt: 4, mx: "auto", maxWidth: "30rem", p: 2 }}>
      <form onSubmit={() => setSending(true)} action="api/commendation" method="POST">
        <Stack spacing={1}>
          <Typography color="primary" className={raleway.className} fontSize={25} fontWeight={900}>Create Commendation</Typography>
          <TextField sx={{ display: "none" }} hidden name="recipient" value={itemData} />
          <Autocomplete
            onChange={(_e, v) => setToItem(v?.id ?? "")}
            options={recipients}
            groupBy={(option) => option.name.charAt(0)}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => <TextField {...params} label="To" required />}
            renderOption={(props, option, state) =>
              <MenuItem key={state.index} {...props} sx={{ width: "100%" }}>
                <Box display="flex" flexDirection="row" width="100%">
                  <Avatar>
                    <Image fill src={option.imageURL ?? "https://via.placeholder.com/25?text="} alt="" placeholder="blur" blurDataURL={bz.src} />
                  </Avatar>
                  <Typography ml={1.5} mt={1}>{option.name}</Typography>
                  {!team ?
                    <Typography mt={1.5} variant="caption" color="CaptionText" align="right" maxWidth='10rem' overflow="hidden">
                      {(option as MemberListItem).team.map((team) => team.name).join(", ")}
                    </Typography>
                    : <></>
                  }
                </Box>
              </MenuItem>
            }
          />
          <TextField required label="Message" variant="filled" name="msg" minRows={8} multiline={true} />
          <Button disabled={sending} variant="contained" color="secondary" type="submit" endIcon={<SendIcon />} sx={{ fontSize: 18, textTransform: "uppercase", minWidth: "fit-content" }}>
            Send
          </Button>
        </Stack>
      </form>
    </Paper>
  )
}