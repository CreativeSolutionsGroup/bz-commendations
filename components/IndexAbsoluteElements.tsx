import { Snackbar, Alert, Fab, Link } from "@mui/material";
import { useState, SyntheticEvent, useEffect } from "react";
import GroupsIcon from "@mui/icons-material/Groups";
import { useRouter } from "next/router";

interface ElementsProps {
  defaultOpen: boolean
}

export default function IndexAbsoluteElements() {
  const router = useRouter();
  const [open, setOpen] = useState(router.query.success === "true");

  useEffect(() => setOpen(router.query.success === "true"), [router.query.success]);

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
      <Fab color="secondary" aria-label="teams" sx={{ position: "absolute", bottom: 16, right: 16 }} href="/team">
        <GroupsIcon />
      </Fab>
    </>
  );
}