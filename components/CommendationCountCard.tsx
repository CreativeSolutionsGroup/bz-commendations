import { Box, Paper, Typography } from "@mui/material";
import { Member } from "@prisma/client";
import Image from "next/image";

export default function CommendationCountCard({member}: {member: Member & {
  sentCommendations?: {
      id: string;
  }[],
  commendations?: {
    id: string;
  }[];
}}) {
  return (
    <Paper sx={{ margin: 1, padding: 1, display: "flex" }} >
      <Image src={member.imageURL ?? "https://via.placeholder.com/50?text="} alt={"User image"} width={50} height={50} style={{ borderRadius: "100%" }} />
      <Typography ml={2} my={"auto"} fontSize={20} fontWeight={700} flexGrow={1}>{member.name}</Typography>
      <Box my={"auto"} mr={2} textAlign={"center"} sx={{ backgroundColor: "#005288", borderRadius: "100%" }} color={"white"} height={35} width={35} display={"flex"} flexDirection={"column"}>
        <Typography my={"auto"}>{member.sentCommendations ? member.sentCommendations.length : member.commendations?.length}</Typography>
      </Box>
    </Paper>
  );
}