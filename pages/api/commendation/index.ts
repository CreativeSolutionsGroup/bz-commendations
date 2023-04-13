import {
  createCommendation, emailToId, getMemberTeamLeaders, getMemberWithTeams,
  idIsMember, readAllCommendations, sendBzEmail, sendBzText, updateMemberImageURL, getMemberImage
} from "@/lib/api/commendations";
import { revalidate } from "@/lib/revalidate";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession, Session } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

const sendMemberCommendation = async (
  req: NextApiRequest, res: NextApiResponse, session: Session, sender: string
) => {
  const recipientId = req.body.recipient as string;
  const msg = req.body.msg as string;

  if (recipientId === sender) return res.redirect("/?success=false");

  // log the commendation
  const pCommendation = createCommendation(
sender as string, recipientId, msg
  );
  try {
    await pCommendation;
    res.redirect(302, "/?success=true");
  } catch (e) {
    console.error(`Error creating commendation ${JSON.stringify(e)}`);
    return res.redirect(302, "/?success=false");
  }

  const recipient = await getMemberWithTeams(recipientId);
  if (recipient == null) return res.redirect("/?success=false");

  // we also want to send emails to the team leaders.
  const teamLeaders = await getMemberTeamLeaders(recipient.teams.map(t => t.id));
  const teamLeadersEmails = teamLeaders.map(t => t.email);

  const recipientEmail = recipient.email;

  const pImage = (await getMemberImage(sender) == null) && updateMemberImageURL(session?.user?.image as string, sender);
  // send email to the recip
  const pEmail = sendBzEmail(
session?.user?.email as string, [recipientEmail], session?.user?.name as string, msg
  );
  // send text to the recip
  const pText = (recipient.phone != null) ? sendBzText(
    recipient.phone, session?.user?.name as string, msg
  ) : null;
  
  // inbuilt jank protection! if there are < 10 people you want to send an email to, go ahead.
  const pTeamEmail = (teamLeadersEmails && teamLeadersEmails.length < 10) && sendBzEmail(
session?.user?.email as string, teamLeadersEmails, session?.user?.name as string, msg, { isTeam: true }
  );



  try {
    await Promise.all([pTeamEmail, pEmail, pText, pImage, revalidate("https://next.bz-cedarville.com", recipientEmail)]);
  } catch (e) {
    console.error(`Revalidation failed ${JSON.stringify(e)}`);
  }
  return;
};

const sendTeamCommendation = async (
  req: NextApiRequest, res: NextApiResponse, session: Session, sender: string
) => {
  const teamId = req.body.recipient as string;
  const msg = req.body.msg as string;

  const teamLeaders = await getMemberTeamLeaders([teamId]);
  const teamLeadersEmails = teamLeaders.map(t => t.email);

  // log the commendation (except don't because we don't have a recipient)
  // const pCommendation = createCommendation(sender as string, await emailToId(teamLeadersEmails[0]) ?? "", msg);

  // inbuilt jank protection! if there are < 10 people you want to send an email to, go ahead.
  const pTeamEmail = (teamLeadersEmails.length < 10) && sendBzEmail(
session?.user?.email as string, teamLeadersEmails, session?.user?.name as string, msg, { isTeam: true }
  );
  try {
    await pTeamEmail;
  } catch (e) {
    console.error(`Error creating commendation ${JSON.stringify(e)}`);
    return res.redirect(500, "/?success=false");
  }

  // No revalidation because we aren't actually adding a commendation to the database
  res.redirect(302, "/team?success=true");
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(
    req, res, authOptions
  );
  if (!session || !session.user) {
    return res.redirect("/api/auth/signin");
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
        console.error("Error: No recipient or no message. ");
        return res.redirect("/?success=false");
      }

      if (await idIsMember(req.body.recipient as string)) {
        sendMemberCommendation(
          req, res, session, sender as string
        );
      } else {
        sendTeamCommendation(
          req, res, session, sender
        );
      }
      break;
  }
}
