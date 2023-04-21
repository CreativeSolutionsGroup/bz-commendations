import { TeamsList } from "@/types/admin";
import { useSession } from "next-auth/react";

export default function AdminTeamView({ teams }: { teams: TeamsList }) {
  const { data: user } = useSession();
  
  return (
    <>

    </>
  )
}