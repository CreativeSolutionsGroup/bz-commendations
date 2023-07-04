import { Snackbar, Alert, Fab, Link, Tooltip } from "@mui/material";
import { useState, SyntheticEvent, useEffect } from "react";
import GroupsIcon from "@mui/icons-material/Groups";
import { useRouter } from "next/router";

interface ElementsProps {
  defaultOpen: boolean
}

export default function IndexAbsoluteElements() {
  const router = useRouter();
  const [open, setOpen] = useState(router.query.success === "true");
  const [disable, setDisable] = useState(false);

  useEffect(() => setOpen(router.query.success === "true"), [router.query.success]);
  useEffect(() => setDisable(router.pathname == "/team"));

  const handleClose = async (_?: SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  return (
    <>
      <Snackbar open={open} autoHideDuration={4000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ wdith: "100%" }}>
          Successfully sent!
        </Alert>
      </Snackbar>
      <Fab color="secondary" aria-label="teams" sx={{ position: "fixed", bottom: 16, right: 16 }} href="/team" disabled={disable}>
        <GroupsIcon />
      </Fab>
    </>
  );
}