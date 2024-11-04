import { getServerSession } from "next-auth";
import { withAuth } from "next-auth/middleware";
import { redirect } from "next/dist/server/api-utils";
import { NextRequest, NextResponse } from "next/server";

export default withAuth({
  callbacks: {
    authorized: ({ req, token }) => {
      const { pathname, searchParams, protocol, host, port } = req.nextUrl;

      if (pathname === "/signin") {
        return true;
      }

      if (!token) {
        return false;
      }

      if (pathname === "/admin") {
        return token?.isAdmin ?? false;
      }

      // otherwise, if you were allowed to login, you're good.
      return !!token;
    },
  },
});

export const config = {
  matcher: ["/(.*)"],
};
