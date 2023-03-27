import {
  createCommendation, emailToId, getMemberTeamLeaders, getMemberWithTeams,
  idIsMember, readAllCommendations, sendBzEmail, sendBzText, updateMemberImageURL
} from "@/lib/api/commendations";
import { revalidate } from "@/lib/revalidate";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
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

      if (await idIsMember(recipientId)) {
        const recipient = await getMemberWithTeams(recipientId);

        if (recipient == null) return res.redirect("/?success=false");

        const recipientEmail = recipient.email;

        const pImage = (recipient.imageURL == null) && updateMemberImageURL(session?.user?.image as string, sender as string);
        // log the commendation
        const pCommendation = createCommendation(sender as string, recipientId, msg);
        // send email to the recip
        const pEmail = sendBzEmail(session?.user?.email as string, [recipientEmail], session?.user?.name as string, msg);
        // send text to the recip
        const pText = (recipient.phone != null) ? sendBzText(recipient.phone, session?.user?.name as string, msg) : null;
        try {
          await Promise.all([pCommendation, pEmail, pText, pImage]);
        } catch (e) {
          console.error(`Error creating commendation ${JSON.stringify(e)}`);
          return res.redirect(500, "/?success=false");
        }
        try {
          await revalidate(req.headers.host ?? "https://next.bz-cedarville.com", recipientEmail);
        } catch (e) {
          console.error("Revalidation failed");
        }
        res.redirect(302, "/?success=true");
      } else {
        const teamLeaders = await getMemberTeamLeaders([recipientId]);
        const teamLeadersEmails = teamLeaders.reduce((curr, l) => {
          const leads = l.teams.flatMap(t => t.teamLeaders.map(tl => tl.member.email));
          const rem = leads.filter(l => !curr.includes(l));
          return [...curr, ...rem];
        }, [] as Array<string>);
        
        // log the commendation
        const pCommendation = createCommendation(sender as string, await emailToId(teamLeadersEmails[0]) ?? "", msg);
        // inbuilt jank protection! if there are < 10 people you want to send an email to, go ahead.
        const pTeamEmail = (teamLeadersEmails.length < 10) && sendBzEmail(session?.user?.email as string, teamLeadersEmails, session?.user?.name as string, msg, { isTeam: true });
        try {
          await Promise.all([pCommendation, pTeamEmail]);
        } catch (e) {
          console.error(`Error creating commendation ${JSON.stringify(e)}`);
          return res.redirect(500, "/?success=false");
        }
        try {
          await revalidate(req.headers.host ?? "https://next.bz-cedarville.com", teamLeadersEmails[0]);
        } catch (e) {
          console.error("Revalidation failed");
        }
        res.redirect(302, "/team?success=true");
      }
      break;
  }
}
