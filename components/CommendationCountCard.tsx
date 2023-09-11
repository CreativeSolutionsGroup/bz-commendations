import { CommendationStatInfo } from "@/types/admin";
import { Box, Paper, Typography } from "@mui/material";
import Image from "next/image";

export default function CommendationCountCard({stats}: {stats: CommendationStatInfo}) {
  return (
    <Paper sx={{ margin: 1, padding: 1, display: "flex" }} >
      <Image src={stats.imageURL ?? "https://via.placeholder.com/50?text="} alt={"User image"} width={50} height={50} style={{ borderRadius: "100%" }} />
      <Typography ml={2} my={"auto"} fontSize={20} fontWeight={700} flexGrow={1}>{stats.name}</Typography>
      <Box my={"auto"} mr={2} textAlign={"center"} sx={{ backgroundColor: "#005288", borderRadius: "100%" }} color={"white"} height={35} width={35} display={"flex"} flexDirection={"column"}>
        <Typography my={"auto"}>{stats.numCommendations}</Typography>
      </Box>
    </Paper>
  );
}