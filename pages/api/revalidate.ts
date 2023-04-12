import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest,
  res: NextApiResponse) {
  const { urlPath } = req.body;
  res.setHeader("Access-Control-Allow-Origin", "https://next.bz-cedarville.com");
  res.setHeader("Access-Control-Allow-Methods", "ITEM");

  try {
    await res.revalidate(urlPath);

    res.status(200).json({
      message: "OK",
    });
  } catch (error) {
    res.status(500).json({
      message: `Failed to revalidate "${urlPath}"`,
    });
  }
}