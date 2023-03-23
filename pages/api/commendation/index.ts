import { getContactInfo } from "@/lib/api/teams";
import { revalidate } from "@/lib/revalidate";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { createCommendation, emailToId, getMemberTeamLeaders, getMemberWithTeams, readAllCommendations, sendBzEmail, sendBzText, updateMemberImageURL } from "../../../lib/api/commendations";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (session == null || session.user == null) {
    res.redirect("/api/auth/signin")
  }

  switch (req.method) {
    case "GET":
      const commendations = await readAllCommendations();
      res.json(commendations);
      break;
    case "POST":
      const sender = await emailToId((session?.user?.email) as string);

      if (sender == null) {
        console.log("Error: Bad email");
        return res.redirect("/?success=false");
      }

      if (req.body.recipient == null || req.body.msg == null) {
        console.error("Error: No recipient or no message. ")
        return res.redirect("/?success=false")
      }

      const recipientId = req.body.recipient as string;
      const msg = req.body.msg as string;
      const recipient = await getMemberWithTeams(recipientId);

      if (recipient == null) return res.redirect("/?success=false");

      const recipientEmail = recipient.email;
      const teams = recipient.teams.map(t => t.id);

      const teamLeaders = await getMemberTeamLeaders(teams);
      const teamLeadersEmails = teamLeaders.flatMap(l => l.teams.flatMap(t => t.TeamLeaders.map(tl => tl.Member.email)));

      const pImage = (recipient.imageURL == null) && updateMemberImageURL(session?.user?.image as string, sender as string);
      const pCommendation = createCommendation(sender as string, recipientId, msg);      
      const pEmail = sendBzEmail(session?.user?.email as string, [recipientEmail, ...teamLeadersEmails], session?.user?.name as string, msg);
      const pText = (recipient.phone != null) ? sendBzText(recipient.phone, session?.user?.name as string, msg) : null;
      const pValidate = revalidate(req.headers.host ?? "https://next.bz-cedarville.com", recipientEmail);
      try {
        await Promise.all([pImage, pCommendation, pEmail, pText, pValidate]);
      } catch (e) {
        console.error(`Error creating commendation ${JSON.stringify(e)}`);
        return res.redirect(500, "/?success=false");
      }

      res.redirect(302, "/");
      break;
  }
}