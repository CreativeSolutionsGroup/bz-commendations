import { emailToId, getMemberWithTeams } from "@/lib/api/commendations";
import type { NextApiRequest, NextApiResponse } from "next";

/**
 * 
 * 
 * @param req the API request from next
 * @param res the API response that we send back
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email } = req.query;
  const member = await getMemberWithTeams(await emailToId(email as string) ?? "");

  return res.status(200).json(member);
}
