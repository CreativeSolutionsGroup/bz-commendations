import { getTeamCommendationsInRange } from "@/lib/api/teams";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest,
  res: NextApiResponse) {
  const { id, firstDate, secondDate } = req.query;

  const commendations = await getTeamCommendationsInRange(
    id as string,
    new Date(Number.parseInt(firstDate as string)),
    new Date(Number.parseInt(secondDate as string))
  );

  return res.status(200).json(commendations);
}
