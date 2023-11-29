import { createCommendation, createTeamCommendation, emailToId, getMemberImage, getMemberTeamLeaders, getMemberWithTeams, idIsMember, readAllMembersFromTeam, sendBzEmail, sendBzText, updateMemberImageURL } from "@/lib/api/commendations";
import { getTeam, getTimeRangeCommendations } from "@/lib/api/teams";
import { revalidate } from "@/lib/revalidate";
import { NextApiRequest, NextApiResponse } from "next";
import { Session, getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

const sendMemberCommendation = async (
  req: NextApiRequest, res: NextApiResponse, session: Session
) => {
  const recipientId = req.body.recipient as string;
  const msg = req.body.msg as string;
  const sender = await emailToId(session.user?.email ?? "") ?? "";

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

  // we also want to send emails to the team leaders
  const teamLeaders = await getMemberTeamLeaders(recipient.teams.map(t => t.id));
  const teamLeadersEmails = teamLeaders.map(t => t.email);

  const recipientEmail = recipient.email;

  const pImage = (await getMemberImage(sender) == null) && updateMemberImageURL(session?.user?.image as string, sender);
  // send email to the recip
  const pEmail = sendBzEmail(
    session?.user?.email as string, [recipientEmail], session?.user?.name as string, "you", msg
  );
  // send text to the recip
  const pText = (recipient.phone != null) ? sendBzText(
    recipient.phone, session?.user?.name as string, msg
  ) : null;

  // inbuilt jank protection! if there are < 10 people you want to send an email to, go ahead.
  const pTeamEmail = (teamLeadersEmails && teamLeadersEmails.length < 10) && sendBzEmail(
    session?.user?.email as string, teamLeadersEmails, session?.user?.name as string, recipient.name, msg, { isTeam: true }
  );


  try {
    await Promise.all([pTeamEmail, pEmail, pText, pImage, revalidate("https://next.bz-cedarville.com", recipientEmail)]);
  } catch (e) {
    console.error(`Revalidation failed ${JSON.stringify(e)}`);
  }
  return;
};

const sendTeamCommendation = async (
  req: NextApiRequest, res: NextApiResponse, session: Session
) => {
  const teamId = req.body.recipient as string;
  const sender = await emailToId(session.user?.email ?? "") ?? "";
  const msg = req.body.msg as string;

  const teamLeaders = await getMemberTeamLeaders([teamId]);
  const teamMembers = await readAllMembersFromTeam(teamId);
  const team = await getTeam(teamId);

  const allMembers = [...teamLeaders, ...teamMembers];
  const uniqueEmails = new Set();
  const members = allMembers.filter(obj => !uniqueEmails.has(obj.email) && uniqueEmails.add(obj.email));
  const memberEmails = members.map(t => t.email);

  // log the commendation
  const pCommendation = createTeamCommendation(
    sender, teamId, msg
  );

  const pTeamEmail = sendBzEmail(
    session?.user?.email as string, memberEmails, session?.user?.name as string, team?.name as string, msg, { isTeam: true }
  );
  try {
    await Promise.all([pCommendation, pTeamEmail]);
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
      if (!session.isAdmin) {
        return res.status(401).send("401 UNAUTHORIZED");
      }

      const { firstDate, secondDate } = req.query;
      const dateRange = {
        createdAt: {
          gte: firstDate ? new Date(firstDate as string) : new Date(0),
          lte: secondDate ? new Date(secondDate as string) : new Date(3000, 0),
        },
      };
      const commendations = await getTimeRangeCommendations(dateRange);

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
          req, res, session
        );
      } else {
        sendTeamCommendation(
          req, res, session
        );
      }
      break;
  }
}
