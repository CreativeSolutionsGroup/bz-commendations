import { serialize } from "cookie";
import type { NextApiRequest, NextApiResponse } from "next";


export default function SetDateCookie(req: NextApiRequest, res: NextApiResponse) {
  if (req.query.first) {
    const dateCookie = serialize("admin-first-date", req.query.first as string, {
      path: "/",
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 31),
      sameSite: "lax",
    });
    res.setHeader("Set-Cookie", dateCookie);
  } else if (req.query.second) {
    const dateCookie = serialize("admin-second-date", req.query.second as string, {
      path: "/",
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 31),
      sameSite: "lax",
    });
    res.setHeader("Set-Cookie", dateCookie);
  }
  res.status(200).json({ message: "Successfully set cookie!" });
}
