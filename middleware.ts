import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ req, token }) => {
      const { pathname } = req.nextUrl;
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
