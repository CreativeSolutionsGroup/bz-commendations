import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { createCommendation, emailToId, idToEmail, idToName, idToPhoneNumber, readAllCommendations, sendBzEmail, sendBzText, updateMemberImageURL } from "../../../lib/api/commendations";
import { revalidate } from "../../../lib/revalidate";
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
      const sender = await emailToId(session?.user?.email as string);
      const recipient = req.body.recipient as string;
      const msg = req.body.msg as string;
      const recipientEmail = await idToEmail(recipient);

      if (sender == null || session?.user?.email === recipientEmail) {
        console.log("Error: Bad email");
        res.redirect("/?success=false");
        return
      }

      if (req.body.recipient == null || req.body.msg == null) {
        console.error("Error: No recipient or no message. ")
        res.redirect("/?success=false")
        return
      }

      const update = await updateMemberImageURL(session?.user?.image as string, sender as string)
      const commendation = await createCommendation(sender as string, recipient, msg);
      sendBzEmail(session?.user?.email as string, recipientEmail, session?.user?.name as string, msg);
      sendBzText(await idToPhoneNumber(recipient), session?.user?.name as string, msg);
      try {
        await revalidate(req.headers.host ?? "https://next.bz-cedarville.com", recipientEmail);
      } catch (e) {
        console.error("Revalidation failed");
      }
      res.redirect(302, "/?success=true");
      break;
  }
}
