import { CommendationStatInfo } from "@/types/admin";
import { Avatar, Box, Paper, Typography } from "@mui/material";
import Image from "next/image";


export default function CommendationCountCard({name, imageURL, numCommendations}: CommendationStatInfo) {
  return (
    <Paper sx={{ margin: 1, padding: 1, display: "flex" }}>
      <Avatar  sx={{ borderRadius: "100%", width: 50, height:50}}>
        <Box 
          component="img"
          sx={{
            height: "100%",
            width: 50,
          }}
          src={imageURL ?? "https://via.placeholder.com/50?text="}
          alt={"User image"}
          
          style={{objectFit: "contain", background:"white"}}
        />
      </Avatar> 
      <Typography ml={2} my={"auto"} fontSize={20} fontWeight={700} flexGrow={1}>{name}</Typography>
      <Box my={"auto"} mr={2} textAlign={"center"} sx={{ backgroundColor: "#005288", borderRadius: "100%" }} color={"white"} height={35} width={35} display={"flex"} flexDirection={"column"}>
        <Typography my={"auto"}>{numCommendations}</Typography>
      </Box>
    </Paper>
  );
}