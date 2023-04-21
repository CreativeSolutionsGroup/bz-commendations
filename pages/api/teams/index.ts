import { getTeamCommendations } from "@/lib/api/teams";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;
    const commendations = await getTeamCommendations(id as string);

    return res.status(200).json(commendations);
}