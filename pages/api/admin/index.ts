import { serialize } from "cookie";
import type { NextApiRequest, NextApiResponse } from "next";

/**
 * Uses two query parameters to set cookies for admin date range persistence
 * 
 * `/api/admin?first=<date>` will set the primary date
 * 
 * `/api/admin?second=<date>` will set the secondary date
 * 
 * Uses the Set-Cookie header to tell the client what to do.
 * 
 * @param req the API request from next
 * @param res the API response that we send back
 */
export default function SetDateCookie(req: NextApiRequest, res: NextApiResponse) {
  if (req.query.first) {
    const dateCookie = serialize(
      "admin-first-date", req.query.first as string, {
        path: "/",
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 31),
        sameSite: "lax",
      }
    );
    res.setHeader("Set-Cookie", dateCookie);
  } else if (req.query.second) {
    const dateCookie = serialize(
      "admin-second-date", req.query.second as string, {
        path: "/",
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 31),
        sameSite: "lax",
      }
    );
    res.setHeader("Set-Cookie", dateCookie);
  }
  res.status(200).json({ message: "Successfully set cookie!" });
}
